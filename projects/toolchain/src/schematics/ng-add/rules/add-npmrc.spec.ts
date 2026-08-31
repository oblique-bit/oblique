import {SchematicTestRunner, UnitTestTree} from '@angular-devkit/schematics/testing';
import {Tree} from '@angular-devkit/schematics';
import {join} from 'node:path';
import addNpmrc from './add-npmrc';
import fs from 'fs';
import {obMockLogger} from '../../../logger/mock';
import {runRule} from '../../test-utils';

const runner = new SchematicTestRunner('schematics', join(__dirname, '../../collection.json'));
const {logger} = obMockLogger();

describe('addNpmrc', () => {
	let inputTree: UnitTestTree;

	beforeEach(() => {
		inputTree = new UnitTestTree(Tree.empty());
	});

	test('does not create .npmrc when shouldAdd is falsy', async () => {
		const resultTree = await runRule(runner, addNpmrc(logger.group('A'), undefined), {
			tree: inputTree,
			path: join(__dirname, '..'),
		});
		expect(resultTree.exists('.npmrc')).toBeFalsy();
	});

	describe('when .npmrc does not exist', () => {
		test('does not create .npmrc when shouldAdd is false', async () => {
			const resultTree = await runRule(runner, addNpmrc(logger.group('A'), false), {
				tree: inputTree,
				path: join(__dirname, '..'),
			});
			expect(resultTree.exists('.npmrc')).toBeFalsy();
		});

		test('creates a new .npmrc file', async () => {
			const templateContent = fs.readFileSync(join(__dirname, '../templates/add-npmrc/npmrc'), 'utf8');
			const resultTree = await runRule(runner, addNpmrc(logger.group('A'), true), {
				tree: inputTree,
				path: join(__dirname, '..'),
			});
			expect(resultTree.readContent('./.npmrc')).toEqual(templateContent);
		});

		test('logs only as soon as rule executes', async () => {
			const groupLogger = logger.group('A');
			const rule = addNpmrc(groupLogger, true);
			expect(groupLogger.step).not.toHaveBeenCalled();

			await runRule(runner, rule, {tree: inputTree, path: join(__dirname, '..')});
			expect(groupLogger.step).toHaveBeenCalledWith('Create .npmrc file at project root');
		});

		test('is idempotent - multiple executions produce same result', async () => {
			const groupLogger = logger.group('A');
			const rule = addNpmrc(groupLogger, true);
			const templateContent = fs.readFileSync(join(__dirname, '../templates/add-npmrc/npmrc'), 'utf8');

			let resultTree = await runRule(runner, rule, {tree: inputTree, path: join(__dirname, '..')});
			expect(resultTree.readContent('.npmrc')).toEqual(templateContent);

			resultTree = await runRule(runner, rule, {tree: resultTree, path: join(__dirname, '..')});
			expect(resultTree.readContent('.npmrc')).toEqual(templateContent);
		});
	});

	describe('when .npmrc already exists', () => {
		beforeEach(() => {
			inputTree.create('.npmrc', 'existing content');
		});

		test('keeps existing .npmrc as it was', async () => {
			const testContent = 'existing content';
			const resultTree = await runRule(runner, addNpmrc(logger.group('A'), true), {
				tree: inputTree,
				path: join(__dirname, '..'),
			});
			expect(resultTree.readContent('./.npmrc')).toEqual(testContent);
		});

		test('does not call logger when file exists', async () => {
			const groupLogger = logger.group('A');
			await runRule(runner, addNpmrc(groupLogger, true), {tree: inputTree, path: join(__dirname, '..')});
			expect(groupLogger.step).not.toHaveBeenCalled();
		});
	});
});
