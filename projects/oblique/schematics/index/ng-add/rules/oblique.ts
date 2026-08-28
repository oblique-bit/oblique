import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {angularAppFilesNames, appModulePath, getTemplate, importModuleInRoot, obliqueCssPath} from '../ng-add-utils';
import {ObIOptionsSchema} from '../ng-add.model';
import {
	ObliquePackage,
	createSafeRule,
	getIndexPaths,
	includeAngularConfigInList,
	infoMigration,
	overwriteIndexFile,
	readFile,
	setAngularProjectsConfig,
} from '../../utils';

export function oblique(options: ObIOptionsSchema): Rule {
	return (tree: Tree, context: SchematicContext) =>
		chain([
			embedMasterLayout(options.title, options.applicationOperator),
			addAdditionalModules(),
			addFeatureDetection(),
			addMainCSS(),
			addLocalAssets(),
			addObliqueAssets(),
			addFontFiles(),
			raiseBuildBudget(),
		])(tree, context);
}

function embedMasterLayout(title: string, applicationOperator: string): Rule {
	return createSafeRule((tree: Tree, context: SchematicContext) => {
		infoMigration(context, 'Oblique: Embedding Master Layout');
		importModuleInRoot(tree, 'ObMasterLayoutModule', ObliquePackage);
		addMasterLayout(tree, title, applicationOperator);
		infoMigration(context, 'MasterLayout integrated.');
		return tree;
	});
}

function addAdditionalModules(): Rule {
	return createSafeRule((tree: Tree, context: SchematicContext) => {
		infoMigration(context, 'Oblique: Add ObButtonModule');
		importModuleInRoot(tree, 'ObButtonModule', ObliquePackage);
		addComment(tree);

		return tree;
	});
}

function addFeatureDetection(): Rule {
	return createSafeRule((tree: Tree, context: SchematicContext) => {
		infoMigration(context, 'Oblique: Adding browser compatibility check');
		getIndexPaths(tree).forEach((indexPath: string) =>
			overwriteIndexFile(
				indexPath,
				tree,
				/<body>(?<lineBreak>\r?\n)/,
				`<body>$<lineBreak>${getTemplate(tree, 'default-index.html')}`
			)
		);
		return includeAngularConfigInList(
			tree,
			['architect', 'build', 'options', 'scripts'],
			'node_modules/@oblique/oblique/ob-features.js'
		);
	});
}

function addMainCSS(): Rule {
	return createSafeRule((tree: Tree, context: SchematicContext) => {
		infoMigration(context, 'Oblique: Adding main CSS');
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

function addLocalAssets(): Rule {
	return createSafeRule((tree: Tree, context: SchematicContext) => {
		infoMigration(context, 'Oblique: Adding local assets');
		return setAngularProjectsConfig(tree, ['architect', 'build', 'options', 'assets'], (config: any) => [
			'src/assets',
			...config,
		]);
	});
}

function addObliqueAssets(): Rule {
	return createSafeRule((tree: Tree, context: SchematicContext) => {
		infoMigration(context, 'Oblique: Adding assets');
		return setAngularProjectsConfig(tree, ['architect', 'build', 'options', 'assets'], (config: any) => [
			{
				glob: '**/*',
				input: 'node_modules/@oblique/oblique/assets',
				output: 'assets',
			},
			...config,
		]);
	});
}

function addFontFiles(): Rule {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return createSafeRule((tree: Tree, context: SchematicContext) => {
		setAngularProjectsConfig(tree, ['architect', 'build', 'options', 'assets'], (config: any) => {
			config.splice(1, 0, {
				glob: '*/**',
				input: 'node_modules/@oblique/oblique/styles/fonts',
				output: 'assets/fonts',
			});
			return config;
		});
		return tree;
	});
}

function addMasterLayout(tree: Tree, title: string, applicationOperator: string): void {
	const path = `src/app/${angularAppFilesNames.appTemplate}`;
	if (tree.exists(path)) {
		tree.overwrite(
			path,
			getTemplate(tree, 'default-master-layout.html')
				.replace(/_APP_TITLE_PLACEHOLDER_/, title)
				.replace(/_APPLICATION_OPERATOR_/, applicationOperator)
		);
	}

	const appComponentPath = `src/app/${angularAppFilesNames.appComponent}`;
	if (tree.exists(appComponentPath)) {
		const appComponentContent = readFile(tree, appComponentPath);
		const titleRegex = /protected\sreadonly\stitle.*/u;
		const appRegex = /App\s\{/u;
		const yearString = 'App {\nreadonly year = signal(new Date().getFullYear());';
		tree.overwrite(appComponentPath, appComponentContent.replace(titleRegex, '').replace(appRegex, yearString));
	}
}

function addComment(tree: Tree): void {
	const appModuleContent = readFile(tree, appModulePath);
	tree.overwrite(
		appModulePath,
		appModuleContent.replace(/ObButtonModule,\n/, 'ObButtonModule, // add other Oblique modules as needed\n')
	);
}

function raiseBuildBudget(): Rule {
	return createSafeRule((tree: Tree, context: SchematicContext) => {
		infoMigration(context, 'Raise build budget in angular.json');
		return setAngularProjectsConfig(
			tree,
			['architect', 'build', 'configurations', 'production', 'budgets'],
			[
				{
					type: 'initial',
					maximumWarning: '1.7mb',
					maximumError: '2mb',
				},
				{
					type: 'anyComponentStyle',
					maximumWarning: '3kb',
					maximumError: '4kb',
				},
			]
		);
	});
}
