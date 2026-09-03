import {HostTree, type Tree} from '@angular-devkit/schematics';
import {SchematicTestRunner} from '@angular-devkit/schematics/testing';
import {join} from 'node:path';
import {obMockLogger} from '../../../logger/mock';
import {runRule} from '../../test-utils';
import {callExternalSchematics} from '../../shared/external-schematics';
import * as externalSchematicsRule from '../../shared/external-schematics';
import {installAngularEslint} from './install-angular-eslint';

describe(installAngularEslint.name, () => {
	const runner = new SchematicTestRunner('schematics', join(__dirname, '../../collection.json'));
	const {logger, loggerGroups} = obMockLogger();
	let inputTree: Tree;

	beforeEach(() => {
		inputTree = new HostTree();
		vi.spyOn(externalSchematicsRule, 'callExternalSchematics').mockImplementation(() => {
			inputTree.create('/eslint.config.js', '{}');
			return () => inputTree;
		});
	});

	test('call ng-add on angular-eslint', async () => {
		inputTree.create('/package.json', '{}');
		inputTree.create('/angular.json', '{}');

		await runRule(runner, installAngularEslint(logger.group('A')), {tree: inputTree});

		expect(callExternalSchematics).toHaveBeenCalledWith(loggerGroups[1], 'angular-eslint', 'ng-add');
	});

	test('removes "eslint.config.js" config file if present', async () => {
		inputTree.create('/package.json', '{}');
		inputTree.create('/angular.json', '{}');
		inputTree.create('/keep.txt', 'keep');

		const resultTree = await runRule(runner, installAngularEslint(logger.group('A')), {tree: inputTree});

		expect(resultTree.exists('/eslint.config.js')).toBe(false);
		expect(resultTree.exists('/keep.txt')).toBe(true);
		expect(loggerGroups[1].step).toHaveBeenCalledWith('Remove "eslint.config.js" configuration file');
	});

	test('does not remove "eslint.config.js" config file if not present', async () => {
		loggerGroups[1].step.mockReset();
		inputTree.create('/keep.txt', 'keep');
		inputTree.create('/package.json', '{}');

		const resultTree = await runRule(runner, installAngularEslint(logger.group('A')), {tree: inputTree});

		expect(resultTree.exists('/keep.txt')).toBe(true);
		expect(loggerGroups[1].step).not.toHaveBeenCalledWith('Remove "eslint.config.js" configuration file');
	});
});
