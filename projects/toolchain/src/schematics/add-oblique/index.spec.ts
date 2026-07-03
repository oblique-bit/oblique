import {HostTree} from '@angular-devkit/schematics';
import {SchematicTestRunner} from '@angular-devkit/schematics/testing';
import {join} from 'node:path';
import {obMockLogger} from '../../logger/mock';
import {addFavicon} from './rules/add-favicon';
import * as addFaviconRules from './rules/add-favicon';

describe('addOblique schematics', () => {
	const testRunner = new SchematicTestRunner('schematics', join(__dirname, '../collection.json'));
	const {logger, loggerGroups} = obMockLogger();

	test('orchestration', async () => {
		const inputTree = new HostTree();
		jest.spyOn(addFaviconRules, 'addFavicon');

		await testRunner.runSchematic('add-oblique', {}, inputTree);

		expect(logger.group).toHaveBeenCalledWith('Generate @oblique/toolchain:add-oblique');
		expect(addFavicon).toHaveBeenCalledTimes(1);
		expect(loggerGroups[0].end).toHaveBeenCalled();
	});
});
