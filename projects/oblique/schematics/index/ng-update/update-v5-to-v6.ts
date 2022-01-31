import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {ObIMigrations} from './ng-update.model';
import {
	addClassPrefix,
	addClassesPrefix,
	addPrefixMatchExact,
	addPrefixMatchExactOrSuffix,
	addPrefixMatchSuffix,
	minAngularVersion,
	renameExactOrSuffix
} from './ng-update-utils';
import {
	addAngularConfigInList,
	addImport,
	addInterface,
	applyInTree,
	checkIfAngularConfigExists,
	getAngularConfigs,
	getDefaultAngularConfig,
	getJson,
	infoMigration,
	packageJsonConfigPath,
	readFile,
	removeImport,
	replaceInFile,
	setAngularProjectsConfig
} from '../utils';
import {appModulePath, createSrcFile, getTemplate, obliqueCssPath} from '../ng-add/ng-add-utils';
import {getPackageJsonDependency, removePackageJsonDependency} from '@schematics/angular/utility/dependencies';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IUpdateV5Schema {}

export class UpdateV5toV6 implements ObIMigrations {
	dependencies = {
		'@angular/core': 11,
		'@angular/router': (angular: number) => angular,
		'@ngx-translate/core': 13,
		'@ng-bootstrap/ng-bootstrap': [9, 0],
		'@angular/material': (angular: number) => [angular, 0],
		ajv: [6, 0]
	};

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	applyMigrations(_options: IUpdateV5Schema): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Analyzing project');
			minAngularVersion(tree, _context, 6, 11);

			return chain([
				this.migrateFont(),
				this.migrateAssets(),
				this.addFeatureDetection(),
				this.changeColorPalette(),
				this.renameMockCollapseComponent(),
				this.renameDefaultLanguage(),
				this.adaptDependencies(),
				this.migrateDropdown(),
				this.removeUnsubscribe(),
				this.adaptHtmlToCss(),
				this.adaptCssClassNaming()
			])(tree, _context);
		};
	}

	private migrateFont(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Migrating font');
			const module = readFile(tree, appModulePath);
			const match = /(?<full>\s*{\s*provide\s*:\s*OBLIQUE_FONT\s*,\s*useValue\s*:\s*(?:FONTS\.)?['"]?(?<font>[^"'\s}]*)['"]?\s*},?)/.exec(module);
			const full = match?.groups?.full;
			const font = match?.groups?.font;
			if (full && font) {
				tree.overwrite(
					appModulePath,
					module
						.replace(full, '')
						.replace(/OBLIQUE_FONT\s*,?\s?/, '')
						.replace(/FONTS\s*,?\s?/, '')
				);
				this.addFontFiles(tree, font.toLowerCase());
				this.addFontStyle(tree, font.toLowerCase());
			}
			return tree;
		};
	}

	private addFontStyle(tree: Tree, font: string): void {
		if (font !== 'none') {
			const styleSheet = `node_modules/@oblique/oblique/styles/css/${font}.css`;
			setAngularProjectsConfig(tree, ['architect', 'build', 'options', 'styles'], (config: string[]) => {
				if (!config.includes(styleSheet)) {
					config.splice(config.indexOf(obliqueCssPath) + 1, 0, styleSheet);
				}
				return config;
			});
		}
	}

	private addFontFiles(tree: Tree, font: string): void {
		if (font === 'roboto') {
			setAngularProjectsConfig(tree, ['architect', 'build', 'options', 'assets'], (config: any) => {
				config.splice(1, 0, {glob: '*/**', input: 'node_modules/@oblique/oblique/styles/fonts', output: 'assets/fonts'});
				return config;
			});
		}
	}

	private migrateAssets(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Migrating assets');
			this.adaptFavIcon(tree);
			return this.adaptAssets(tree);
		};
	}

	private adaptFavIcon(tree: Tree): void {
		let index = getDefaultAngularConfig(tree, ['architect', 'build', 'options', 'index']);
		if (!tree.exists(index)) {
			index = './index.html';
		}
		if (tree.exists(index)) {
			tree.overwrite(
				index,
				readFile(tree, index).replace(
					/<link .*?href="(?:\.\/)?assets\/styles\/images\/favicon\.(?:ico|png)".*?>/,
					'<link href="assets/images/favicon.png" rel="shortcut icon"/>'
				)
			);
		}
	}

	private adaptAssets(tree: Tree): Tree {
		return setAngularProjectsConfig(tree, ['architect', 'build', 'options', 'assets'], (config: any) => [
			{glob: '**/*', input: 'node_modules/@oblique/oblique/assets', output: 'assets'},
			...config
				.filter((asset: any) => asset?.input !== 'node_modules/@oblique/oblique/assets')
				.filter((asset: any) => asset?.input !== 'node_modules/@oblique/oblique/styles')
		]);
	}

	private addFeatureDetection(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Oblique: Adding browser compatibility check');
			let index = getDefaultAngularConfig(tree, ['architect', 'build', 'options', 'index']);
			if (!tree.exists(index)) {
				index = './index.html';
			}
			if (tree.exists(index)) {
				tree.overwrite(
					index,
					readFile(tree, index)
						.replace(/<noscript.*<\/noscript>\s/s, '')
						.replace(/<div class="ob-compatibility" .*?<\/div>\s/s, '')
						.replace(/<!--\[if lt.*?endif]-->\s/s, '')
						.replace(/<!--\[if gte.*(<html.*?>).*endif]-->\s/s, '$1')
						.replace(/<body([^>]*)>\n/, `<body$1>\n${getTemplate(tree, 'default-index.html')}`)
				);
			}
			return addAngularConfigInList(tree, ['architect', 'build', 'options', 'scripts'], 'node_modules/@oblique/oblique/ob-features.js');
		};
	}

	private changeColorPalette(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Change color palette');
			const apply = (filePath: string): void => {
				replaceInFile(tree, filePath, new RegExp(/\$brand-info-light/g), '$brand-light');
				replaceInFile(tree, filePath, new RegExp(/\$brand-info/g), '$brand-primary');
				replaceInFile(tree, filePath, new RegExp(/\$brand-info-dark/g), '$brand-dark');
			};
			return applyInTree(tree, apply, '*.scss');
		};
	}

	private renameMockCollapseComponent(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Renaming MockCollapseComponent');
			const toApply = (filePath: string): void => {
				replaceInFile(tree, filePath, /MockCollapseComponent/g, 'ObMockCollapseComponent');
				replaceInFile(tree, filePath, /MockCollapseModule/g, 'ObMockCollapseModule');
			};
			return applyInTree(tree, toApply, '*.ts');
		};
	}

	private renameDefaultLanguage(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Renaming locale.default into locale.defaultLanguage');
			const toApply = (filePath: string): void => {
				const config = /(?<config>\w*):\s*ObMasterLayoutConfig/.exec(readFile(tree, filePath))?.groups?.config;
				if (config) {
					replaceInFile(tree, filePath, new RegExp(`${config}\\.locale\\.default([\\s=])`, 'g'), `${config}.locale.defaultLanguage$1`);
				}
			};
			return applyInTree(tree, toApply, '*.ts');
		};
	}

	private adaptDependencies(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Adapting dependencies');
			this.adaptTranslationDependencies(tree);
			this.adaptCoreJsDependency(tree);
			this.adaptTestDependencies(tree);
			if (!getPackageJsonDependency(tree, '@angular-builders/jest')) {
				removePackageJsonDependency(tree, 'jest-preset-angular');
				removePackageJsonDependency(tree, 'ts-jest');
			}
			removePackageJsonDependency(tree, 'ts-morph');
			removePackageJsonDependency(tree, '@ts-morph/common');
		};
	}

	private adaptTestDependencies(tree: Tree): void {
		const usesProtractor = checkIfAngularConfigExists(tree, ['architect', 'e2e', 'builder'], '@angular-devkit/build-angular:protractor');
		const usesJest = checkIfAngularConfigExists(tree, ['architect', 'test', 'builder'], '@angular-builders/jest:run');
		const deps = Object.keys(getJson(tree, packageJsonConfigPath)?.devDependencies || {});
		deps.filter(dep => dep.includes(usesJest ? 'karma' : 'jest')).forEach(dep => removePackageJsonDependency(tree, dep));
		if (usesJest && !usesProtractor) {
			deps.filter(dep => dep.includes('jasmine')).forEach(dep => removePackageJsonDependency(tree, dep));
		}
	}

	private adaptTranslationDependencies(tree: Tree): void {
		const file = readFile(tree, appModulePath);
		const factory = /TranslateModule\.forRoot\({.*?useFactory\s*:\s*(?<factory>\w*)/s.exec(file)?.groups?.factory;
		const loader = new RegExp(`export function ${factory}\\(.*new (?<loader>[^(]*)`, 's').exec(file)?.groups?.loader;
		const hasObMultiLoader = /TranslateModule.forRoot\(\s*multiTranslateLoader\(/.test(file);
		if (hasObMultiLoader || loader !== 'TranslateHttpLoader') {
			this.removeTranslateLoader(tree, '@ngx-translate/http-loader', 'TranslateHttpLoader');
		}
		if (hasObMultiLoader || loader !== 'MultiTranslateHttpLoader') {
			this.removeTranslateLoader(tree, 'ngx-translate-multi-http-loader', 'MultiTranslateHttpLoader');
		}
	}

	private removeTranslateLoader(tree: Tree, dep: string, className: string): void {
		const file = readFile(tree, appModulePath);
		removePackageJsonDependency(tree, dep);
		tree.overwrite(
			appModulePath,
			file
				.replace(new RegExp(`\\nexport function .*\\(.*new ${className}[^;]*;\\s*}`, 's'), '')
				.replace(new RegExp(`\\nimport\\s*{\\s*${className}\\s*}\\s*from\\s*['"]${dep}['"]\\s*;`), '')
		);
	}

	private adaptCoreJsDependency(tree: Tree): void {
		const hasCoreJsBeenImported = getAngularConfigs(tree, ['architect', 'build', 'options', 'polyfills'])
			.map(polyfill => createSrcFile(tree, polyfill.config))
			.filter(sourceFile => /import 'core-js/.test(sourceFile.getText())).length;
		if (!hasCoreJsBeenImported) {
			removePackageJsonDependency(tree, 'core-js');
		}
	}

	private migrateDropdown(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Migrate ObDropdownComponent');
			const toApply = (filePath: string): void => {
				replaceInFile(tree, filePath, /<button(.*?) dropdown-toggle[^>]*>\s*(<[^\s]*)(.*)\s*<\/button>/g, '$2 dropdown-toggle$1$3');
				replaceInFile(tree, filePath, /<button dropdown-toggle>(\w*)<\/button>/g, '<ng-container dropdown-toggle>$1</ng-container>');
			};
			return applyInTree(tree, toApply, '*.html');
		};
	}

	private removeUnsubscribe(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Migrate Unsubscribe class');
			const toApply = (filePath: string): void => {
				const content = readFile(tree, filePath);
				if (content.includes('extends ObUnsubscribable')) {
					tree.overwrite(filePath, content.replace(/extends\s+ObUnsubscribable\s?/, '').replace(/\s*super\(\);/, ''));
					addInterface(tree, filePath, 'OnDestroy');
					addImport(tree, filePath, 'OnDestroy', '@angular/core');
					addImport(tree, filePath, 'Subject', 'rxjs');
					removeImport(tree, filePath, 'ObUnsubscribable', '@oblique/oblique');
					replaceInFile(tree, filePath, /\n([\t ]*)constructor\(/, '$1private readonly unsubscribe = new Subject();\n\n$1constructor(');
					this.addNgOnDestroy(tree, filePath, content.includes('ngOnDestroy'));
				}
			};
			return applyInTree(tree, toApply, '*.ts');
		};
	}

	private addNgOnDestroy(tree: Tree, filePath: string, extend: boolean): void {
		if (extend) {
			replaceInFile(tree, filePath, /ngOnDestroy\(.*{\s*\n(\s*)/, 'ngOnDestroy(): void {\n$1this.unsubscribe.next();\n$1this.unsubscribe.complete();\n$1');
		} else {
			replaceInFile(
				tree,
				filePath,
				/\n([\t ]*)constructor\(/,
				'\n$1ngOnDestroy(): void {\n$1$1this.unsubscribe.next();\n$1$1this.unsubscribe.complete();\n$1}\n\n$1constructor('
			);
		}
	}

	private adaptHtmlToCss(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, "Prefix Oblique's classes in HTML");
			const apply = (filePath: string): void => {
				addClassesPrefix(tree, filePath, 'alert', ['info', 'success', 'warning', 'error', 'link']);
				addClassesPrefix(tree, filePath, 'sticky', ['sm', 'lg']);
				addClassesPrefix(tree, filePath, 'nav-stepper', ['sm', 'lg']);
				addClassesPrefix(tree, filePath, 'table', ['cicd', 'plain', 'collapse', 'hover', 'scrollable']);
				addClassesPrefix(tree, filePath, 'no-layout');
				addClassesPrefix(tree, filePath, 'expanded');
				addClassesPrefix(tree, filePath, 'close');
				addClassesPrefix(tree, filePath, 'main-nav', ['item']);
				addClassPrefix(tree, filePath, 'sticky', ['content', 'main', 'header', 'footer', 'title', 'actions', 'layout']);
				addClassPrefix(tree, filePath, 'control', ['link', 'item', 'icon', 'label', 'toggle', 'locale']);
				addClassPrefix(tree, filePath, 'multiselect', ['toggle', 'label', 'control']);
				addClassPrefix(tree, filePath, 'nav', ['tree', 'link', 'indent', 'bordered', 'hover', 'toggle', 'step', 'horizontal']);
				addClassPrefix(tree, filePath, 'tab', ['item', 'link']);
			};
			return applyInTree(tree, apply, '*.html');
		};
	}

	private adaptCssClassNaming(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, "Prefix Oblique's classes in SCSS");
			const apply = (filePath: string): void => {
				addPrefixMatchExactOrSuffix(tree, filePath, 'toggle', ['after', 'before', 'justified', 'down', 'up', 'right', 'left']);
				addPrefixMatchExactOrSuffix(tree, filePath, 'notification', ['container', 'title']);
				addPrefixMatchExactOrSuffix(tree, filePath, 'alert', ['info', 'success', 'warning', 'error', 'link']);
				addPrefixMatchExactOrSuffix(tree, filePath, 'search-box', ['input']);
				addPrefixMatchExactOrSuffix(tree, filePath, 'text-control', ['clear']);
				addPrefixMatchExactOrSuffix(tree, filePath, 'sticky', ['content', 'main', 'header', 'footer', 'title', 'actions', 'sm', 'lg', 'layout']);
				addPrefixMatchExactOrSuffix(tree, filePath, 'nav-stepper', ['sm', 'lg']);
				addPrefixMatchExactOrSuffix(tree, filePath, 'table', ['cicd', 'plain', 'collapse', 'hover', 'scrollable']);
				addPrefixMatchExactOrSuffix(tree, filePath, 'dropdown', ['content']);
				addPrefixMatchExactOrSuffix(tree, filePath, 'main-nav', ['item']);
				addPrefixMatchSuffix(tree, filePath, 'sub', ['nav', 'nav-item', 'menu', 'menu-back']);
				addPrefixMatchSuffix(tree, filePath, 'column', ['layout', 'toggle', 'right', 'left', 'main', 'content']);
				addPrefixMatchSuffix(tree, filePath, 'cover', ['layout', 'viewport', 'header', 'alert']);
				addPrefixMatchSuffix(tree, filePath, 'control', ['link', 'item', 'icon', 'label', 'toggle', 'locale']);
				addPrefixMatchSuffix(tree, filePath, 'multiselect', ['toggle', 'label', 'control']);
				addPrefixMatchSuffix(tree, filePath, 'nav', ['tree', 'link', 'indent', 'bordered', 'hover', 'toggle', 'step', 'horizontal']);
				addPrefixMatchSuffix(tree, filePath, 'tab', ['item', 'link']);
				addPrefixMatchSuffix(tree, filePath, 'search', ['results-list', 'dropdown']);
				addPrefixMatchSuffix(tree, filePath, 'header', ['locale', 'controls']);
				addPrefixMatchExact(tree, filePath, [
					'navigation-scrollable(?:-(?:control(?:-(?:left|right))?|content))?',
					'main-layout',
					'assess-keys',
					'accessible',
					'tabs',
					'step-link',
					'spinner-viewport',
					'pattern-highlight',
					'custom',
					'top-control',
					'highlight',
					'slide-control'
				]);
				renameExactOrSuffix(tree, filePath, 'application', ['navigation', 'header', 'fixed', 'brand', 'footer', 'scrolling', 'content'], 'ob-master-layout');
				renameExactOrSuffix(tree, filePath, 'offcanvas', ['sidebar', 'main', 'in', 'header', 'content', 'backdrop'], 'ob-off-canvas');
			};
			return applyInTree(tree, apply, '*.scss');
		};
	}
}
