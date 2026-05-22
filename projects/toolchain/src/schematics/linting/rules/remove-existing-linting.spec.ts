import {HostTree, type Tree} from '@angular-devkit/schematics';
import {SchematicTestRunner, UnitTestTree} from '@angular-devkit/schematics/testing';
import {join} from 'node:path';
import {removeExistingLinting} from './remove-existing-linting';
import {firstValueFrom} from 'rxjs';
import {obMockLogger} from '../../../logger/mock';

const runner = new SchematicTestRunner('schematics', join(__dirname, '../../collection.json'));
const {logger} = obMockLogger();

describe(removeExistingLinting.name, () => {
	let inputTree: UnitTestTree;

	beforeEach(() => {
		inputTree = new UnitTestTree(new HostTree());
	});

	test('package.json property removal', async () => {
		inputTree.create('/package.json', '{"eslintConfig": {}, "keep": {}, "scripts": {"lint": ""}}');
		const resultTree = (await firstValueFrom(
			runner.callRule(removeExistingLinting(logger.group('A')), inputTree)
		)) as UnitTestTree;
		expect(resultTree.readContent('./package.json')).toEqual('{"keep": {}, "scripts": {}}');
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
			const result = await firstValueFrom(runner.callRule(removeExistingLinting(logger.group('A')), inputTree));
			resultPkg = result.readJson('package.json') as {devDependencies: Record<string, string>};
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
			resultTree = await firstValueFrom(runner.callRule(removeExistingLinting(logger.group('A')), inputTree));
		});

		test.each(filesToRemove)('removes "%s" config files', file => {
			expect(resultTree.exists(file)).toBe(false);
		});

		test('keeps regular files', () => {
			expect(resultTree.exists('/keep.txt')).toBe(true);
		});
	});
});
