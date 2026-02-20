import {Command, type Option} from '@commander-js/extra-typings';
import type {OptionValues} from 'commander';
import {type ObNewOptions, type ObNewSchemaOption, schema} from '../new/ob-new.model';
import type {ObCliSchema} from './ob-cli.model';
import {addObNewCommandOptions, configureOption, convertOptionPropertyNames} from './ob-configure-command';

jest.mock('../new/ob-new.model');
jest.mock('./ob-cli.model');

describe('ob-configure-command', () => {
	let command: Command<[string], OptionValues>;

	beforeEach(() => {
		command = new Command<[string], OptionValues>('ob');
	});

	afterEach(() => {
		jest.restoreAllMocks();
	});

	describe('convertOptionPropertyNames', () => {
		test.each([
			[
				{
					// eslint-disable-next-line @typescript-eslint/naming-convention
					SomeOption: 'value1',
					aThirdOption: true,
					anotherOption: 'value2',
				},
				{
					someOption: 'value1',
					aThirdOption: true,
					anotherOption: 'value2',
				},
			],
		])('converts first letter to lowercase', (input, expected) => {
			const result = convertOptionPropertyNames(input as unknown as ObNewOptions<string | boolean>);

			expect(result).toEqual(expected);
		});
	});

	describe('addObNewCommandOptions', () => {
		let addOptionSpy: jest.SpyInstance;

		beforeEach(() => {
			addOptionSpy = jest.spyOn(command, 'addOption');
		});

		test.each([
			[
				{
					description: 'adds one option',
					cliSchema: {
						properties: {
							title: {
								type: 'string',
								description: 'Project title',
								flagValuePlaceholder: '<title>',
							},
						},
					},
					expectedCalls: 1,
				},
			],
		])('%s', ({cliSchema, expectedCalls}) => {
			addObNewCommandOptions(cliSchema as ObCliSchema<Partial<ObNewOptions<ObNewSchemaOption>>>, command);

			expect(addOptionSpy).toHaveBeenCalledTimes(expectedCalls);
		});

		test('returns same command instance', () => {
			const cliSchema: ObCliSchema<Partial<ObNewOptions<ObNewSchemaOption>>> = {
				properties: {
					title: {
						type: 'string',
						description: 'Project title',
						flagValuePlaceholder: '<title>',
					},
				},
			};

			const result = addObNewCommandOptions(cliSchema, command);

			expect(result).toBe(command);
		});

		test('throws when schema has no properties', () => {
			const cliSchema = {} as ObCliSchema<Partial<ObNewOptions<ObNewSchemaOption>>>;

			expect(() => addObNewCommandOptions(cliSchema, command)).toThrow('Schema for command ob ob not found!');
		});
		describe('configureOption', () => {
			test('throws error when shortFlag and longFlag are missing', () => {
				const invalidConfig: ObNewSchemaOption = {
					type: 'string',
					description: 'Invalid option',
				};

				expect(() => configureOption(invalidConfig, '')).toThrow('Either a shortFlag or a longFlag must be provided.');
			});

			test('should throw if both shortFlag and longFlag are missing or empty', () => {
				const brokenConfig = {
					description: 'No flags here',
					flagValuePlaceholder: 'value',
				} as ObNewSchemaOption;

				expect(() => configureOption(brokenConfig, '')).toThrow('Either a shortFlag or a longFlag must be provided.');
			});

			test('should trim options', () => {
				const invalidConfig: ObNewSchemaOption = {
					type: 'string',
					description: 'Invalid option',
				};

				expect(() => configureOption(invalidConfig, '')).toThrow('Either a shortFlag or a longFlag must be provided.');
			});

			describe.each([
				{
					description: 'should trim options',
					shortFlag: ' s ',
					longFlag: '  test  ',
					expected: '-s, --test',
				},
				{
					description: 'should trim longFlag and not use empty shortFlag " "',
					shortFlag: '  ',
					longFlag: '  test ',
					expected: '--test',
				},
				{
					description: 'should trim longFlag and not use empty shortFlag " "',
					shortFlag: ' s ',
					longFlag: '   ',
					expected: '-s',
				},
				{
					description: 'shortFlag and longFlag present',
					shortFlag: 's',
					longFlag: 'test',
					expected: '-s, --test',
				},
				{
					description: 'only shortFlag present and longFlag equal ""',
					shortFlag: 's',
					longFlag: '',
					expected: '-s',
				},
				{
					description: 'only longFlag present',
					shortFlag: undefined,
					longFlag: 'test',
					expected: '--test',
				},
				{
					description: 'only shortFlag present and longFlag undefined',
					shortFlag: 's',
					longFlag: undefined,
					expected: '-s <value>',
				},
				{
					description: 'shortFlag with whitespace',
					shortFlag: ' s ',
					longFlag: 'test',
					expected: '-s, --test',
				},
				{
					description: 'longFlag with whitespace',
					shortFlag: 's',
					longFlag: ' test ',
					expected: '-s, --test',
				},
				{
					description: 'longFlag and shortFlag with whitespace',
					shortFlag: ' s ',
					longFlag: ' test ',
					expected: '-s, --test',
				},
				{
					description: 'shortFlag is null',
					shortFlag: null,
					longFlag: 'test',
					expected: '--test',
				},
				{
					description: 'longFlag is null',
					shortFlag: 's',
					longFlag: null,
					expected: '-s',
				},
			])('$description', ({shortFlag, longFlag, expected}) => {
				let option: Option;

				beforeEach(() => {
					const options = configureOption(
						{
							type: 'string',
							description: 'Test option',
							shortFlag,
							flagValuePlaceholder: '<value>',
						},
						longFlag
					);

					option = options[0];
				});

				test('builds correct flags', () => {
					expect(option.flags).toContain(expected);
				});
			});
		});
	});

	describe('boolean options via addObNewCommandOptions', () => {
		let addOptionSpy: jest.SpyInstance;

		beforeEach(() => {
			addOptionSpy = jest.spyOn(command, 'addOption');
		});

		const cliSchema: ObCliSchema<Partial<ObNewOptions<ObNewSchemaOption>>> = {
			properties: {
				interactive: {
					type: 'boolean',
					description: 'Interactive mode',
				},
			},
		};

		test('adds two options', () => {
			addObNewCommandOptions(cliSchema, command);

			expect(addOptionSpy).toHaveBeenCalledTimes(2);
		});

		test.each([
			{index: 0, optionFlag: '--interactive [boolean]'},
			{index: 1, optionFlag: '--no-interactive'},
		])(`creates boolean flag $option`, ({index, optionFlag}) => {
			addObNewCommandOptions(cliSchema, command);

			const option = addOptionSpy.mock.calls[index][0] as Option;
			expect(option.flags).toContain(optionFlag);
		});
	});

	describe('option metadata', () => {
		let addOptionSpy: jest.SpyInstance;

		beforeEach(() => {
			addOptionSpy = jest.spyOn(command, 'addOption');
		});

		test('sets mandatory option', () => {
			addObNewCommandOptions(
				{
					properties: {
						prefix: {
							type: 'string',
							description: 'Prefix',
							flagValuePlaceholder: '<prefix>',
							mandatory: true,
						},
					},
				},
				command
			);

			const option = addOptionSpy.mock.calls[0][0] as Option;

			expect(option.mandatory).toBe(true);
		});

		test('sets default value', () => {
			addObNewCommandOptions(
				{
					properties: {
						title: {
							type: 'string',
							description: 'Title',
							flagValuePlaceholder: '<title>',
							defaultValue: 'MyProject',
						},
					},
				},
				command
			);

			const option = addOptionSpy.mock.calls[0][0] as Option;

			expect(option.defaultValue).toBe('MyProject');
		});

		test('sets choices', () => {
			addObNewCommandOptions(
				{
					properties: {
						locales: {
							type: 'string',
							description: 'Locales',
							flagValuePlaceholder: '<locales>',
							choices: ['de', 'fr'],
						},
					},
				},
				command
			);

			const option = addOptionSpy.mock.calls[0][0] as Option;

			expect(option.argChoices).toEqual(['de', 'fr']);
		});
	});

	describe('configureOption boolean parsing', () => {
		const booleanOptions = Object.entries(schema.properties).filter(([, value]) => value.type === 'boolean');

		describe.each([
			{prefix: '', expected: true},
			{prefix: 'no-', expected: false},
		])('with prefix "$prefix"', ({prefix, expected}) => {
			test.each(booleanOptions)('parses %s correctly', (key, optionConfig) => {
				const testCommand = new Command<[string], OptionValues>('test');
				const options = configureOption(optionConfig, key);

				for (const option of options) {
					testCommand.addOption(option);
				}

				const parsed = testCommand.parse([`--${prefix}${key}`], {
					from: 'user',
				});

				expect(parsed.opts()[key]).toBe(expected);
			});
		});
	});
});
