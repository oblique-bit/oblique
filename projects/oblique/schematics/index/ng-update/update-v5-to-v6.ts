import {chain, Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {minAngularVersion} from './ng-update-utils';
import {ObIMigrations} from './ng-update.model';
import {
	addAngularConfigInList,
	getDefaultAngularConfig,
	infoMigration,
	readFile,
	replaceInFile,
	setAngularProjectsConfig,
	applyInTree,
	getAngularConfigs,
	checkIfAngularConfigExists,
	packageJsonConfigPath,
	getJson,
	addInterface,
	addImport,
	removeImport
} from '../utils';
import {appModulePath, createSrcFile, getTemplate, obliqueCssPath} from '../ng-add/ng-add-utils';
import {getPackageJsonDependency, removePackageJsonDependency} from '@schematics/angular/utility/dependencies';

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
			const match = module.match(/(?<full>\s*{\s*provide\s*:\s*OBLIQUE_FONT\s*,\s*useValue\s*:\s*(?:FONTS\.)?['"]?(?<font>[^"'\s}]*)['"]?\s*},?)/);
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
			setAngularProjectsConfig(tree, ['architect', 'build', 'options', 'styles'], (config: any) => {
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
						.replace(/<body([^>]*)>\n/, '<body$1>\n' + getTemplate(tree, 'default-index.html'))
				);
			}
			return addAngularConfigInList(tree, ['architect', 'build', 'options', 'scripts'], 'node_modules/@oblique/oblique/ob-features.js');
		};
	}

	private changeColorPalette(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Change color palette');
			const apply = (filePath: string) => {
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
			const toApply = (filePath: string) => {
				replaceInFile(tree, filePath, /MockCollapseComponent/g, 'ObMockCollapseComponent');
				replaceInFile(tree, filePath, /MockCollapseModule/g, 'ObMockCollapseModule');
			};
			return applyInTree(tree, toApply, '*.ts');
		};
	}

	private renameDefaultLanguage(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Renaming locale.default into locale.defaultLanguage');
			const toApply = (filePath: string) => {
				const config = readFile(tree, filePath).match(/(?<config>\w*):\s*ObMasterLayoutConfig/)?.groups?.config;
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
		deps.filter(dep => dep.indexOf(usesJest ? 'karma' : 'jest') > -1).forEach(dep => removePackageJsonDependency(tree, dep));
		if (usesJest && !usesProtractor) {
			deps.filter(dep => dep.indexOf('jasmine') > -1).forEach(dep => removePackageJsonDependency(tree, dep));
		}
	}

	private adaptTranslationDependencies(tree: Tree): void {
		const file = readFile(tree, appModulePath);
		const factory = file.match(/TranslateModule\.forRoot\({.*?useFactory\s*:\s*(?<factory>\w*)/s)?.groups?.factory;
		const loader = file.match(new RegExp(`export function ${factory}\\(.*new (?<loader>[^(]*)`, 's'))?.groups?.loader;
		const hasObMultiLoader = /TranslateModule.forRoot\(\s*multiTranslateLoader\(/.test(file);
		if (hasObMultiLoader || loader !== 'TranslateHttpLoader') {
			this.removeTranslateLoader(tree, '@ngx-translate/http-loader', 'TranslateHttpLoader');
		}
		if (hasObMultiLoader || loader !== 'MultiTranslateHttpLoader') {
			this.removeTranslateLoader(tree, 'ngx-translate-multi-http-loader', 'MultiTranslateHttpLoader');
		}
	}

	private removeTranslateLoader(tree: Tree, dep: string, className: string) {
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
			const toApply = (filePath: string) => {
				replaceInFile(tree, filePath, /<button(.*?) dropdown-toggle[^>]*>\s*(<[^\s]*)(.*)\s*<\/button>/g, '$2 dropdown-toggle$1$3');
				replaceInFile(tree, filePath, /<button dropdown-toggle>(\w*)<\/button>/g, '<ng-container dropdown-toggle>$1</ng-container>');
			};
			return applyInTree(tree, toApply, '*.html');
		};
	}

	private removeUnsubscribe(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, 'Migrate Unsubscribe class');
			const toApply = (filePath: string) => {
				const content = readFile(tree, filePath);
				if (content.indexOf('extends ObUnsubscribable') > -1) {
					tree.overwrite(filePath, content.replace(/extends\s+ObUnsubscribable\s?/, '').replace(/\s*super\(\);/, ''));
					addInterface(tree, filePath, 'OnDestroy');
					addImport(tree, filePath, 'OnDestroy', '@angular/core');
					addImport(tree, filePath, 'Subject', 'rxjs');
					removeImport(tree, filePath, 'ObUnsubscribable', '@oblique/oblique');
					replaceInFile(tree, filePath, /\n([\t ]*)constructor\(/, '$1private readonly unsubscribe = new Subject();\n\n$1constructor(');
					this.addNgOnDestroy(tree, filePath, /ngOnDestroy/.test(content));
				}
			};
			return applyInTree(tree, toApply, '*.ts');
		};
	}

	private addNgOnDestroy(tree: Tree, filePath: string, extend: boolean): void {
		if (extend) {
			replaceInFile(tree, filePath, /ngOnDestroy\(.*{\s*\n(\s*)/, 'ngOnDestroy() {\n$1this.unsubscribe.next();\n$1this.unsubscribe.complete();\n$1');
		} else {
			replaceInFile(
				tree,
				filePath,
				/\n([\t ]*)constructor\(/,
				'\n$1ngOnDestroy() {\n$1$1this.unsubscribe.next();\n$1$1this.unsubscribe.complete();\n$1}\n\n$1constructor('
			);
		}
	}

	private addClassesPrefix(tree: Tree, filePath: string, target: string, suffixes?: string[]) {
		replaceInFile(tree, filePath, new RegExp(`class="((?:[\\w-]*\\s)*|)(${target})(\\s.*|)"`, 'g'), `class="$1ob-$2$3"`);
		if (suffixes) {
			this.addClassPrefix(tree, filePath, target, suffixes);
		}
	}

	private addClassPrefix(tree: Tree, filePath: string, target: string, suffixes: string[]) {
		suffixes.forEach(suffix => {
			replaceInFile(tree, filePath, new RegExp(`class="((?:[\\w-]*\\s)*|)(${target}-${suffix})(\\s.*|)"`, 'g'), `class="$1ob-$2$3"`);
		});
	}

	private addPrefixMatchExactOrSuffix(tree: Tree, filePath: string, target: string, suffix: string[]) {
		replaceInFile(tree, filePath, new RegExp(`\\.(${target}(?:[:\\.\\s{]|(?:-(?:${suffix.join('|')}))))`, 'g'), '.ob-$1');
	}

	private addPrefixMatchSuffix(tree: Tree, filePath: string, target: string, suffix: string[]) {
		replaceInFile(tree, filePath, new RegExp(`\\.(${target}-(?:${suffix.join('|')})[:\\.\\s{])`, 'g'), '.ob-$1');
	}

	private addPrefixMatchExact(tree: Tree, filePath: string, targets: string[]) {
		replaceInFile(tree, filePath, new RegExp(`\\.(${targets.join('|')}[:\\.\\s{])`, 'g'), '.ob-$1');
	}

	private renameExactOrSuffix(tree: Tree, filePath: string, target: string, suffix: string[], result: string) {
		replaceInFile(tree, filePath, new RegExp(`\\.${target}([:\\.\\s{]|(?:-(?:${suffix.join('|')})))`, 'g'), `.${result}$1`);
	}

	private adaptHtmlToCss(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, "Prefix Oblique's classes in HTML");
			const apply = (filePath: string) => {
				this.addClassesPrefix(tree, filePath, 'alert', ['info', 'success', 'warning', 'error', 'link']);
				this.addClassesPrefix(tree, filePath, 'sticky', ['sm', 'lg']);
				this.addClassesPrefix(tree, filePath, 'nav-stepper', ['sm', 'lg']);
				this.addClassesPrefix(tree, filePath, 'table', ['cicd', 'plain', 'collapse', 'hover', 'scrollable']);
				this.addClassesPrefix(tree, filePath, 'no-layout');
				this.addClassesPrefix(tree, filePath, 'expanded');
				this.addClassesPrefix(tree, filePath, 'close');
				this.addClassesPrefix(tree, filePath, 'main-nav', ['item']);
				this.addClassPrefix(tree, filePath, 'sticky', ['content', 'main', 'header', 'footer', 'title', 'actions', 'layout']);
				this.addClassPrefix(tree, filePath, 'control', ['link', 'item', 'icon', 'label', 'toggle', 'locale']);
				this.addClassPrefix(tree, filePath, 'multiselect', ['toggle', 'label', 'control']);
				this.addClassPrefix(tree, filePath, 'nav', ['tree', 'link', 'indent', 'bordered', 'hover', 'toggle', 'step', 'horizontal']);
				this.addClassPrefix(tree, filePath, 'tab', ['item', 'link']);
			};
			return applyInTree(tree, apply, '*.html');
		};
	}

	private adaptCssClassNaming(): Rule {
		return (tree: Tree, _context: SchematicContext) => {
			infoMigration(_context, "Prefix Oblique's classes in SCSS");
			const apply = (filePath: string) => {
				this.addPrefixMatchExactOrSuffix(tree, filePath, 'toggle', ['after', 'before', 'justified', 'down', 'up', 'right', 'left']);
				this.addPrefixMatchExactOrSuffix(tree, filePath, 'notification', ['container', 'title']);
				this.addPrefixMatchExactOrSuffix(tree, filePath, 'alert', ['info', 'success', 'warning', 'error', 'link']);
				this.addPrefixMatchExactOrSuffix(tree, filePath, 'search-box', ['input']);
				this.addPrefixMatchExactOrSuffix(tree, filePath, 'text-control', ['clear']);
				this.addPrefixMatchExactOrSuffix(tree, filePath, 'sticky', ['content', 'main', 'header', 'footer', 'title', 'actions', 'sm', 'lg', 'layout']);
				this.addPrefixMatchExactOrSuffix(tree, filePath, 'nav-stepper', ['sm', 'lg']);
				this.addPrefixMatchExactOrSuffix(tree, filePath, 'table', ['cicd', 'plain', 'collapse', 'hover', 'scrollable', 'sm', 'lg']);
				this.addPrefixMatchExactOrSuffix(tree, filePath, 'dropdown', ['content']);
				this.addPrefixMatchExactOrSuffix(tree, filePath, 'main-nav', ['item']);
				this.addPrefixMatchSuffix(tree, filePath, 'sub', ['nav', 'nav-item', 'menu', 'menu-back']);
				this.addPrefixMatchSuffix(tree, filePath, 'column', ['layout', 'toggle', 'right', 'left', 'main', 'content']);
				this.addPrefixMatchSuffix(tree, filePath, 'cover', ['layout', 'viewport', 'header', 'alert']);
				this.addPrefixMatchSuffix(tree, filePath, 'control', ['link', 'item', 'icon', 'label', 'toggle', 'locale']);
				this.addPrefixMatchSuffix(tree, filePath, 'multiselect', ['toggle', 'label', 'control']);
				this.addPrefixMatchSuffix(tree, filePath, 'nav', ['tree', 'link', 'indent', 'bordered', 'hover', 'toggle', 'step', 'horizontal']);
				this.addPrefixMatchSuffix(tree, filePath, 'tab', ['item', 'link']);
				this.addPrefixMatchSuffix(tree, filePath, 'search', ['results-list', 'dropdown']);
				this.addPrefixMatchSuffix(tree, filePath, 'header', ['locale', 'controls']);
				this.addPrefixMatchExact(tree, filePath, [
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
				this.renameExactOrSuffix(
					tree,
					filePath,
					'application',
					['navigation', 'header', 'fixed', 'brand', 'footer', 'scrolling', 'content'],
					'ob-master-layout'
				);
				this.renameExactOrSuffix(tree, filePath, 'offcanvas', ['sidebar', 'main', 'in', 'header', 'content', 'backdrop'], 'ob-off-canvas');
			};
			return applyInTree(tree, apply, '*.scss');
		};
	}
}
