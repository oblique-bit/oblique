import {chain, Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {Change, InsertChange} from '@schematics/angular/utility/change';
import {addProviderToModule} from '@schematics/angular/utility/ast-utils';
import {addDependency, applyChanges, appModulePath, createSrcFile, getTemplate, importModule, OBLIQUE_PACKAGE, obliqueCssPath} from '../../ng-add-utils';
import {addAngularConfig, getAngularConfig, getRootAngularConfig, infoMigration, readFile, setAngularConfig} from '../../ng-utils';
import {addLocales} from './locales';

export function oblique(options: any): Rule {
	return (tree: Tree, _context: SchematicContext) =>
		chain([
			addFavIcon(),
			embedMasterLayout(options.title),
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
		const index = getAngularConfig(tree, ['architect', 'build', 'options', 'index']);
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

		return chain([importModule('ObMasterLayoutModule', OBLIQUE_PACKAGE), importModule('BrowserAnimationsModule', '@angular/platform-browser/animations')])(
			tree,
			_context
		);
	};
}

function addMainCSS(): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, 'Oblique: Adding main CSS');
		const path = ['architect', 'build', 'options', 'styles'];
		const styles = getAngularConfig(tree, path);
		const index = styles.indexOf(obliqueCssPath.replace('oblique-core.css', 'oblique-core.scss'));
		if (index > -1) {
			styles[index] = styles[index].replace('oblique-core.scss', 'oblique-core.css');
		}
		if (!styles.includes(obliqueCssPath)) {
			styles.unshift(obliqueCssPath);
		}
		return setAngularConfig(tree, path, styles);
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
		return addAngularConfig(tree, ['architect', 'build', 'options', 'assets'], {
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
			const changes: Change[] = addProviderToModule(sourceFile, appModulePath, providerToAdd, OBLIQUE_PACKAGE);
			if (changes.length > 1) {
				(changes[1] as InsertChange).toAdd = (changes[1] as InsertChange).toAdd.replace(
					'{ provide: OBLIQUE_FONT, useValue: FONTS',
					'OBLIQUE_FONT, FONTS'
				);
			}
			return applyChanges(tree, appModulePath, changes);
		}
		return tree;
	};
}

function addScssImport(stylesPath: string): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		const path = ['schematics', '@schematics/angular:component', 'style'];
		const styleExt = getAngularConfig(tree, path) || getRootAngularConfig(tree, path);
		if (styleExt !== 'scss' || !tree.exists(stylesPath)) {
			return tree;
		}

		infoMigration(_context, 'Oblique: Importing variables into main SCSS file');
		const layoutContent = readFile(tree, stylesPath);
		const scssImport = `@import '~@oblique/oblique/styles/scss/core/variables';`;
		if (!layoutContent.includes(scssImport)) {
			tree.overwrite(stylesPath, scssImport.concat('\n', layoutContent));
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
	const path = ['architect', 'build', 'options', 'styles'];
	const styles = getAngularConfig(tree, path);
	const index = styles.indexOf(styleSheet.replace(`oblique-${theme}.css`, `oblique-${theme}.scss`));
	if (index > -1) {
		styles[index] = styles[index].replace(`oblique-${theme}.scss`, `oblique-${theme}.css`);
	}
	if (!styles.includes(styleSheet)) {
		styles.splice(styles.indexOf(obliqueCssPath) + 1, 0, styleSheet);
	}
	return setAngularConfig(tree, path, styles);
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
