import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {ObIOptionsSchema} from '../ng-add.model';
import {
	addDevDependency,
	addScript,
	angularAppFilesNames,
	getTemplate,
	removeDevDependencies,
	removeRootProperty,
	removeScript,
} from '../ng-add-utils';
import {
	addFile,
	createSafeRule,
	deleteFile,
	getAngularConfigs,
	infoMigration,
	readFile,
	removeAngularProjectsConfig,
	replaceInFile,
	setAngularConfig,
	setAngularProjectsConfig,
	setRootAngularConfig,
	writeFile,
} from '../../utils';
import {addJest} from './tests';

export function toolchain(options: ObIOptionsSchema): Rule {
	return (tree: Tree, context: SchematicContext) =>
		chain([
			setBuilder(),
			moveStyles(),
			removeFavicon(),
			removeUnusedScripts(),
			addPrefix(options.prefix),
			updateExistingPrefixes(options.prefix),
			addJest(options.jest),
			updateEditorConfig(options.eslint),
			addPrettier(options.eslint),
			addHusky(options.husky),
			addEnvironmentFiles(options.environments, options.banner),
			excludeEnvironmentFiles(),
			setEnvironments(options.environments),
		])(tree, context);
}

function setBuilder(): Rule {
	return createSafeRule((tree: Tree, context: SchematicContext) => {
		infoMigration(context, 'Toolchain: Setting angular builder');
		getAngularConfigs(tree, []).forEach(project => {
			const {build} = project.config.architect;
			const {serve} = project.config.architect;
			const buildOptions = build.options;
			const buildConfigurations = build.configurations;
			const buildConfigurationsProduction = buildConfigurations.production;
			const buildConfigurationsDevelopment = buildConfigurations.development;

			setAngularConfig(tree, ['architect', 'build'], {
				project: project.project,
				config: {
					...build,
					builder: '@angular-devkit/build-angular:browser',
					options: {
						...buildOptions,
						main: buildOptions.browser,
						outputPath: 'dist',
						index: 'src/index.html',
					},
					configurations: {
						...buildConfigurations.config,
						development: {
							...buildConfigurationsDevelopment.config,
							buildOptimizer: false,
							vendorChunk: true,
						},
						production: {
							...buildConfigurationsProduction,
						},
					},
				},
			});

			setAngularConfig(tree, ['architect', 'serve'], {
				project: project.project,
				config: {
					...serve,
					builder: '@angular-devkit/build-angular:dev-server',
				},
			});
		});
		removeAngularProjectsConfig(tree, ['architect', 'build', 'options', 'browser']);
		removeDevDependencies(tree, '@angular/build');
		addDevDependency(tree, '@angular-devkit/build-angular');
		return tree;
	});
}

function moveStyles(): Rule {
	return createSafeRule((tree: Tree, context: SchematicContext) => {
		if (!tree.exists('src/styles/styles.scss')) {
			infoMigration(context, 'Toolchain: Moving style sheets into "styles" directory');
			const comment =
				'// this file should contain only imports. Rules should be grouped by features and placed into the corresponding file';
			addFile(tree, 'src/styles/styles.scss', comment);
			deleteFile(tree, 'src/styles.scss');
			const content = readFile(tree, 'angular.json') || '';
			tree.overwrite('angular.json', content.replace(/"src\/styles\.scss"/g, '"src/styles/styles.scss"'));
		}
		return tree;
	});
}

function removeFavicon(): Rule {
	return createSafeRule((tree: Tree, context: SchematicContext) => {
		infoMigration(context, "Toolchain: Removing Angular's favicon");
		deleteFile(tree, 'public/favicon.ico');
		return setAngularProjectsConfig(
			tree,
			['architect', 'build', 'options', 'assets'],
			(config: (string | Record<string, string>)[]) =>
				(config || []).filter(
					item => typeof item === 'string' || JSON.stringify(item) !== '{"glob":"**/*","input":"public"}'
				)
		);
	});
}

function removeUnusedScripts(): Rule {
	return createSafeRule((tree: Tree, context: SchematicContext) => {
		infoMigration(context, 'Toolchain: Removing unused script');
		return removeScript(tree, 'ng');
	});
}

function addPrefix(prefix: string): Rule {
	return createSafeRule((tree: Tree, context: SchematicContext) => {
		infoMigration(context, "Toolchain: Setting application's prefix");
		tree = setRootAngularConfig(tree, ['schematics'], {
			'@schematics/angular:component': {
				prefix,
				style: 'scss',
			},
			'@schematics/angular:directive': {
				prefix,
			},
		});
		return setAngularProjectsConfig(tree, ['prefix'], prefix);
	});
}

function updateExistingPrefixes(prefix: string): Rule {
	return createSafeRule((tree: Tree) => {
		replaceInFile(tree, 'src/index.html', /<app-root><\/app-root>/g, `<${prefix}-root></${prefix}-root>`);
		replaceInFile(tree, `src/app/${angularAppFilesNames.appComponent}`, /app-root/g, `${prefix}-root`);
		return tree;
	});
}

function updateEditorConfig(eslint: boolean): Rule {
	return createSafeRule((tree: Tree, context: SchematicContext) => {
		if (eslint) {
			infoMigration(context, 'Toolchain: update ".editorconfig"');
			writeFile(tree, '.editorconfig', getTemplate(tree, 'default-editorconfig.config'));
		}
		return tree;
	});
}

function addPrettier(eslint: boolean): Rule {
	return createSafeRule((tree: Tree, context: SchematicContext) => {
		if (eslint) {
			infoMigration(context, 'Toolchain: Adding "prettier"');
			['prettier', 'eslint-config-prettier', 'eslint-plugin-prettier'].forEach(dependency =>
				addDevDependency(tree, dependency)
			);
			addScript(tree, 'format', 'npm run lint -- --fix');
			writeFile(tree, '.prettierrc', getTemplate(tree, 'default-prettierrc.config'));
			removeRootProperty(tree, 'prettier');
		}
		return tree;
	});
}

function addHusky(husky: boolean): Rule {
	return createSafeRule((tree: Tree, context: SchematicContext) => {
		if (husky) {
			infoMigration(context, 'Toolchain: Adding git hooks for code auto-formatting');
			addDevDependency(tree, 'husky');
			addScript(tree, 'prepare', 'husky');
			tree.create('.husky/pre-commit', 'npm run format');
		}
		return tree;
	});
}

function addEnvironmentFiles(environments: string, hasBanner: boolean): Rule {
	return createSafeRule((tree: Tree, context: SchematicContext) => {
		if (environments) {
			infoMigration(context, 'Toolchain: Adding environment files');
			environments
				.split(' ')
				.map(environment => ({
					fileName: environment === 'local' ? 'environment.ts' : `environment.${environment}.ts`,
					content: getEnvironmentFileContent(environment, hasBanner),
				}))
				.forEach(environment => addEnvironmentFile(tree, environment.fileName, environment.content));
		}
		return tree;
	});
}

function excludeEnvironmentFiles() {
	return (tree: Tree, context: SchematicContext): Tree => {
		infoMigration(context, 'Toolchain: Exclude environment files for tsConfig');
		// can't use JSON.parse as the file contains comments
		const tsConfigPath = 'tsconfig.app.json';
		const tsConfig = readFile(tree, tsConfigPath).replace(
			/(?<indent>^\s*)(?<key>"exclude"\s*:\s*\[\s*)/mu,
			'$<indent>$<key>"src/environments/environment.*.ts",\n$<indent>$<indent>'
		);
		writeFile(tree, tsConfigPath, tsConfig);
		return tree;
	};
}

function getEnvironmentFileContent(environment: string, hasBanner: boolean): string {
	return `export const environment = ${hasBanner && environment !== 'prod' ? `{banner: {text: '${environment.toUpperCase()}'}}` : '{}'};`;
}

function addEnvironmentFile(tree: Tree, fileName: string, fileContent: string): void {
	getAngularConfigs(tree, ['sourceRoot'])
		.map(config => config.config as string)
		.forEach(sourceRoot => writeFile(tree, `${sourceRoot}/environments/${fileName}`, fileContent));
}

function setEnvironments(environments: string): Rule {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, context: SchematicContext): Tree =>
		setAngularProjectsConfig(tree, ['architect', 'build', 'configurations'], (config: any) => {
			environments.split(' ').forEach(environment => {
				config[environment] = {...config.production};
				if (config[environment].fileReplacements) {
					config[environment].fileReplacements[0].with = config[environment].fileReplacements[0].with.replace(
						'prod',
						environment
					);
				} else {
					config[environment].fileReplacements = [
						{
							replace: 'projects/sandbox/src/environments/environment.ts',
							with: `projects/sandbox/src/environments/environment.${environment}.ts`,
						},
					];
				}

				if (environment === 'dev') {
					config.dev.optimization = false;
					config.dev.sourceMap = true;
				}
			});

			return config;
		});
}
