import {HostTree} from '@angular-devkit/schematics';
import {SchematicTestRunner} from '@angular-devkit/schematics/testing';
import {join} from 'node:path';
import {obMockLogger} from '../../logger/mock';
import {runRule} from '../test-utils';
import {linting} from './index';
import {removeExistingLinting} from './rules/remove-existing-linting';
import {adaptLintingConfiguration} from './rules/adapt-linting-configuration';
import {installAngularEslint} from './rules/install-angular-eslint';
import {useUnknownInCatchVariables} from './rules/use-unknown-in-catch-variables';
import * as deleteLintConfigurationRule from './rules/remove-existing-linting';
import * as adaptLintingConfigurationRule from './rules/adapt-linting-configuration';
import * as installAngularEaLintRule from './rules/install-angular-eslint';
import * as useUnknownInCatchVariablesRule from './rules/use-unknown-in-catch-variables';

const testRunner = new SchematicTestRunner('schematics', join(__dirname, '../collection.json'));
const {logger, loggerGroups} = obMockLogger();

describe('linting schematic', () => {
	test('orchestration', async () => {
		const inputTree = new HostTree();
		inputTree.create('package.json', JSON.stringify({devDependencies: {}}));
		inputTree.create('angular.json', JSON.stringify({}));
		inputTree.create('tsconfig.json', JSON.stringify({}));
		vi.spyOn(deleteLintConfigurationRule, 'removeExistingLinting');
		vi.spyOn(adaptLintingConfigurationRule, 'adaptLintingConfiguration');
		vi.spyOn(installAngularEaLintRule, 'installAngularEslint');
		vi.spyOn(useUnknownInCatchVariablesRule, 'useUnknownInCatchVariables');

		await runRule(testRunner, linting({silent: false, prefix: 'app'}), {tree: inputTree, path: __dirname});

		expect(logger.group).toHaveBeenCalledWith('Add linting solution');
		expect(removeExistingLinting).toHaveBeenCalledWith(loggerGroups[0]);
		expect(installAngularEslint).toHaveBeenCalledWith(loggerGroups[0]);
		expect(adaptLintingConfiguration).toHaveBeenCalledWith(loggerGroups[0], 'app');
		expect(useUnknownInCatchVariables).toHaveBeenCalledWith(loggerGroups[0]);
		expect(loggerGroups[0].end).toHaveBeenCalled();
	});
});
