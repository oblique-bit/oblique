import {Tree} from '@angular-devkit/schematics';
import {SchematicTestRunner, UnitTestTree} from '@angular-devkit/schematics/testing';
import {join} from 'node:path';
import {obMockLogger} from '../../logger/mock';
import {runRule} from '../test-utils';
import {i18n} from './index';
import * as addI18nModule from './rules/add-i18n';

describe('i18n', () => {
	let inputTree: UnitTestTree;
	let runner: SchematicTestRunner;
	let logger: ReturnType<typeof obMockLogger>['logger'];
	let loggerGroups: ReturnType<typeof obMockLogger>['loggerGroups'];
	let clearGroups: ReturnType<typeof obMockLogger>['clearGroups'];

	beforeEach(() => {
		runner = new SchematicTestRunner('schematics', join(__dirname, '../collection.json'));
		({logger, loggerGroups, clearGroups} = obMockLogger());
		vi.spyOn(addI18nModule, 'default');
		inputTree = new UnitTestTree(Tree.empty());
		inputTree.create('package.json', JSON.stringify({}));
	});

	afterEach(() => {
		vi.clearAllMocks();
		clearGroups();
	});

	test('logs adding i18n support for locales', async () => {
		const options = {locales: ['de-CH', 'fr-CH'], silent: false};
		await runRule(runner, i18n(options), {tree: inputTree, path: __dirname});

		expect(logger.group).toHaveBeenCalledWith(expect.stringContaining('de-CH'));
		expect(logger.group).toHaveBeenCalledWith(expect.stringContaining('fr-CH'));
	});

	test('adds i18n support to the project', async () => {
		const options = {locales: ['de-CH', 'fr-CH'], silent: false};

		await runRule(runner, i18n(options), {tree: inputTree, path: __dirname});

		expect(addI18nModule.default).toHaveBeenCalledWith(expect.anything(), options.locales);
	});

	test('closes logger at the end', async () => {
		const options = {locales: ['de-CH'], silent: false};
		await runRule(runner, i18n(options), {tree: inputTree, path: __dirname});

		expect(loggerGroups[0].end).toHaveBeenCalled();
	});
});
