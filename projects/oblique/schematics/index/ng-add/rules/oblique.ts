import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {addDependency, appModulePath, getTemplate, importModuleInRoot, obliqueCssPath} from '../ng-add-utils';
import {ObIOptionsSchema} from '../ng-add.model';
import {
	ObliquePackage,
	addAngularConfigInList,
	addFile,
	applyInTree,
	createSafeRule,
	getIndexPaths,
	infoMigration,
	overwriteIndexFile,
	readFile,
	removeImport,
	replaceInFile,
	setAngularProjectsConfig
} from '../../utils';
import {addLocales} from './locales';

export function oblique(options: ObIOptionsSchema): Rule {
	return (tree: Tree, _context: SchematicContext) =>
		chain([
			addFavIcon(),
			embedMasterLayout(options.title),
			removeBrowserModule(),
			addAdditionalModules(),
			addFeatureDetection(),
			addMainCSS(),
			addAngularMaterialDependencies(),
			addLocalAssets(),
			addObliqueAssets(),
			addFontFiles(),
			addLocales(options.locales.split(' ')),
			raiseBuildBudget(),
			addBrowserslistrcFile()
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

function removeBrowserModule(): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, 'Oblique: Remove BrowserModule');
		const apply = (filePath: string): void => {
			removeImport(tree, appModulePath, 'BrowserModule', '@angular/platform-browser');
			replaceInFile(tree, filePath, /\s*BrowserModule,?/g, '');
		};
		return applyInTree(tree, apply, 'app.module.ts');
	});
}

function addAdditionalModules(): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, 'Oblique: Add ObButtonModule');
		importModuleInRoot(tree, 'ObButtonModule', ObliquePackage);
		addComment(tree);

		return tree;
	});
}

function addFeatureDetection(): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, 'Oblique: Adding browser compatibility check');
		getIndexPaths(tree).forEach((indexPath: string) =>
			overwriteIndexFile(indexPath, tree, /<body>(?<lineBreak>\r?\n)/, `<body>$<lineBreak>${getTemplate(tree, 'default-index.html')}`)
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

function addAngularMaterialDependencies(): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, 'Oblique: Adding Angular Material dependencies');
		addDependency(tree, '@angular/cdk');
		addDependency(tree, '@angular/material');
		return tree;
	});
}

function addLocalAssets(): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, 'Oblique: Adding local assets');
		return setAngularProjectsConfig(tree, ['architect', 'build', 'options', 'assets'], (config: any) => ['src/assets', ...config]);
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

function addFontFiles(): Rule {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		setAngularProjectsConfig(tree, ['architect', 'build', 'options', 'assets'], (config: any) => {
			config.splice(1, 0, {
				glob: '*/**',
				input: 'node_modules/@oblique/oblique/styles/fonts',
				output: 'assets/fonts'
			});
			return config;
		});
		return tree;
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
	tree.overwrite(appModulePath, appModuleContent.replace(/ObButtonModule,\n/, 'ObButtonModule, // add other Oblique modules as needed\n'));
}

function raiseBuildBudget(): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, 'Raise build budget in angular.json');
		return setAngularProjectsConfig(
			tree,
			['architect', 'build', 'configurations', 'production', 'budgets'],
			[
				{
					type: 'initial',
					maximumWarning: '1.7mb',
					maximumError: '2mb'
				},
				{
					type: 'anyComponentStyle',
					maximumWarning: '3kb',
					maximumError: '4kb'
				}
			]
		);
	});
}

function addBrowserslistrcFile(): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, 'Oblique: Adding the .browserslistrc file');
		const browserlistrcFile = getTemplate(tree, 'default-browserslistrc.config');
		addFile(tree, '.browserslistrc', browserlistrcFile);
		return tree;
	});
}
