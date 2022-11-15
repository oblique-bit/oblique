import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {addDependency, appModulePath, getTemplate, importModuleInRoot, obliqueCssPath} from '../ng-add-utils';
import {ObIOptionsSchema} from '../ng-add.model';
import {
	ObliquePackage,
	addAngularConfigInList,
	createSafeRule,
	getIndexPaths,
	infoMigration,
	overwriteIndexFile,
	readFile,
	setAngularProjectsConfig
} from '../../utils';
import {addLocales} from './locales';

export function oblique(options: ObIOptionsSchema): Rule {
	return (tree: Tree, _context: SchematicContext) =>
		chain([
			addFavIcon(),
			embedMasterLayout(options.title),
			addAdditionalModules(),
			addFeatureDetection(),
			addMainCSS(),
			addTheme(),
			addObliqueAssets(),
			addFontStyle(options.font || 'none'),
			addFontFiles(options.font || 'none'),
			addLocales(options.locales.split(' '))
		])(tree, _context);
}

function addFavIcon(): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, 'Oblique: Embedding favicon');
		getIndexPaths(tree).forEach((indexPath: string) =>
			overwriteIndexFile(
				indexPath,
				tree,
				'<link rel="icon" type="image/x-icon" href="favicon.ico">',
				'<link href="assets/images/favicon.png" rel="shortcut icon"/>'
			)
		);
		return tree;
	});
}

function embedMasterLayout(title: string): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, 'Oblique: Embedding Master Layout');
		importModuleInRoot(tree, 'ObMasterLayoutModule', ObliquePackage);
		importModuleInRoot(tree, 'BrowserAnimationsModule', '@angular/platform-browser/animations');
		addMasterLayout(tree, title);

		return tree;
	});
}

function addAdditionalModules(): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, 'Oblique: Add ObIconModule & ObButtonModule');
		importModuleInRoot(tree, 'ObButtonModule', ObliquePackage);
		importModuleInRoot(tree, 'ObIconModule', ObliquePackage);
		addForRootToIconModule(tree);
		addComment(tree);

		return tree;
	});
}

function addFeatureDetection(): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, 'Oblique: Adding browser compatibility check');
		getIndexPaths(tree).forEach((indexPath: string) =>
			overwriteIndexFile(indexPath, tree, '<body>\n', `<body>\n${getTemplate(tree, 'default-index.html')}`)
		);
		return addAngularConfigInList(tree, ['architect', 'build', 'options', 'scripts'], 'node_modules/@oblique/oblique/ob-features.js');
	});
}

function addMainCSS(): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
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
	});
}

function addTheme(): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, 'Oblique: Adding theme CSS');
		addThemeDependencies(tree);
		return addThemeCSS(tree);
	});
}

function addObliqueAssets(): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, 'Oblique: Adding assets');
		return setAngularProjectsConfig(tree, ['architect', 'build', 'options', 'assets'], (config: any) => [
			{
				glob: '**/*',
				input: 'node_modules/@oblique/oblique/assets',
				output: 'assets'
			},
			...config
		]);
	});
}

function addFontStyle(font: string): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		if (font !== 'none') {
			infoMigration(_context, 'Oblique: Adding font');
			const styleSheet = `node_modules/@oblique/oblique/styles/css/${font}.css`;
			setAngularProjectsConfig(tree, ['architect', 'build', 'options', 'styles'], (config: string[]) => {
				if (!config.includes(styleSheet)) {
					config.splice(config.indexOf(obliqueCssPath) + 1, 0, styleSheet);
				}
				return config;
			});
		}
		return tree;
	});
}

function addFontFiles(font: string): Rule {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		if (font === 'roboto') {
			setAngularProjectsConfig(tree, ['architect', 'build', 'options', 'assets'], (config: any) => {
				config.splice(1, 0, {
					glob: '*/**',
					input: 'node_modules/@oblique/oblique/styles/fonts',
					output: 'assets/fonts'
				});
				return config;
			});
		}
		return tree;
	});
}

function addThemeDependencies(tree: Tree): void {
	addDependency(tree, '@angular/cdk');
	addDependency(tree, '@angular/material');
}

function addThemeCSS(tree: Tree): Tree {
	const styleSheet = `node_modules/@oblique/oblique/styles/css/oblique-material.css`;
	return setAngularProjectsConfig(tree, ['architect', 'build', 'options', 'styles'], (config: string[]) => {
		const index = config.indexOf(styleSheet.replace(`oblique-material.css`, `oblique-material.scss`));
		if (index > -1) {
			config[index] = config[index].replace(`oblique-material.scss`, `oblique-material.css`);
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

function addForRootToIconModule(tree: Tree): void {
	const appModuleContent = readFile(tree, appModulePath);
	tree.overwrite(appModulePath, appModuleContent.replace(/(?<prefix>.*)ObIconModule/s, '$<prefix>ObIconModule.forRoot()'));
}

function addComment(tree: Tree): void {
	const appModuleContent = readFile(tree, appModulePath);
	tree.overwrite(appModulePath, appModuleContent.replace(/ObButtonModule,\n/, 'ObButtonModule, // add other Oblique modules as needed\n'));
}
