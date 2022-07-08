import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {removePackageJsonDependency} from '@schematics/angular/utility/dependencies';
import {addDevDependency, getTemplate, removeDevDependencies, removeScript} from '../ng-add-utils';
import {addFile, deleteFile, infoMigration, readFile, removeAngularProjectsConfig, setAngularProjectsConfig} from '../../utils';

export function addJest(jest: boolean): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (!jest) {
			return tree;
		}

		infoMigration(_context, 'Toolchain: Replacing karma/jasmine with jest');
		return chain([removeJasmine(), addJestDependencies(), createJestConfigFiles(), referToJest(), adaptTsConfig(), adaptTsConfigSpec()])(
			tree,
			_context
		);
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
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, _context: SchematicContext): Tree => {
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
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, _context: SchematicContext): Tree => {
		['jest', '@types/jest', 'jest-sonar-reporter', '@angular-builders/jest'].forEach(dependency => addDevDependency(tree, dependency));

		return removeDevDependencies(tree, 'karma');
	};
}

function createJestConfigFiles() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, _context: SchematicContext): Tree => {
		addFile(tree, 'tests/jest.config.js', getTemplate(tree, 'default-jest.config'));
		addFile(
			tree,
			'tests/setupJest.ts',
			"import 'jest-preset-angular';\nimport './jestGlobalMocks'; // browser mocks globally available for every test"
		);
		addFile(tree, 'tests/jestGlobalMocks.ts', getTemplate(tree, 'default-jestGlobalMocks.config'));

		return tree;
	};
}

function referToJest() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, _context: SchematicContext): Tree =>
		setAngularProjectsConfig(tree, ['architect', 'test'], {
			builder: '@angular-builders/jest:run',
			options: {
				configPath: 'tests/jest.config.js',
				tsConfig: 'tsconfig.spec.json'
			}
		});
}

function removeE2eFolder(): Rule {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, _context: SchematicContext): Tree => deleteFile(tree, 'e2e');
}

function removeE2eFromAngularJson() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, _context: SchematicContext): Tree => {
		removeAngularProjectsConfig(tree, ['architect', 'e2e']);

		return setAngularProjectsConfig(tree, ['architect', 'lint', 'options', 'tsConfig'], (config: any) =>
			(config || []).filter((conf: string) => !conf.includes('e2e'))
		);
	};
}

function removeE2eFromPackage(jest: boolean) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, _context: SchematicContext) => {
		removePackageJsonDependency(tree, 'protractor');
		if (jest) {
			removeDevDependencies(tree, 'jasmine');
		}

		return removeScript(tree, 'e2e');
	};
}

function adaptTsConfig() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, _context: SchematicContext) => {
		const tsConfigName = tree.exists('tsconfig.base.json') ? 'tsconfig.base.json' : 'tsconfig.json';
		let tsConfig = readFile(tree, tsConfigName);
		if (tsConfig.includes('emitDecoratorMetadata')) {
			tsConfig = tsConfig.replace(/"emitDecoratorMetadata"\s*:\s*false/, '"emitDecoratorMetadata": true');
		} else {
			tsConfig = tsConfig.replace(
				/"experimentalDecorators"\s*:\s*true,/,
				'"experimentalDecorators": true,\n    "emitDecoratorMetadata": true,'
			);
		}
		tree.overwrite(tsConfigName, tsConfig);
	};
}

function adaptTsConfigSpec() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, _context: SchematicContext): void => {
		const tsConfigName = 'tsconfig.spec.json';
		if (tree.exists(tsConfigName)) {
			const tsConfig = readFile(tree, tsConfigName).replace(
				/(?<prefix>"types"\s*:\s*\[\s*)"jasmine"(?<suffix>\s*])/,
				'$<prefix>"node", "jest"$<suffix></suffix>'
			);
			tree.overwrite(tsConfigName, tsConfig);
		}
	};
}
