import {HostTree} from '@angular-devkit/schematics';
import {SchematicTestRunner} from '@angular-devkit/schematics/testing';
import {join} from 'node:path';
import {obMockLogger} from '../../logger/mock';
import {runRule} from '../test-utils';
import {toolchain} from './index';
import {addBrowserslistrc} from './rules/add-browserslistrc';
import * as addBrowserslistrcRules from './rules/add-browserslistrc';
import * as addNpmrcModule from './rules/add-npmrc';
import * as addProxyModule from './rules/add-proxy';

describe('ngAdd schematics', () => {
	const testRunner = new SchematicTestRunner('schematics', join(__dirname, '../collection.json'));
	const {logger, loggerGroups, clearGroups} = obMockLogger();

	afterEach(() => {
		vi.clearAllMocks();
		clearGroups();
	});

	test('orchestration', async () => {
		const inputTree = new HostTree();
		inputTree.create('/package.json', JSON.stringify({devDependencies: {}}));
		vi.spyOn(addBrowserslistrcRules, 'addBrowserslistrc');
		vi.spyOn(addNpmrcModule, 'default');
		vi.spyOn(addProxyModule, 'default');

		await runRule(testRunner, toolchain({npmrc: true}), {tree: inputTree, path: __dirname});

		expect(logger.group).toHaveBeenCalledWith('Add @oblique/toolchain');
		expect(addBrowserslistrc).toHaveBeenCalledTimes(1);
		expect(addNpmrcModule.default).toHaveBeenCalledTimes(1);
		expect(addProxyModule.default).toHaveBeenCalledTimes(1);
		expect(loggerGroups[0].end).toHaveBeenCalled();
	});

	test('passes options to optional rules', async () => {
		const inputTree = new HostTree();
		inputTree.create('/package.json', JSON.stringify({devDependencies: {}}));
		vi.spyOn(addNpmrcModule, 'default');
		vi.spyOn(addProxyModule, 'default');

		await runRule(testRunner, toolchain({npmrc: true, proxy: '1234'}), {tree: inputTree, path: __dirname});

		expect(addNpmrcModule.default).toHaveBeenCalledWith(loggerGroups[0], true);
		expect(addProxyModule.default).toHaveBeenCalledWith(loggerGroups[0], '1234');
	});
});
