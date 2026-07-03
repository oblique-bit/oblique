import {HostTree} from '@angular-devkit/schematics';
import {SchematicTestRunner} from '@angular-devkit/schematics/testing';
import {join} from 'node:path';
import {obMockLogger} from '../../logger/mock';
import {addBrowserslistrc} from './rules/add-browserslistrc';
import * as addBrowserslistrcRules from './rules/add-browserslistrc';

describe('ngAdd schematics', () => {
	const testRunner = new SchematicTestRunner('schematics', join(__dirname, '../collection.json'));
	const {logger, loggerGroups} = obMockLogger();

	test('orchestration', async () => {
		const inputTree = new HostTree();
		inputTree.create('/package.json', JSON.stringify({devDependencies: {}}));
		jest.spyOn(addBrowserslistrcRules, 'addBrowserslistrc');

		await testRunner.runSchematic('ng-add', {}, inputTree);

		expect(logger.group).toHaveBeenCalledWith('Add @oblique/toolchain');
		expect(addBrowserslistrc).toHaveBeenCalledTimes(1);
		expect(loggerGroups[0].end).toHaveBeenCalled();
	});
});
