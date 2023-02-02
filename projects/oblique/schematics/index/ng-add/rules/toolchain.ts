import {Rule, SchematicContext, Tree, chain, externalSchematic} from '@angular-devkit/schematics';
import {ObIOptionsSchema} from '../ng-add.model';
import {addDevDependency, addRootProperty, addScript, getTemplate, removeScript} from '../ng-add-utils';
import {
	addFile,
	createSafeRule,
	deleteFile,
	getAngularConfigs,
	infoMigration,
	readFile,
	removeAngularProjectsConfig,
	replaceInFile,
	setAngularProjectsConfig,
	setRootAngularConfig,
	writeFile
} from '../../utils';
import {addJest, addProtractor} from './tests';
import {jenkins} from './jenkins';

export function toolchain(options: ObIOptionsSchema): Rule {
	return (tree: Tree, _context: SchematicContext) =>
		chain([
			moveStyles(),
			addNpmrc(options.npmrc),
			removeFavicon(),
			removeI18nFromAngularJson(),
			removeUnusedScripts(),
			addPrefix(options.prefix),
			updateExistingPrefixes(options.prefix),
			addProxy(options.proxy),
			addJest(options.jest),
			addProtractor(options.protractor, options.jest),
			addSonar(options.sonar, options.jest),
			jenkins(options.jenkins, options.static, options.jest),
			updateEditorConfig(options.eslint),
			addEslint(options.eslint),
			addPrettier(options.eslint),
			overwriteEslintRC(options.eslint, options.prefix),
			addHusky(options.husky),
			addEnvironmentFiles(options.environments, options.banner)
		])(tree, _context);
}

function moveStyles(): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		if (!tree.exists('src/styles/styles.scss')) {
			infoMigration(_context, 'Toolchain: Moving style sheets into "styles" directory');
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

function addNpmrc(add: boolean): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		if (add) {
			infoMigration(_context, 'Toolchain: Adding .npmrc');
			addFile(tree, '.npmrc', getTemplate(tree, 'default-npmrc.config'));
		}
		return tree;
	});
}

function removeFavicon(): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, "Toolchain: Removing Angular's favicon");
		deleteFile(tree, 'src/favicon.ico');
		return setAngularProjectsConfig(tree, ['architect', 'build', 'options', 'assets'], (config: any) =>
			(config || []).filter((conf: string) => !conf.indexOf || !conf.includes('favicon'))
		);
	});
}

function removeI18nFromAngularJson(): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, "Toolchain: Removing Angular's i18n");
		return removeAngularProjectsConfig(tree, ['architect', 'extract-i18n']);
	});
}

function removeUnusedScripts(): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, 'Toolchain: Removing unused script');
		return removeScript(tree, 'ng');
	});
}

function addPrefix(prefix: string): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, "Toolchain: Setting application's prefix");
		tree = setRootAngularConfig(tree, ['schematics'], {
			'@schematics/angular:component': {
				prefix,
				style: 'scss'
			},
			'@schematics/angular:directive': {
				prefix
			}
		});
		return setAngularProjectsConfig(tree, ['prefix'], prefix);
	});
}

function updateExistingPrefixes(prefix: string): Rule {
	return createSafeRule((tree: Tree) => {
		replaceInFile(tree, 'src/index.html', /<app-root><\/app-root>/g, `<${prefix}-root></${prefix}-root>`);
		replaceInFile(tree, 'src/app/app.component.ts', /app-root/g, `${prefix}-root`);
		return tree;
	});
}

function addProxy(port: string): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		if (/^\d+$/.test(port) && !tree.exists('proxy.conf.json')) {
			infoMigration(_context, 'Toolchain: Adding proxy configuration');
			addFile(tree, 'proxy.conf.json', getTemplate(tree, 'default-proxy.conf.json.config').replace('PORT', port));
			setAngularProjectsConfig(tree, ['architect', 'serve', 'options', 'proxyConfig'], 'proxy.conf.json');
		}
		return tree;
	});
}

function addSonar(sonar: boolean, jest: boolean): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		if (sonar) {
			infoMigration(_context, 'Toolchain: Adding Sonar configuration');
			addFile(tree, 'sonar-project.properties', getTemplate(tree, 'default-sonar-project.properties.config'));
			if (jest) {
				addRootProperty(tree, 'jestSonar', {
					reportPath: './coverage/sonarQube',
					reportFile: 'sqr.xml',
					indent: 4,
					sonar56x: true
				});
			}
		} else if (jest) {
			const lines = readFile(tree, './tests/jest.config.js').split('\n');
			tree.overwrite('./tests/jest.config.js', lines.filter((line: string) => !line.includes('sonar')).join('\n'));
		}
		return tree;
	});
}

function updateEditorConfig(eslint: boolean): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		if (eslint) {
			infoMigration(_context, 'Toolchain: update ".editorconfig"');
			writeFile(tree, '.editorconfig', getTemplate(tree, 'default-editorconfig.config'));
		}
		return tree;
	});
}

function addEslint(eslint: boolean): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		if (eslint) {
			infoMigration(_context, 'Toolchain: Adding "eslint"');
			return externalSchematic('@angular-eslint/schematics', 'ng-add', {});
		}
		return tree;
	});
}

function addPrettier(eslint: boolean): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		if (eslint) {
			infoMigration(_context, 'Toolchain: Adding "prettier"');
			['prettier', 'eslint-config-prettier', 'eslint-plugin-prettier'].forEach(dependency => addDevDependency(tree, dependency));
			addScript(tree, 'format', 'npm run lint -- --fix');
			writeFile(tree, '.prettierrc', getTemplate(tree, 'default-prettierrc.config'));
		}
		return tree;
	});
}

function overwriteEslintRC(eslint: boolean, prefix: string): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		if (eslint) {
			infoMigration(_context, 'Toolchain: overwrite ".eslintrc.json"');
			writeFile(tree, '.eslintrc.json', formatEsLintRC(tree, prefix));
		}
		return tree;
	});
}

function formatEsLintRC(tree: Tree, prefix: string): string {
	const eslintFile = getTemplate(tree, 'default-eslintrc.json.config');
	return prefix
		? eslintFile.replace(/APP_PREFIX/g, prefix)
		: eslintFile.replace(/\s*"@angular-eslint\/(?:component|directive)-selector": \[.*?],/gs, '');
}

function addHusky(husky: boolean): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		if (husky) {
			infoMigration(_context, 'Toolchain: Adding git hooks for code auto-formatting');
			addDevDependency(tree, 'husky');
			addRootProperty(tree, 'husky', {
				hooks: {
					'pre-push': 'npm run format'
				}
			});
		}
		return tree;
	});
}

function addEnvironmentFiles(environments: string, hasBanner: boolean): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		if (environments) {
			infoMigration(_context, 'Toolchain: Adding environment files');
			environments
				.split(' ')
				.map(environment => ({
					fileName: environment === 'local' ? 'environment.ts' : `environment.${environment}.ts`,
					content: getEnvironmentFileContent(environment, hasBanner)
				}))
				.forEach(environment => addEnvironmentFile(tree, environment.fileName, environment.content));
		}
		return tree;
	});
}

function getEnvironmentFileContent(environment: string, hasBanner: boolean): string {
	return `export const environment = ${hasBanner && environment !== 'prod' ? `{banner: {text: '${environment.toUpperCase()}'}}` : '{}'};`;
}

function addEnvironmentFile(tree: Tree, fileName: string, fileContent: string): void {
	getAngularConfigs(tree, ['sourceRoot'])
		.map(config => config.config as string)
		.forEach(sourceRoot => writeFile(tree, `${sourceRoot}/environments/${fileName}`, fileContent));
}
