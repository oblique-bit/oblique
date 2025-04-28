import {Command, type Option} from '@commander-js/extra-typings';
import type {OptionValues} from 'commander';
import type {ObNewOptions, ObNewSchemaOption} from '../new/ob-new.model';
import type {ObCliSchema} from './ob-cli.model';
import {addObNewCommandOptions, configureOption, convertOptionPropertyNames} from './ob-configure-command';

jest.mock('../new/ob-new.model');
jest.mock('./ob-cli.model');

describe('ob-configure-command tests', () => {
	describe('convertOptionPropertyNames', () => {
		test('should convert first letter of option names to lowercase', () => {
			const inputOptions = {
				SomeOption: 'value1', // eslint-disable-line @typescript-eslint/naming-convention
				aThirdOption: true,
				anotherOption: 'value2'
			} as unknown as ObNewOptions<string | boolean>;

			const expectedOptions = {
				someOption: 'value1',
				anotherOption: 'value2',
				aThirdOption: true
			};

			const result = convertOptionPropertyNames(inputOptions);

			expect(result).toEqual(expectedOptions);
		});
	});

	describe('addObNewCommandOptions', () => {
		test('should add command options based on the schema', () => {
			const schema: ObCliSchema<Partial<ObNewOptions<ObNewSchemaOption>>> = {
				properties: {
					option1: {
						description: 'Description for option 1',
						flagValuePlaceholder: 'value1'
					},
					option2: {
						description: 'Description for option 2',
						shortFlag: 'o',
						choices: ['choice1', 'choice2']
					}
				}
			} as unknown as ObCliSchema<Partial<ObNewOptions<ObNewSchemaOption>>>;

			const command = new Command<[string], OptionValues>('test-command');

			const commandWithOptions = addObNewCommandOptions(schema, command);
			expect(commandWithOptions.options.at(1).flags).toBe(`-o, --option2`);
		});

		test('should throw an error if schema properties are not found', () => {
			const schema = {} as ObCliSchema<Partial<ObNewOptions<ObNewSchemaOption>>>;

			const command = new Command<[string], OptionValues>('test-command');

			expect(() => addObNewCommandOptions(schema, command)).toThrow('Schema for command ob test-command not found!');
		});
	});

	describe('configureOption', () => {
		let option: Option;
		const config = {
			description: 'Test option description',
			shortFlag: 't',
			defaultValue: 'defaultValue',
			choices: ['choice1', 'choice2'],
			mandatory: true,
			flagValuePlaceholder: 'testValue'
		} as ObNewSchemaOption;
		option = configureOption(config, 'test-option');

		const testCases = [
			{description: 'option flags to contain -t', actual: option.flags, expected: '-t', matcher: 'toContain'},
			{description: 'option flags to contain --test-option', actual: option.flags, expected: '--test-option', matcher: 'toContain'},
			{description: 'option flags to contain testValue', actual: option.flags, expected: 'testValue', matcher: 'toContain'},
			{description: 'default value to be defaultValue', actual: option.defaultValue, expected: 'defaultValue', matcher: 'toBe'},
			{description: 'mandatory to be true', actual: option.mandatory, expected: true, matcher: 'toBe'},
			{
				description: 'argument choices to equal choice1 and choice2',
				actual: option.argChoices,
				expected: ['choice1', 'choice2'],
				matcher: 'toEqual'
			}
		];

		test('should throw if both shortFlag and longFlag are missing or empty', () => {
			const brokenConfig = {
				description: 'No flags here',
				flagValuePlaceholder: 'value'
			} as ObNewSchemaOption;

			expect(() => configureOption(brokenConfig, '')).toThrow(/At least one of shortFlag or longFlag must be provided./i);
		});

		test.each(testCases)('should have $description', ({actual, expected, matcher}) => {
			if (matcher === 'toContain') {
				expect(actual).toContain(expected);
			} else if (matcher === 'toBe') {
				expect(actual).toBe(expected);
			} else if (matcher === 'toEqual') {
				expect(actual).toEqual(expected);
			}
		});

		test('should handle no short flag', () => {
			option = configureOption(
				{
					description: 'Test option description',
					flagValuePlaceholder: 'testValue',
					type: 'string'
				} as ObNewSchemaOption,
				'test-option'
			);

			expect(option.flags).not.toContain('--testValue');
			expect(option.flags).toContain('--test-option');
		});

		test.each([
			{
				description: 'longFlag is present and has length > 0',
				optionConfig: {shortFlag: 's', description: 'Test option'} as ObNewSchemaOption,
				longFlag: 'testOption',
				expectedShortFlag: '-s',
				expectedLongFlag: '--testOption'
			},
			{
				description: 'longFlag is an empty string',
				optionConfig: {shortFlag: 's', description: 'Test option'} as ObNewSchemaOption,
				longFlag: '',
				expectedShortFlag: '-s',
				expectedLongFlag: undefined
			},
			{
				description: 'longFlag is undefined',
				optionConfig: {shortFlag: 's', description: 'Test option'} as ObNewSchemaOption,
				longFlag: undefined,
				expectedShortFlag: '-s',
				expectedLongFlag: undefined
			},
			{
				description: 'longFlag is null',
				optionConfig: {shortFlag: 's', description: 'Test option'} as ObNewSchemaOption,
				longFlag: null,
				expectedShortFlag: '-s',
				expectedLongFlag: undefined
			}
		])('should handle $description', ({optionConfig, longFlag, expectedShortFlag, expectedLongFlag}) => {
			const result = configureOption(optionConfig, longFlag);

			if (expectedShortFlag) {
				expect(result.flags).toContain(expectedShortFlag);
			}
			if (expectedLongFlag) {
				expect(result.flags).toContain(expectedLongFlag);
			} else {
				expect(result.flags).not.toContain('--');
			}
		});

		test('should handle no choices', () => {
			const optionConfig = {
				description: 'Test option description'
			} as ObNewSchemaOption;
			const optionWithoutChoice = configureOption(optionConfig, 'test-option');
			expect(optionWithoutChoice.argChoices).toBeUndefined();
		});
	});
});
