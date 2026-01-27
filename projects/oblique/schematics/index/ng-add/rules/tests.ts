import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {addDevDependency, getTemplate, removeDevDependencies} from '../ng-add-utils';
import {addFile, infoMigration, setAngularProjectsConfig} from '../../utils';

export function addJest(jest: boolean): Rule {
	return (tree: Tree, context: SchematicContext) => {
		if (!jest) {
			return tree;
		}

		infoMigration(context, 'Toolchain: Replacing karma/jasmine with jest');
		return chain([updateTsConfigSpec(), addJestDependencies(), createJestConfigFiles(), referToJest()])(tree, context);
	};
}

function updateTsConfigSpec() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, context: SchematicContext): Tree => {
		const tsConfigSpec = 'tsconfig.spec.json';
		const tpl = getTemplate(tree, 'default-tsconfig.spec.json');
		if (tree.exists(tsConfigSpec)) {
			tree.overwrite(tsConfigSpec, tpl);
		} else {
			tree.create(tsConfigSpec, tpl);
		}

		return tree;
	};
}

function addJestDependencies() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, context: SchematicContext): Tree => {
		removeDevDependencies(tree, 'vitest');
		removeDevDependencies(tree, 'jsdom');
		['jest', '@types/jest', '@angular-builders/jest', 'jest-environment-jsdom'].forEach(dependency =>
			addDevDependency(tree, dependency)
		);
		return tree;
	};
}

function createJestConfigFiles() {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, context: SchematicContext): Tree => {
		addFile(tree, 'tests/jest.config.js', getTemplate(tree, 'default-jest.config'));
		addFile(
			tree,
			'tests/setupJest.ts',
			"import './jestGlobalMocks'; // browser mocks globally available for every test"
		);
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
				config: 'tests/jest.config.js',
				tsConfig: 'tsconfig.spec.json',
				'max-workers': ['2'],
			},
		});
}
