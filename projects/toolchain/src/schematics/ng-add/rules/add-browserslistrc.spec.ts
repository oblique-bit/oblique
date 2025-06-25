import {mockFs, runRule} from '../../test-utils';
mockFs('readFileSync'); // mockFs must come before imports because Jest caches all module dependencies on first import. If fs is already loaded, the mock won’t take effect.

import {HostTree} from '@angular-devkit/schematics';
import {SchematicTestRunner, UnitTestTree} from '@angular-devkit/schematics/testing';
import {join} from 'node:path';
import * as fs from 'fs';
import {addBrowserslistrc} from './add-browserslistrc.rule';

describe('addBrowserslistrc', () => {
	const templateContent = '# Browsers\n> 0.5%\nlast 2 versions\nnot dead\n';
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
		beforeEach(() => {
			jest.spyOn(fs, 'readFileSync').mockReturnValue(templateContent);
		});

		test(`creates .browserslistrc`, async () => {
			const resultTree: UnitTestTree = await runRule(runner, addBrowserslistrc, inputTree);

			expect(resultTree.exists('.browserslistrc')).toBe(true);
		});

		test(`creates .browserslistrc with template content`, async () => {
			jest.spyOn(fs, 'readFileSync').mockReturnValue(templateContent);

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

		test(`does not call fs.readFileSync if .browserslistrc already exists`, async () => {
			await runRule(runner, addBrowserslistrc, inputTree);
			expect(fs.readFileSync).not.toHaveBeenCalled();
		});
	});
});
