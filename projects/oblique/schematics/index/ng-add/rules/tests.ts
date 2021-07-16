import {chain, Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {removePackageJsonDependency} from '@schematics/angular/utility/dependencies';
import {addDevDependency, getTemplate, removeDevDependencies, removeScript} from '../ng-add-utils';
import {addFile, deleteFile, getJson, infoMigration, readFile, removeAngularProjectsConfig, setAngularProjectsConfig} from '../../utils';

export function addJest(jest: boolean): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (!jest) {
			return tree;
		}

		infoMigration(_context, 'Toolchain: Replacing karma/jasmine with jest');
		return chain([removeJasmine(), addJestDependencies(), createJestConfigFiles(), referToJest(), adaptTsConfig(), adaptTsConfigSpec()])(tree, _context);
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
		const tsConfigSpec = 'tsconfig.spec.json';
		const tpl = getTemplate(tree, 'default-tsconfig.spec.json');
		if (tree.exists(tsConfigSpec)) {
			tree.overwrite(tsConfigSpec, tpl);
		} else {
			tree.create(tsConfigSpec, tpl);
		}

		deleteFile(tree, 'src/test.ts');
		deleteFile(tree, 'karma.conf.js');

		return tree;
	};
}

function addJestDependencies() {
	return (tree: Tree, _context: SchematicContext) => {
		['jest', '@types/jest', 'jest-sonar-reporter', '@angular-builders/jest'].forEach(dependency => addDevDependency(tree, dependency));

		return removeDevDependencies(tree, 'karma');
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
		setAngularProjectsConfig(tree, ['architect', 'test'], {
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
		removeAngularProjectsConfig(tree, ['architect', 'e2e']);

		return setAngularProjectsConfig(tree, ['architect', 'lint', 'options', 'tsConfig'], (config: any) =>
			(config || []).filter((conf: string) => conf.indexOf('e2e') === -1)
		);
	};
}

function removeE2eFromPackage(jest: boolean) {
	return (tree: Tree, _context: SchematicContext) => {
		removePackageJsonDependency(tree, 'protractor');
		if (jest) {
			removeDevDependencies(tree, 'jasmine');
		}

		return removeScript(tree, 'e2e');
	};
}

function adaptTsConfig() {
	return (tree: Tree, _context: SchematicContext) => {
		const tsConfigName = tree.exists('tsconfig.base.json') ? 'tsconfig.base.json' : 'tsconfig.json';
		let tsConfig = readFile(tree, tsConfigName);
		if (tsConfig.indexOf('emitDecoratorMetadata') > -1) {
			tsConfig = tsConfig.replace(/"emitDecoratorMetadata"\s*:\s*false/, '"emitDecoratorMetadata": true');
		} else {
			tsConfig = tsConfig.replace(/"experimentalDecorators"\s*:\s*true,/, '"experimentalDecorators": true,\n    "emitDecoratorMetadata": true,');
		}
		tree.overwrite(tsConfigName, tsConfig);
	};
}

function adaptTsConfigSpec() {
	return (tree: Tree, _context: SchematicContext) => {
		const tsConfigName = 'tsconfig.spec.json';
		if (tree.exists(tsConfigName)) {
			const tsConfig = readFile(tree, tsConfigName).replace(/("types"\s*:\s*\[\s*)"jasmine"(\s*])/, '$1"node", "jest"$2');
			tree.overwrite(tsConfigName, tsConfig);
		}
	};
}
