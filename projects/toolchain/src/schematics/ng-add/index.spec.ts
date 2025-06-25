import {HostTree, type Rule} from '@angular-devkit/schematics';
import {SchematicTestRunner, UnitTestTree} from '@angular-devkit/schematics/testing';
import {join} from 'node:path';
import * as addToolchainDependencyRules from './rules/add-toolchain-dependency.rule';
import * as addBrowserslistrcRules from './rules/add-browserslistrc.rule';
import {toolchain} from './index';
import {addBrowserslistrc} from './rules/add-browserslistrc.rule';
import {addToolchain} from './rules/add-toolchain-dependency.rule';

const testRunner = new SchematicTestRunner('schematics', join(__dirname, '../collection.json'));

async function executeRule(runner: SchematicTestRunner, rule: Rule, initialTree: UnitTestTree): Promise<UnitTestTree> {
	return new Promise((resolve, reject) => {
		runner.callRule(rule, initialTree).subscribe({
			next: resultingTree => resolve(resultingTree as UnitTestTree),
			error: reject
		});
	});
}

describe('ngAdd', () => {
	beforeEach(async () => {
		const inputTree = new UnitTestTree(new HostTree());
		inputTree.create('/package.json', JSON.stringify({devDependencies: {}}));
		jest.spyOn(addToolchainDependencyRules, 'addToolchain');
		jest.spyOn(addBrowserslistrcRules, 'addBrowserslistrc');

		await executeRule(testRunner, toolchain(), inputTree);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	test('calls addToolchain', () => {
		expect(addToolchain).toHaveBeenCalledTimes(1);
	});

	test('calls addBrowserslistrc', () => {
		expect(addBrowserslistrc).toHaveBeenCalledTimes(1);
	});
});
