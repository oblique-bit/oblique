import {HostTree, type Rule} from '@angular-devkit/schematics';
import {SchematicTestRunner, UnitTestTree} from '@angular-devkit/schematics/testing';
import {join} from 'node:path';
import {obMockLogger} from '../../logger/mock';
import * as addBrowserslistrcRules from './rules/add-browserslistrc.rule';
import {toolchain} from './index';
import {addBrowserslistrc} from './rules/add-browserslistrc.rule';

const testRunner = new SchematicTestRunner('schematics', join(__dirname, '../collection.json'));
const {logger, loggerGroups, clearGroups} = obMockLogger();

async function executeRule(runner: SchematicTestRunner, rule: Rule, initialTree: UnitTestTree): Promise<UnitTestTree> {
	return new Promise((resolve, reject) => {
		runner.callRule(rule, initialTree).subscribe({
			next: resultingTree => resolve(resultingTree as UnitTestTree),
			error: reject,
		});
	});
}

describe('ngAdd', () => {
	beforeEach(async () => {
		const inputTree = new UnitTestTree(new HostTree());
		inputTree.create('/package.json', JSON.stringify({devDependencies: {}}));
		jest.spyOn(addBrowserslistrcRules, 'addBrowserslistrc');

		await executeRule(testRunner, toolchain(), inputTree);
	});

	afterEach(() => {
		jest.clearAllMocks();
		clearGroups();
	});

	test('calls addBrowserslistrc', () => {
		expect(addBrowserslistrc).toHaveBeenCalledTimes(1);
	});

	test('creates a logger', () => {
		expect(logger.group).toHaveBeenCalledWith('Add @oblique/toolchain');
	});

	test('closes the logger group', () => {
		expect(loggerGroups[0].end).toHaveBeenCalled();
	});
});
