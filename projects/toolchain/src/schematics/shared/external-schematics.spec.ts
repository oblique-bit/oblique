import {HostTree, externalSchematic} from '@angular-devkit/schematics';
import {SchematicTestRunner, UnitTestTree} from '@angular-devkit/schematics/testing';
import {join} from 'node:path';
import {obMockLogger} from '../../logger/mock';
import {runRule} from '../test-utils';
import {callExternalSchematics} from './external-schematics';

vi.mock('@angular-devkit/schematics', async importOriginal => {
	const actual: typeof import('@angular-devkit/schematics') = await importOriginal();
	return {
		...actual,
		externalSchematic: vi.fn(() => () => {}),
	};
});

const runner = new SchematicTestRunner('schematics', join(__dirname, '../collection.json'));

const {logger, loggerGroups, clearGroups} = obMockLogger();
describe(callExternalSchematics.name, () => {
	beforeEach(async () => {
		const inputTree = new UnitTestTree(new HostTree());
		inputTree.create('/package.json', JSON.stringify({devDependencies: {}}));
		inputTree.create('/angular.json', JSON.stringify({}));

		await runRule(runner, callExternalSchematics(logger.group('A'), 'collection', 'schematics'), {
			tree: inputTree,
			path: __dirname,
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
		clearGroups();
	});

	test('calls externalSchematic', () => {
		expect(externalSchematic).toHaveBeenCalledWith('collection', 'schematics', {});
	});

	test('log a step', () => {
		expect(loggerGroups[0].step).toHaveBeenCalledWith('Call "schematics" on "collection"');
	});
});
