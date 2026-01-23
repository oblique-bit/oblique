import {HostTree} from '@angular-devkit/schematics';
import {SchematicTestRunner, UnitTestTree} from '@angular-devkit/schematics/testing';
import {join} from 'node:path';
import * as fs from 'fs';
import {runRule} from '../../test-utils';
import {addBrowserslistrc} from './add-browserslistrc.rule';

describe('addBrowserslistrc', () => {
	const templateContent = fs.readFileSync(join(__dirname, '../templates/.browserslistrc'), 'utf8');
	const runner = new SchematicTestRunner('schematics', join(__dirname, '../../collection.json'));
	let inputTree: UnitTestTree;

	beforeEach(() => {
		inputTree = new UnitTestTree(new HostTree());
		inputTree.create('/package.json', JSON.stringify({devDependencies: {}}));
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe(`.browserslistrc is absent`, () => {
		test(`creates .browserslistrc`, async () => {
			const resultTree: UnitTestTree = await runRule(runner, addBrowserslistrc, inputTree);

			expect(resultTree.exists('.browserslistrc')).toBe(true);
		});

		test(`creates .browserslistrc with template content`, async () => {
			const resultTree = await runRule(runner, addBrowserslistrc, inputTree);

			expect(resultTree.readContent('.browserslistrc')).toBe(templateContent);
		});
	});

	describe(`.browserslistrc is present`, () => {
		beforeEach(() => {
			inputTree.create('.browserslistrc', 'existing content');
		});

		test(`does not overwrite existing .browserslistrc`, async () => {
			const resultTree = await runRule(runner, addBrowserslistrc, inputTree);

			expect(resultTree.readContent('.browserslistrc')).toBe('existing content');
		});

		test(`leaves existing .browserslistrc untouched`, async () => {
			const resultTree = await runRule(runner, addBrowserslistrc, inputTree);

			expect(resultTree.readContent('.browserslistrc')).not.toBe(templateContent);
		});
	});
});
