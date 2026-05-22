import {HostTree} from '@angular-devkit/schematics';
import {SchematicTestRunner, UnitTestTree} from '@angular-devkit/schematics/testing';
import {join} from 'node:path';
import {obMockLogger} from '../../logger/mock';
import {removeExistingLinting} from './rules/remove-existing-linting';
import {adaptLintingConfiguration} from './rules/adapt-linting-configuration';
import {installAngularEslint} from './rules/install-angular-eslint';
import * as deleteLintConfigurationRule from './rules/remove-existing-linting';
import * as adaptLintingConfigurationRule from './rules/adapt-linting-configuration';
import * as installAngularEaLintRule from './rules/install-angular-eslint';

const testRunner = new SchematicTestRunner('schematics', join(__dirname, '../collection.json'));
const {logger, loggerGroups, clearGroups} = obMockLogger();

describe('linting schematic', () => {
	beforeEach(async () => {
		const inputTree = new UnitTestTree(new HostTree());
		inputTree.create('package.json', JSON.stringify({devDependencies: {}}));
		inputTree.create('angular.json', JSON.stringify({}));
		inputTree.create('tsconfig.json', JSON.stringify({}));
		jest.spyOn(deleteLintConfigurationRule, 'removeExistingLinting');
		jest.spyOn(adaptLintingConfigurationRule, 'adaptLintingConfiguration');
		jest.spyOn(installAngularEaLintRule, 'installAngularEslint');

		await testRunner.runSchematic('linting', {}, inputTree);
	});

	afterEach(() => {
		jest.clearAllMocks();
		clearGroups();
	});

	test('calls deleteLintConfiguration', () => {
		expect(removeExistingLinting).toHaveBeenCalledWith(loggerGroups[0]);
	});

	test('calls installAngularEslint', () => {
		expect(installAngularEslint).toHaveBeenCalledWith(loggerGroups[0]);
	});

	test('calls adaptLintingConfiguration', () => {
		expect(adaptLintingConfiguration).toHaveBeenCalledWith(loggerGroups[0], 'app');
	});

	test('creates a logger', () => {
		expect(logger.group).toHaveBeenCalledWith('Add linting solution');
	});

	test('closes the logger group', () => {
		expect(loggerGroups[0].end).toHaveBeenCalled();
	});
});
