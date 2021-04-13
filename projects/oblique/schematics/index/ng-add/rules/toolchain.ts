import {chain, Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {ObIOptionsSchema} from '../ng-add.model';
import {addDevDependency, addRootProperty, addScript, deleteFile, getTemplate, removeDevDependencies, removeScript} from '../ng-add-utils';
import {
	addFile,
	getAngularConfigs,
	infoMigration,
	readFile,
	removeAngularProjectsConfig,
	setAngularConfig,
	setAngularProjectsConfig,
	setRootAngularConfig
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
			addProxy(options.proxy),
			addJest(options.jest),
			addProtractor(options.protractor, options.jest),
			addSonar(options.sonar, options.jest),
			jenkins(options.jenkins, options.static, options.jest),
			addLintDeps(options.eslint),
			addEslint(options.eslint, options.prefix),
			addHusky(options.husky)
		])(tree, _context);
}

function moveStyles(): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (!tree.exists('src/styles/styles.scss')) {
			infoMigration(_context, 'Toolchain: Moving style sheets into "styles" directory');
			const stylesContent = readFile(tree, 'src/styles.scss') || '';
			const comment = '// this file should contain only imports. Rules should be grouped by features and placed into the corresponding file';
			addFile(tree, 'src/styles/styles.scss', `${comment}\n${stylesContent}`);
			deleteFile(tree, 'src/styles.scss');
			const content = readFile(tree, 'angular.json') || '';
			tree.overwrite('angular.json', content.replace(/"src\/styles\.scss"/g, '"src/styles/styles.scss"'));
		}
		return tree;
	};
}

function addNpmrc(add: boolean): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (add) {
			infoMigration(_context, 'Toolchain: Adding .npmrc');
			addFile(tree, '.npmrc', getTemplate(tree, 'default-npmrc.config'));
		}
		return tree;
	};
}

function removeFavicon(): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, "Toolchain: Removing Angular's favicon");
		deleteFile(tree, 'src/favicon.ico');
		return setAngularProjectsConfig(tree, ['architect', 'build', 'options', 'assets'], (config: any) =>
			(config || []).filter((conf: string) => !conf.indexOf || conf.indexOf('favicon') === -1)
		);
	};
}

function removeI18nFromAngularJson() {
	return (tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, "Toolchain: Removing Angular's i18n");
		return removeAngularProjectsConfig(tree, ['architect', 'extract-i18n']);
	};
}

function removeUnusedScripts() {
	return (tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, 'Toolchain: Removing unused script');
		return removeScript(tree, 'ng');
	};
}

function addPrefix(prefix: string): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, "Toolchain: Setting application's prefix");
		tree = setRootAngularConfig(tree, ['schematics'], {
			'@schematics/angular:component': {
				prefix: prefix,
				style: 'scss'
			},
			'@schematics/angular:directive': {
				prefix: prefix
			}
		});

		return setAngularProjectsConfig(tree, ['prefix'], prefix);
	};
}

function addProxy(port: string): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (port.match(/^\d+$/) && !tree.exists('proxy.conf.json')) {
			infoMigration(_context, 'Toolchain: Adding proxy configuration');
			addFile(tree, 'proxy.conf.json', getTemplate(tree, 'default-proxy.conf.json.config').replace('PORT', port));
			setAngularProjectsConfig(tree, ['architect', 'serve', 'options', 'proxyConfig'], 'proxy.conf.json');
		}
		return tree;
	};
}

function addSonar(sonar: boolean, jest: boolean): Rule {
	return (tree: Tree, _context: SchematicContext) => {
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
			tree.overwrite('./tests/jest.config.js', lines.filter((line: string) => line.indexOf('sonar') === -1).join('\n'));
		}
		return tree;
	};
}

function addEslint(eslint: boolean, prefix: string): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (eslint) {
			infoMigration(_context, 'Toolchain: Replacing "tslint" with "eslint"');
			deleteFile(tree, 'tslint.json');
			addScript(tree, 'lint', 'ng lint');
			addScript(tree, 'prettier', './node_modules/.bin/prettier --write src/**/{*.ts,*.html}');
			addScript(tree, 'format', 'npm run lint -- --fix && npm run prettier');

			const prettier = getTemplate(tree, 'default-prettierrc.config');
			addFile(tree, '.prettierrc', prettier);

			let eslintFile = getTemplate(tree, 'default-eslintrc.json.config').replace(/APP_PREFIX/g, prefix);
			if (tree.exists('tsconfig.base.json')) {
				eslintFile.replace('tsconfig.json', 'tsconfig.base.json');
			}
			if (prefix === '') {
				eslintFile = eslintFile.replace(`'@angular-eslint/component-selector': ["error"`, `'@angular-eslint/component-selector': ["off"`);
				eslintFile = eslintFile.replace(`'@angular-eslint/directive-selector': ["error"`, `'@angular-eslint/directive-selector': ["off"`);
			}
			addFile(tree, '.eslintrc.json', eslintFile);
			const path = ['architect', 'lint'];
			getAngularConfigs(tree, path).forEach(project => {
				setAngularConfig(tree, path, {
					project: project.project,
					config: {
						builder: '@angular-eslint/builder:lint',
						options: {lintFilePatterns: ['src/**/*.ts']}
					}
				});
			});
		}
		return tree;
	};
}

function addLintDeps(eslint: boolean): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (eslint) {
			removeDevDependencies(tree, 'lint');

			[
				'@angular-eslint/builder',
				'@angular-eslint/eslint-plugin',
				'@typescript-eslint/eslint-plugin',
				'@typescript-eslint/parser',
				'eslint',
				'eslint-config-prettier',
				'eslint-plugin-prettier',
				'prettier'
			].forEach(dependency => addDevDependency(tree, dependency));
		}

		return tree;
	};
}

function addHusky(husky: boolean): Rule {
	return (tree: Tree, _context: SchematicContext) => {
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
	};
}
