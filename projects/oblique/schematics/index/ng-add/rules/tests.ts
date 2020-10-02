import {chain, Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {addPackageJsonDependency, NodeDependency, removePackageJsonDependency} from '@schematics/angular/utility/dependencies';
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

export function addJest(jest: boolean): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (!jest) {
			return tree;
		}
		return chain([removeJasmine(), addJestDependencies(), createJestConfigFiles(), referToJest()])(tree, _context);
	};
}

export function addProtractor(protractor: boolean, jest: boolean): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (protractor) {
			return tree;
		}
		return chain([removeE2eFolder(), removeE2eFromAngularJson(), removeE2eFromPackage(jest)])(tree, _context);
	};
}

function removeJasmine() {
	return (tree: Tree, _context: SchematicContext) => {
		let jasmineTsConfigJson = getJson(tree, 'src/tsconfig.spec.json');
		if (!jasmineTsConfigJson) {
			const tpl = getTemplate(tree, 'default-tsconfig.spec.json');

			if (tree.exists('tsconfig.base.json')) {
				tpl.replace('tsconfig.json', 'tsconfig.base.json');
			}
			addFile(tree, 'src/tsconfig.spec.json', tpl);
			jasmineTsConfigJson = getJson(tree, 'src/tsconfig.spec.json');
		}

		const types: string[] = jasmineTsConfigJson.compilerOptions.types;
		if (types.includes('jasmine')) {
			jasmineTsConfigJson.compilerOptions.types.splice(types.indexOf('jasmine'), 1);
		}

		if (!types.includes('jest')) {
			jasmineTsConfigJson.compilerOptions.types.push('jest');
		}

		deleteFile(tree, 'src/tests.ts');
		deleteFile(tree, 'karma.conf.js');
		tree.overwrite('src/tsconfig.spec.json', JSON.stringify(jasmineTsConfigJson, null, 2));

		return tree;
	};
}

function addJestDependencies() {
	return (tree: Tree, _context: SchematicContext) => {
		const dependencies: NodeDependency[] = [
			createDevDependency('jest'),
			createDevDependency('@types/jest'),
			createDevDependency('jest-sonar-reporter'),
			createDevDependency('@angular-builders/jest')
		];

		dependencies.forEach(dependency => addPackageJsonDependency(tree, dependency));
		const json = getJson(tree, packageJsonConfigPath);
		Object.keys(json.devDependencies)
			.filter((dep: string) => dep.indexOf('karma') > -1)
			.forEach((dep: string) => removePackageJsonDependency(tree, dep));

		return tree;
	};
}

function createJestConfigFiles() {
	return (tree: Tree, _context: SchematicContext) => {
		addFile(tree, 'tests/jest.config.js', getTemplate(tree, 'default-jest.config'));
		addFile(tree, 'tests/setupJest.ts', "import 'jest-preset-angular';\nimport './jestGlobalMocks'; // browser mocks globally available for every test");
		addFile(tree, 'tests/jestGlobalMocks.ts', getTemplate(tree, 'default-jestGlobalMocks.config'));
	};
}

function referToJest() {
	return (tree: Tree, _context: SchematicContext) => {
		const json = getJson(tree, angularJsonConfigPath);
		const defaultProjectName = getJsonProperty(json, 'defaultProject');
		json.projects[defaultProjectName].architect.test = {
			builder: '@angular-builders/jest:run',
			options: {
				configPath: './tests/jest.config.js',
				watch: true,
				verbose: true
			},
			configurations: {
				production: {
					watch: false,
					verbose: false
				}
			}
		};
		tree.overwrite(angularJsonConfigPath, JSON.stringify(json, null, 2));

		return tree;
	};
}

function removeE2eFolder(): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (tree.exists('e2e')) {
			tree.delete('e2e');
		}
		return tree;
	};
}

function removeE2eFromAngularJson() {
	return (tree: Tree, _context: SchematicContext) => {
		const json = getJson(tree, angularJsonConfigPath);
		const defaultProjectName = getJsonProperty(json, 'defaultProject');
		delete json.projects[defaultProjectName].architect.e2e;
		json.projects[defaultProjectName].architect.lint.options.tsConfig = json.projects[defaultProjectName].architect.lint.options.tsConfig.filter(
			(config: string) => config.indexOf('e2e') === -1
		);

		tree.overwrite(angularJsonConfigPath, JSON.stringify(json, null, 2));

		return tree;
	};
}

function removeE2eFromPackage(jest: boolean) {
	return (tree: Tree, _context: SchematicContext) => {
		const packageJson = getJson(tree, packageJsonConfigPath);
		removePackageJsonDependency(tree, 'protractor');
		if (jest) {
			Object.keys(packageJson.devDependencies)
				.filter((dep: string) => dep.indexOf('jasmine') > -1)
				.forEach((dep: string) => removePackageJsonDependency(tree, dep));
		}

		delete packageJson.scripts.e2e;
		tree.overwrite(packageJsonConfigPath, JSON.stringify(packageJson, null, 2));

		return tree;
	};
}
