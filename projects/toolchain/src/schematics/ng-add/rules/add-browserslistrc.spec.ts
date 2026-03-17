import {HostTree} from '@angular-devkit/schematics';
import {SchematicTestRunner, UnitTestTree} from '@angular-devkit/schematics/testing';
import {join} from 'node:path';
import * as fs from 'fs';
import {runRule} from '../../test-utils';
import {addBrowserslistrc} from './add-browserslistrc.rule';
import {obCreateLogger} from '../../../logger';

describe('addBrowserslistrc', () => {
	const templateContent = fs.readFileSync(join(__dirname, '../templates/.browserslistrc'), 'utf8');
	const runner = new SchematicTestRunner('schematics', join(__dirname, '../../collection.json'));
	const logger = obCreateLogger(true).group('logger');
	let inputTree: UnitTestTree;

	beforeEach(() => {
		inputTree = new UnitTestTree(new HostTree());
		inputTree.create('/package.json', JSON.stringify({devDependencies: {}}));
		jest.spyOn(logger, 'step');
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe(`.browserslistrc is absent`, () => {
		test(`creates .browserslistrc`, async () => {
			const resultTree: UnitTestTree = await runRule(runner, addBrowserslistrc(logger), inputTree);

			expect(resultTree.exists('.browserslistrc')).toBe(true);
		});

		test(`creates .browserslistrc with template content`, async () => {
			const resultTree = await runRule(runner, addBrowserslistrc(logger), inputTree);

			expect(resultTree.readContent('.browserslistrc')).toBe(templateContent);
		});

		test('call logger.step', async () => {
			await runRule(runner, addBrowserslistrc(logger), inputTree);

			expect(logger.step).toHaveBeenCalledWith('Create ".browserslistrc" file');
		});
	});

	describe(`.browserslistrc is present`, () => {
		beforeEach(() => {
			inputTree.create('.browserslistrc', 'existing content');
		});

		test(`does not overwrite existing .browserslistrc`, async () => {
			const resultTree = await runRule(runner, addBrowserslistrc(logger), inputTree);

			expect(resultTree.readContent('.browserslistrc')).toBe('existing content');
		});

		test(`leaves existing .browserslistrc untouched`, async () => {
			const resultTree = await runRule(runner, addBrowserslistrc(logger), inputTree);

			expect(resultTree.readContent('.browserslistrc')).not.toBe(templateContent);
		});

		test("don't call logger.step", async () => {
			await runRule(runner, addBrowserslistrc(logger), inputTree);

			expect(logger.step).not.toHaveBeenCalled();
		});
	});
});
