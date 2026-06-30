import {HostTree, type Tree} from '@angular-devkit/schematics';
import {SchematicTestRunner} from '@angular-devkit/schematics/testing';
import {join} from 'node:path';
import {firstValueFrom} from 'rxjs';
import {obMockLogger} from '../../../logger/mock';
import {mockCreateFromTemplate} from '../../test-utils';
import {adaptLintingConfiguration} from './adapt-linting-configuration';

describe(adaptLintingConfiguration.name, () => {
	const packageJson = 'package.json';
	const runner = new SchematicTestRunner('schematics', join(__dirname, '../../collection.json'));
	const {logger} = obMockLogger();
	let inputTree: Tree;

	beforeEach(() => {
		inputTree = new HostTree();
		mockCreateFromTemplate('linting');
	});

	test('without package.json', async () => {
		await expect(
			firstValueFrom(runner.callRule(adaptLintingConfiguration(logger.group('A'), 'app'), inputTree))
		).rejects.toThrow('ObSchematicsError - Path "package.json" does not exist');
	});

	describe('with package.json', () => {
		beforeEach(() => {
			inputTree.create(packageJson, '{"keep": {}, "scripts": {"lint": ""}}');
		});

		test('without tslint.json', async () => {
			await expect(
				firstValueFrom(runner.callRule(adaptLintingConfiguration(logger.group('A'), 'app'), inputTree))
			).rejects.toThrow('ObSchematicsError - Path "tsconfig.json" does not exist');
		});

		describe('with valid tsconfig.json', () => {
			beforeEach(() => {
				inputTree.create('tsconfig.json', '{}');
			});

			test('package.json property addition', async () => {
				const resultTree = await firstValueFrom(
					runner.callRule(adaptLintingConfiguration(logger.group('A'), 'app'), inputTree)
				);

				expect(resultTree.readText(packageJson)).toEqual(
					'{"keep": {}, "scripts": {"lint": "","format": "npm run lint -- --fix"}}'
				);
			});

			test('configuration file addition', async () => {
				const resultTree = await firstValueFrom(
					runner.callRule(adaptLintingConfiguration(logger.group('A'), 'app'), inputTree)
				);

				expect(resultTree.exists('eslint.config.mjs')).toBe(true);
			});

			test('references addition', async () => {
				const resultTree = await firstValueFrom(
					runner.callRule(adaptLintingConfiguration(logger.group('A'), 'app'), inputTree)
				);

				expect(resultTree.readText('tsconfig.json')).toBe('{"references": [{"path":"tsconfig.eslint.json"}]}');
			});
		});

		describe('with invalid tsconfig.json', () => {
			beforeEach(() => {
				inputTree.create('tsconfig.json', '{"references": true}');
			});

			test('references addition', async () => {
				const loggerGroup = logger.group('A');

				const resultTree = await firstValueFrom(
					runner.callRule(adaptLintingConfiguration(loggerGroup, 'app'), inputTree)
				);

				expect(resultTree.readText('tsconfig.json')).toBe('{"references": true}');
			});
		});
	});
});
