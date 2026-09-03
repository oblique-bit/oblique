import {HostTree, type Tree} from '@angular-devkit/schematics';
import {SchematicTestRunner} from '@angular-devkit/schematics/testing';
import {join} from 'node:path';
import {obMockLogger} from '../../../logger/mock';
import {readFileWithSystemEol, runRule} from '../../test-utils';
import {addBrowserslistrc} from './add-browserslistrc';

describe(addBrowserslistrc.name, () => {
	const templatesDir = join(__dirname, '../templates');
	const templateContent = readFileWithSystemEol(templatesDir, 'add-browserslistrc/.browserslistrc');
	const runner = new SchematicTestRunner('schematics', join(__dirname, '../../collection.json'));
	const {logger, loggerGroups} = obMockLogger();
	let inputTree: Tree;

	beforeEach(() => {
		inputTree = new HostTree();
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	test('without .browserslistrc', async () => {
		const resultTree = await runRule(runner, addBrowserslistrc(logger.group('A')), {
			tree: inputTree,
			path: join(__dirname, '..'),
		});

		expect(resultTree.readText('.browserslistrc')).toBe(templateContent);
		expect(loggerGroups[0].step).toHaveBeenCalledWith('Create ".browserslistrc" file');
	});

	test('with .browserslistrc', async () => {
		inputTree.create('.browserslistrc', 'existing content');

		const resultTree = await runRule(runner, addBrowserslistrc(logger.group('A')), {
			tree: inputTree,
			path: join(__dirname, '..'),
		});

		expect(resultTree.readText('.browserslistrc')).toBe('existing content');
		expect(loggerGroups[0].step).not.toHaveBeenCalled();
	});
});
