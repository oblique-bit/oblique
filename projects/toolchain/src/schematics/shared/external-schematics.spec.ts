import {HostTree, externalSchematic} from '@angular-devkit/schematics';
import {SchematicTestRunner, UnitTestTree} from '@angular-devkit/schematics/testing';
import {join} from 'node:path';
import {firstValueFrom} from 'rxjs';
import {obMockLogger} from '../../logger/mock';
import {callExternalSchematics} from './external-schematics';

jest.mock('@angular-devkit/schematics', () => {
	const actual: typeof import('@angular-devkit/schematics') = jest.requireActual('@angular-devkit/schematics');
	return {
		...actual,
		externalSchematic: jest.fn(() => () => {}),
	};
});

const runner = new SchematicTestRunner('schematics', join(__dirname, '../collection.json'));

const {logger, loggerGroups, clearGroups} = obMockLogger();
describe(callExternalSchematics.name, () => {
	beforeEach(async () => {
		const inputTree = new UnitTestTree(new HostTree());
		inputTree.create('/package.json', JSON.stringify({devDependencies: {}}));
		inputTree.create('/angular.json', JSON.stringify({}));

		await firstValueFrom(
			runner.callRule(callExternalSchematics(logger.group('A'), 'collection', 'schematics'), inputTree)
		);
	});

	afterEach(() => {
		jest.clearAllMocks();
		clearGroups();
	});

	test('calls externalSchematic', () => {
		expect(externalSchematic).toHaveBeenCalledWith('collection', 'schematics', {});
	});

	test('log a step', () => {
		expect(loggerGroups[0].step).toHaveBeenCalledWith('Call "schematics" on "collection"');
	});
});
