import {SchematicTestRunner, UnitTestTree} from '@angular-devkit/schematics/testing';
import {Tree} from '@angular-devkit/schematics';
import {join} from 'node:path';
import addNpmrc from './add-npmrc';
import fs from 'fs';
import {obMockLogger} from '../../../logger/mock';
import {firstValueFrom} from 'rxjs';
import {mockCreateFromTemplate} from '../../test-utils';

const runner = new SchematicTestRunner('schematics', join(__dirname, '../../collection.json'));
const {logger} = obMockLogger();

describe('addNpmrc', () => {
	let inputTree: UnitTestTree;

	beforeEach(() => {
		inputTree = new UnitTestTree(Tree.empty());
		mockCreateFromTemplate('ng-add');
	});

	test('does not create .npmrc when shouldAdd is falsy', async () => {
		const resultTree = (await firstValueFrom(
			runner.callRule(addNpmrc(logger.group('A'), undefined), inputTree)
		)) as UnitTestTree;
		expect(resultTree.exists('.npmrc')).toBeFalsy();
	});

	describe('when .npmrc does not exist', () => {
		test('does not create .npmrc when shouldAdd is false', async () => {
			const resultTree = (await firstValueFrom(
				runner.callRule(addNpmrc(logger.group('A'), false), inputTree)
			)) as UnitTestTree;
			expect(resultTree.exists('.npmrc')).toBeFalsy();
		});

		test('creates a new .npmrc file', async () => {
			const templateContent = fs.readFileSync(join(__dirname, '../templates/add-npmrc/npmrc'), 'utf8');
			const resultTree = (await firstValueFrom(
				runner.callRule(addNpmrc(logger.group('A'), true), inputTree)
			)) as UnitTestTree;
			expect(resultTree.readContent('./.npmrc')).toEqual(templateContent);
		});

		test('logs only as soon as rule executes', async () => {
			const groupLogger = logger.group('A');
			const rule = addNpmrc(groupLogger, true);
			expect(groupLogger.step).not.toHaveBeenCalled();

			await firstValueFrom(runner.callRule(rule, inputTree));
			expect(groupLogger.step).toHaveBeenCalledWith('Create .npmrc file at project root');
		});

		test('is idempotent - multiple executions produce same result', async () => {
			const groupLogger = logger.group('A');
			const rule = addNpmrc(groupLogger, true);
			const templateContent = fs.readFileSync(join(__dirname, '../templates/add-npmrc/npmrc'), 'utf8');

			let resultTree = (await firstValueFrom(runner.callRule(rule, inputTree))) as UnitTestTree;
			expect(resultTree.readContent('.npmrc')).toEqual(templateContent);

			resultTree = (await firstValueFrom(runner.callRule(rule, resultTree))) as UnitTestTree;
			expect(resultTree.readContent('.npmrc')).toEqual(templateContent);
		});
	});

	describe('when .npmrc already exists', () => {
		beforeEach(() => {
			inputTree.create('.npmrc', 'existing content');
		});

		test('keeps existing .npmrc as it was', async () => {
			const testContent = 'existing content';
			const resultTree = (await firstValueFrom(
				runner.callRule(addNpmrc(logger.group('A'), true), inputTree)
			)) as UnitTestTree;
			expect(resultTree.readContent('./.npmrc')).toEqual(testContent);
		});

		test('does not call logger when file exists', async () => {
			const groupLogger = logger.group('A');
			await firstValueFrom(runner.callRule(addNpmrc(groupLogger, true), inputTree));
			expect(groupLogger.step).not.toHaveBeenCalled();
		});
	});
});
