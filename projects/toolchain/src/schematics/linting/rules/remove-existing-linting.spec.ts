import {HostTree, type Tree} from '@angular-devkit/schematics';
import {SchematicTestRunner} from '@angular-devkit/schematics/testing';
import {join} from 'node:path';
import {runRule} from '../../test-utils';
import {removeExistingLinting} from './remove-existing-linting';
import {obMockLogger} from '../../../logger/mock';

describe(removeExistingLinting.name, () => {
	const runner = new SchematicTestRunner('schematics', join(__dirname, '../../collection.json'));
	const {logger} = obMockLogger();
	let inputTree: Tree;

	beforeEach(() => {
		inputTree = new HostTree();
	});

	test('package.json property removal', async () => {
		inputTree.create('/package.json', '{"eslintConfig": {}, "keep": {}, "scripts": {"lint": ""}}');

		const resultTree = await runRule(runner, removeExistingLinting(logger.group('A')), {tree: inputTree});

		expect(resultTree.readText('./package.json')).toEqual('{"keep": {}, "scripts": {}}');
	});

	describe('dependencies removal', () => {
		const devDependencies = [
			'@angular-eslint/builder',
			'@angular-eslint/eslint-plugin',
			'@angular-eslint/eslint-plugin-template',
			'@angular-eslint/schematics',
			'@angular-eslint/template-parser',
			'@angular-eslint/utils',
			'@typescript-eslint/eslint-plugin',
			'@typescript-eslint/parser',
			'angular-eslint',
			'eslint',
			'eslint-config-prettier',
			'eslint-plugin-prettier',
		];
		let resultPkg: {devDependencies: Record<string, string>};

		beforeEach(async () => {
			const pkg = {
				devDependencies: {
					...devDependencies.reduce((tot, curr) => ({...tot, [curr]: '20.0.0'}), {}),
					'keep-me': '20.0.0',
				},
			};
			inputTree.create('/package.json', JSON.stringify(pkg));
			const resultTree = await runRule(runner, removeExistingLinting(logger.group('A')), {tree: inputTree});
			resultPkg = resultTree.readJson('package.json') as {devDependencies: Record<string, string>};
		});

		test.each(devDependencies)('removes "%s" dependency', dep => {
			expect(resultPkg.devDependencies[dep]).toBeUndefined();
		});

		test('keep "%s" dependency', () => {
			expect(resultPkg.devDependencies['keep-me']).toBeDefined();
		});
	});

	describe('configuration files removal', () => {
		const filesToRemove = [
			'/.eslintrc.js',
			'/.eslintrc.cjs',
			'/.eslintrc.json',
			'/.eslintrc',
			'/.eslintrc.yml',
			'/.eslintrc.yaml',
			'/eslint.config.js',
		];
		let resultTree: Tree;

		beforeEach(async () => {
			filesToRemove.forEach(path => {
				inputTree.create(path, '{}');
			});
			inputTree.create('/keep.txt', 'keep');
			inputTree.create('/package.json', '{}');
			resultTree = await runRule(runner, removeExistingLinting(logger.group('A')), {tree: inputTree});
		});

		test.each(filesToRemove)('removes "%s" config files', file => {
			expect(resultTree.exists(file)).toBe(false);
		});

		test('keeps regular files', () => {
			expect(resultTree.exists('/keep.txt')).toBe(true);
		});
	});
});
