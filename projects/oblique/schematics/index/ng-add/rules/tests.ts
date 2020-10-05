import {chain, Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {removePackageJsonDependency} from '@schematics/angular/utility/dependencies';
import {
	addDevDependency,
	addFile,
	deleteFile,
	getAngularConfig,
	getJson,
	getTemplate,
	infoMigration,
	packageJsonConfigPath,
	removeAngularConfig,
	setAngularConfig
} from '../../ng-add-utils';

export function addJest(jest: boolean): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (!jest) {
			return tree;
		}

		infoMigration(_context, 'Toolchain: Replacing karma/jasmine with jest');
		return chain([removeJasmine(), addJestDependencies(), createJestConfigFiles(), referToJest()])(tree, _context);
	};
}

export function addProtractor(protractor: boolean, jest: boolean): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (protractor) {
			return tree;
		}
		infoMigration(_context, 'Toolchain: Remove protractor and everything related to e2e tests');
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
		['jest', '@types/jest', 'jest-sonar-reporter', '@angular-builders/jest'].forEach(dependency => addDevDependency(tree, dependency));

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

		return tree;
	};
}

function referToJest() {
	return (tree: Tree, _context: SchematicContext) =>
		setAngularConfig(tree, ['architect', 'test'], {
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
		});
}

function removeE2eFolder(): Rule {
	return (tree: Tree, _context: SchematicContext) => deleteFile(tree, 'e2e');
}

function removeE2eFromAngularJson() {
	return (tree: Tree, _context: SchematicContext) => {
		tree = removeAngularConfig(tree, ['architect', 'e2e']);

		const path = ['architect', 'lint', 'options', 'tsConfig'];
		const tcConfig = (getAngularConfig(tree, path) || []).filter((config: string) => config.indexOf('e2e') === -1);
		return setAngularConfig(tree, path, tcConfig);
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
