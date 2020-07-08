import {chain, Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {addPackageJsonDependency, removePackageJsonDependency} from '@schematics/angular/utility/dependencies';
import {getFileContent} from '@schematics/angular/utility/test';
import {
	addFile,
	angularJsonConfigPath,
	createDevDependency,
	deleteFile,
	getJson,
	getJsonProperty,
	getTemplate,
	packageJsonConfigPath
} from '../../ng-add-utils';
import {addJest, addProtractor} from './tests';
import {jenkins} from './jenkins';

export function toolchain(options: any): Rule {
	return (tree: Tree, _context: SchematicContext) =>
		chain([
			addNpmrc(options.npmrc),
			moveStyles(),
			removeFavicon(),
			removeI18nFromAngularJson(),
			removeUnusedScripts(),
			addProxy(options.proxy),
			addJest(options.jest),
			addProtractor(options.protractor, options.jest),
			addSonar(options.sonar, options.jest),
			jenkins(options.jenkins, options.static, options.jest),
			addEslint(options.eslint, options.prefix),
			addHusky(options.husky),
			addIE11Support(options.ie11)
		])(tree, _context);
}

function addNpmrc(add: boolean): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (add) {
			addFile(tree, '.npmrc', getTemplate('default-npmrc.config'));
		}
		return tree;
	};
}

function moveStyles(): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (!tree.exists('src/styles/styles.scss')) {
			const stylesContent = tree.read('src/styles.scss') || '';
			const comment = '// this file should contain only imports. Rules should be grouped by features and placed into the corresponding file';
			tree.create('src/styles/styles.scss', `${comment}\n${stylesContent.toString()}`);
			tree.delete('src/styles.scss');
			const content = tree.read('angular.json') || '';
			tree.overwrite('angular.json', content.toString().replace(/"src\/styles\.scss"/g, '"src/styles/styles.scss"'));
		}
		return tree;
	};
}

function removeFavicon(): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		deleteFile(tree, 'src/favicon.ico');

		const json = getJson(tree, angularJsonConfigPath);
		const defaultProjectName = getJsonProperty(json, 'defaultProject');
		json.projects[defaultProjectName].architect.build.options.assets = json.projects[defaultProjectName].architect.build.options.assets.filter(
			(config: string) => !config.indexOf || config.indexOf('favicon') === -1
		);

		tree.overwrite('angular.json', JSON.stringify(json, null, 2));
		return tree;
	};
}

function removeI18nFromAngularJson() {
	return (tree: Tree, _context: SchematicContext) => {
		const json = getJson(tree, angularJsonConfigPath);
		const defaultProjectName = getJsonProperty(json, 'defaultProject');
		delete json.projects[defaultProjectName].architect['extract-i18n'];

		tree.overwrite(angularJsonConfigPath, JSON.stringify(json, null, 2));

		return tree;
	};
}

function removeUnusedScripts() {
	return (tree: Tree, _context: SchematicContext) => {
		const json = getJson(tree, packageJsonConfigPath);
		delete json.scripts.e2e;
		delete json.scripts.ng;

		tree.overwrite(packageJsonConfigPath, JSON.stringify(json, null, 2));

		return tree;
	};
}

function addProxy(port: number): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (port >= 0 && !tree.exists('proxy.conf.json')) {
			tree.create('proxy.conf.json', getTemplate('default-proxy.conf.json.config').replace('PORT', port.toString()));
			const json = getJson(tree, angularJsonConfigPath);
			const defaultProjectName = getJsonProperty(json, 'defaultProject');
			json.projects[defaultProjectName].architect.serve.options.proxyConfig = 'proxy.conf.json';
			tree.overwrite(angularJsonConfigPath, JSON.stringify(json, null, 2));
		}
		return tree;
	};
}

function addSonar(sonar: boolean, jest: boolean): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (sonar) {
			addFile(tree, 'sonar-project.properties', getTemplate('default-sonar-project.properties.config'));
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
			const lines = getFileContent(tree, './tests/jest.config.js').split('\n');
			tree.overwrite('./tests/jest.config.js', lines.filter((line: string) => line.indexOf('sonar') === -1).join('\n'));
		}
		return tree;
	};
}

function addEslint(eslint: boolean, prefix: string): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (eslint) {
			deleteFile(tree, 'tslint.json');
			const json = getJson(tree, packageJsonConfigPath);
			addLintDeps(tree, json);

			json.scripts.lint = "eslint 'src/**/*.ts'";
			json.scripts['lint:fix'] = 'npm run lint -- --fix';
			json.scripts.prettier = "node_modules/prettier/bin-prettier.js --write 'src/**/{*.ts,*.html}'";
			json.scripts.format = 'npm run lint:fix && npm run prettier';
			tree.overwrite(packageJsonConfigPath, JSON.stringify(json, null, 2));

			const prettier = getTemplate('default-prettierrc.config');
			tree.create('.prettierrc', prettier);

			let eslintFile = getTemplate('default-eslintrc.js.config').replace(/APP_PREFIX/g, prefix);
			if (prefix === '') {
				eslintFile = eslintFile.replace(`'@angular-eslint/component-selector': ["error"`, `'@angular-eslint/component-selector': ["off"`);
				eslintFile = eslintFile.replace(`'@angular-eslint/directive-selector': ["error"`, `'@angular-eslint/directive-selector': ["off"`);
			}
			tree.create('.eslintrc.js', eslintFile);
		}
		return tree;
	};
}

function addLintDeps(tree: Tree, json: any): void {
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
	].forEach(dependency => addPackageJsonDependency(tree, createDevDependency(dependency)));
}

function addHusky(husky: boolean): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (husky) {
			addPackageJsonDependency(tree, createDevDependency('husky'));
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
			const tsConfig = getJson(tree, 'tsconfig.json');
			tsConfig.compilerOptions.target = 'es5';
			tree.overwrite('tsconfig.json', JSON.stringify(tsConfig, null, 2));
			const content = tree.read('browserslist') || '';
			const newContent = content.toString().split('\n').reverse();
			newContent[0] = "IE 11\nnot IE 9-10 # For IE 9-11 support, remove 'not'";
			tree.overwrite('browserslist', newContent.reverse().join('\n'));
		}
		return tree;
	};
}
