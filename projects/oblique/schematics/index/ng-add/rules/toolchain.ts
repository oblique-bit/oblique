import {chain, Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {removePackageJsonDependency} from '@schematics/angular/utility/dependencies';
import {
	addDevDependency,
	addFile,
	deleteFile,
	getTemplate,
	packageJsonConfigPath,
	removeAngularConfig,
	setAngularConfig,
	getAngularConfig,
	getJson,
	readFile,
	infoMigration,
	setRootAngularConfig
} from '../../ng-add-utils';
import {addJest, addProtractor} from './tests';
import {jenkins} from './jenkins';

export function toolchain(options: any): Rule {
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
			addHusky(options.husky),
			addIE11Support(options.ie11)
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
		const path = ['architect', 'build', 'options', 'assets'];
		const assets = (getAngularConfig(tree, path) || []).filter((config: string) => !config.indexOf || config.indexOf('favicon') === -1);
		return setAngularConfig(tree, path, assets);
	};
}

function removeI18nFromAngularJson() {
	return (tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, "Toolchain: Removing Angular's i18n");
		return removeAngularConfig(tree, ['architect', 'extract-i18n']);
	};
}

function removeUnusedScripts() {
	return (tree: Tree, _context: SchematicContext) => {
		infoMigration(_context, 'Toolchain: Removing unused script');
		const json = getJson(tree, packageJsonConfigPath);
		delete json.scripts.e2e;
		delete json.scripts.ng;

		tree.overwrite(packageJsonConfigPath, JSON.stringify(json, null, 2));

		return tree;
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

		return setAngularConfig(tree, ['prefix'], prefix);
	};
}

function addProxy(port: string): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (port.match(/^\d+$/) && !tree.exists('proxy.conf.json')) {
			infoMigration(_context, 'Toolchain: Adding proxy configuration');
			addFile(tree, 'proxy.conf.json', getTemplate(tree, 'default-proxy.conf.json.config').replace('PORT', port));
			setAngularConfig(tree, ['architect', 'serve', 'options', 'proxyConfig'], 'proxy.conf.json');
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
				const packageJson = getJson(tree, packageJsonConfigPath);
				packageJson.jestSonar = {
					reportPath: './coverage/sonarQube',
					reportFile: 'sqr.xml',
					indent: 4,
					sonar56x: true
				};
				tree.overwrite(packageJsonConfigPath, JSON.stringify(packageJson, null, 2));
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
			const json = getJson(tree, packageJsonConfigPath);

			json.scripts.lint = "eslint 'src/**/*.ts'";
			json.scripts['lint:fix'] = 'npm run lint -- --fix';
			json.scripts.prettier = "node_modules/prettier/bin-prettier.js --write 'src/**/{*.ts,*.html}'";
			json.scripts.format = 'npm run lint:fix && npm run prettier';
			tree.overwrite(packageJsonConfigPath, JSON.stringify(json, null, 2));

			const prettier = getTemplate(tree, 'default-prettierrc.config');
			addFile(tree, '.prettierrc', prettier);

			let eslintFile = getTemplate(tree, 'default-eslintrc.js.config').replace(/APP_PREFIX/g, prefix);
			if (tree.exists('tsconfig.base.json')) {
				eslintFile.replace('tsconfig.json', 'tsconfig.base.json');
			}
			if (prefix === '') {
				eslintFile = eslintFile.replace(`'@angular-eslint/component-selector': ["error"`, `'@angular-eslint/component-selector': ["off"`);
				eslintFile = eslintFile.replace(`'@angular-eslint/directive-selector': ["error"`, `'@angular-eslint/directive-selector': ["off"`);
			}
			addFile(tree, '.eslintrc.js', eslintFile);
		}
		return tree;
	};
}

function addLintDeps(eslint: boolean): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (eslint) {
			const json = getJson(tree, packageJsonConfigPath);
			Object.keys(json.devDependencies)
				.filter((dep: string) => dep.indexOf('lint') > -1)
				.forEach((dep: string) => removePackageJsonDependency(tree, dep));

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
			const packageJson = getJson(tree, packageJsonConfigPath);
			packageJson.husky = {
				hooks: {
					'pre-push': 'npm run format'
				}
			};
			tree.overwrite(packageJsonConfigPath, JSON.stringify(packageJson, null, 2));
		}
		return tree;
	};
}

function addIE11Support(ie11: boolean): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (ie11) {
			infoMigration(_context, 'Toolchain: Adding IE11 support');
			const tsConfigName = tree.exists('tsconfig.base.json') ? 'tsconfig.base.json' : 'tsconfig.json';
			const tsConfig = readFile(tree, tsConfigName).replace(/"target"\s*:\s*"[^"]*"/, '"target": "es5"');
			tree.overwrite(tsConfigName, tsConfig);

			const browserslist = tree.exists('.browserslistrc') ? '.browserslistrc' : 'browserslist';
			const content = readFile(tree, browserslist) || '';
			const newContent = content.split('\n').reverse();
			newContent[0] = "IE 11\nnot IE 9-10 # For IE 9-11 support, remove 'not'";
			tree.overwrite(browserslist, newContent.reverse().join('\n'));
		}
		return tree;
	};
}
