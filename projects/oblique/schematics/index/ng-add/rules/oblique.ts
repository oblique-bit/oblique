import {chain, Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {Change, InsertChange} from '@schematics/angular/utility/change';
import {addProviderToModule} from '@schematics/angular/utility/ast-utils';
import {
	adaptInsertChange,
	addDependency,
	applyChanges,
	appModulePath,
	createSrcFile,
	getTemplate,
	importModule,
	IOptionsSchema,
	obliqueCssPath
} from '../ng-add-utils';
import {addAngularConfigInList, getDefaultAngularConfig, infoMigration, ObliquePackage, readFile, setAngularProjectsConfig} from '../../utils';
import {addLocales} from './locales';

export function oblique(options: IOptionsSchema): Rule {
	return (tree: Tree, _context: SchematicContext) =>
		chain([
			addFavIcon(),
			embedMasterLayout(options.title),
			addFeatureDetection(),
			addMainCSS(),
			addTheme(options.theme),
			addObliqueAssets(),
			addFontInjectionToken(options.font.toUpperCase() || 'NONE'),
			addLocales(options.langs.split(' ')),
			addScssImport('src/scss/styles.scss'),
			addScssImport('src/styles.scss')
		])(tree, _context);
}

function addFavIcon(): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, 'Oblique: Embedding favicon');
		let index = getDefaultAngularConfig(tree, ['architect', 'build', 'options', 'index']);
		if (!tree.exists(index)) {
			index = './index.html';
		}
		if (tree.exists(index)) {
			tree.overwrite(
				index,
				readFile(tree, index).replace(
					'<link rel="icon" type="image/x-icon" href="favicon.ico">',
					'<link href="assets/styles/images/favicon.png" rel="shortcut icon"/>'
				)
			);
		}
		return tree;
	};
}

function embedMasterLayout(title: string): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, 'Oblique: Embedding Master Layout');
		addMasterLayout(tree, title);
		addComment(tree);

		return chain([importModule('ObMasterLayoutModule', ObliquePackage), importModule('BrowserAnimationsModule', '@angular/platform-browser/animations')])(
			tree,
			_context
		);
	};
}

function addFeatureDetection(): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, 'Oblique: Adding browser compatibility check');
		let index = getDefaultAngularConfig(tree, ['architect', 'build', 'options', 'index']);
		if (!tree.exists(index)) {
			index = './index.html';
		}
		if (tree.exists(index)) {
			tree.overwrite(index, readFile(tree, index).replace('<body>\n', '<body>\n' + getTemplate(tree, 'default-index.html')));
		}
		return addAngularConfigInList(tree, ['architect', 'build', 'options', 'scripts'], 'node_modules/@oblique/oblique/ob-features.js');
	};
}

function addMainCSS(): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, 'Oblique: Adding main CSS');
		return setAngularProjectsConfig(tree, ['architect', 'build', 'options', 'styles'], (config: any) => {
			const index = config.indexOf(obliqueCssPath.replace('css/oblique-core.css', 'scss/oblique-core.scss'));
			if (index > -1) {
				config[index] = config[index].replace('scss/oblique-core.scss', 'css/oblique-core.css');
			}
			if (!config.includes(obliqueCssPath)) {
				config.unshift(obliqueCssPath);
			}
			return config;
		});
	};
}

function addTheme(theme: string): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, 'Oblique: Adding theme CSS');
		addThemeDependencies(tree, theme);
		return addThemeCSS(tree, theme);
	};
}

function addObliqueAssets(): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, 'Oblique: Adding assets');
		return addAngularConfigInList(tree, ['architect', 'build', 'options', 'assets'], {
			glob: '**/*',
			input: 'node_modules/@oblique/oblique/styles',
			output: '/assets/styles'
		});
	};
}

function addFontInjectionToken(font: string): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (font !== 'FRUTIGER') {
			infoMigration(_context, 'Oblique: Adding font');
			const providerToAdd = `{ provide: OBLIQUE_FONT, useValue: FONTS.${font} }`;
			const sourceFile = createSrcFile(tree, appModulePath);
			const changes = addProviderToModule(sourceFile, appModulePath, providerToAdd, ObliquePackage)
				.filter((change: Change) => change instanceof InsertChange)
				.map((change: InsertChange) => adaptInsertChange(tree, change, '{ provide: OBLIQUE_FONT, useValue: FONTS', 'OBLIQUE_FONT, FONTS'));

			return applyChanges(tree, appModulePath, changes);
		}
		return tree;
	};
}

function addScssImport(stylesPath: string): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (tree.exists(stylesPath)) {
			infoMigration(_context, 'Oblique: Importing variables into main SCSS file');
			const layoutContent = readFile(tree, stylesPath);
			const scssImport = `@import '~@oblique/oblique/styles/scss/core/variables';`;
			if (!layoutContent.includes(scssImport)) {
				tree.overwrite(stylesPath, scssImport.concat('\n', layoutContent));
			}
		}
		return tree;
	};
}

function addThemeDependencies(tree: Tree, theme: string): void {
	if (theme === 'material') {
		addDependency(tree, '@angular/cdk');
		addDependency(tree, '@angular/material');
	} else {
		addDependency(tree, '@ng-bootstrap/ng-bootstrap');
	}
}

function addThemeCSS(tree: Tree, theme: string): Tree {
	const styleSheet = `node_modules/@oblique/oblique/styles/css/oblique-${theme}.css`;
	return setAngularProjectsConfig(tree, ['architect', 'build', 'options', 'styles'], (config: any) => {
		const index = config.indexOf(styleSheet.replace(`oblique-${theme}.css`, `oblique-${theme}.scss`));
		if (index > -1) {
			config[index] = config[index].replace(`oblique-${theme}.scss`, `oblique-${theme}.css`);
		}
		if (!config.includes(styleSheet)) {
			config.splice(config.indexOf(obliqueCssPath) + 1, 0, styleSheet);
		}
		return config;
	});
}

function addMasterLayout(tree: Tree, title: string): void {
	const path = 'src/app/app.component.html';
	if (tree.exists(path)) {
		tree.overwrite(path, getTemplate(tree, 'default-master-layout.html').replace(/_APP_TITLE_PLACEHOLDER_/, title));
	}
}

function addComment(tree: Tree): void {
	const appModuleContent = readFile(tree, appModulePath);
	tree.overwrite(appModulePath, appModuleContent.replace(/ObMasterLayoutModule,\n/g, 'ObMasterLayoutModule, // add other Oblique modules as needed\n'));
}
