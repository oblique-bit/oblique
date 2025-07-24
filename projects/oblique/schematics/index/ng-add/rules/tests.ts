import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {addDevDependency, getTemplate, removeDevDependencies} from '../ng-add-utils';
import {addFile, deleteFile, infoMigration, readFile, setAngularProjectsConfig} from '../../utils';

export function addJest(jest: boolean): Rule {
	return (tree: Tree, context: SchematicContext) => {
		if (!jest) {
			return tree;
		}

		infoMigration(context, 'Toolchain: Replacing karma/jasmine with jest');
		return chain([removeJasmine(), addJestDependencies(), createJestConfigFiles(), referToJest(), adaptTsConfigSpec()])(tree, context);
	};
}

function removeJasmine() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, context: SchematicContext): Tree => {
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
	return (tree: Tree, context: SchematicContext): Tree => {
		['jest', '@types/jest', 'jest-sonar-reporter', '@angular-builders/jest'].forEach(dependency => addDevDependency(tree, dependency));

		return removeDevDependencies(tree, 'karma');
	};
}

function createJestConfigFiles() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, context: SchematicContext): Tree => {
		addFile(tree, 'tests/jest.config.js', getTemplate(tree, 'default-jest.config'));
		addFile(tree, 'tests/setupJest.ts', "import './jestGlobalMocks'; // browser mocks globally available for every test");
		addFile(tree, 'tests/jestGlobalMocks.ts', getTemplate(tree, 'default-jestGlobalMocks.config'));

		return tree;
	};
}

function referToJest() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, context: SchematicContext): Tree =>
		setAngularProjectsConfig(tree, ['architect', 'test'], {
			builder: '@angular-builders/jest:run',
			options: {
				configPath: 'tests/jest.config.js',
				tsConfig: 'tsconfig.spec.json',
				'max-workers': ['2']
			}
		});
}

function adaptTsConfigSpec() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, context: SchematicContext): void => {
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
