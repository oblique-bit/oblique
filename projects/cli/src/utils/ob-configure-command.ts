import {Command, Option, OptionValues} from '@commander-js/extra-typings';
import {ObNewOptions, ObNewSchemaOption, OptionKeys} from '../new/ob-new.model';
import {ObCliSchema} from './ob-cli.model';

//this is needed because commander sometimes converts the option to firstUpperCase
export function convertOptionPropertyNames(options: ObNewOptions<string | boolean>): ObNewOptions<string | boolean> {
	const optionRecord: ObNewOptions<string | boolean> = {} as ObNewOptions<string | boolean>;
	for (const [key, value] of Object.entries(options)) {
		// this is needed because Commander adds the property name sometimes with first letter uppercase
		optionRecord[convertFirstLetterLowerCase(key) as OptionKeys] = value;
	}
	return optionRecord;
}

export function addObNewCommandOptions(
	schema: ObCliSchema<Partial<ObNewOptions<ObNewSchemaOption>>>,
	command: Command<[string], OptionValues>
): Command<[string], OptionValues> {
	if (Object.prototype.hasOwnProperty.call(schema, 'properties')) {
		for (const [key, value] of Object.entries(schema.properties)) {
			value.description = createOptionDescription(value.description, value.resources);
			command.addOption(configureOption(value, key));
		}
	} else {
		throw new Error(`Schema for command ob ${command.name()} not found!`);
	}
	return command;
}

export function configureOption(config: ObNewSchemaOption, longFlag: string): Option {
	const shortFlag = (config.shortFlag ?? '').length > 0 ? `-${config.shortFlag}` : '';
	const longFlagOption = longFlag && longFlag.length > 0 ? createFlagText(shortFlag, longFlag) : '';
	const flagValuePlaceholder = config.flagValuePlaceholder ?? '';
	const option = new Option(`${shortFlag} ${longFlagOption} ${flagValuePlaceholder}`, config.description);
	const optionWithMandatory = addMandatory(option, config.mandatory);
	const optionWithDefault = addDefaultValue(optionWithMandatory, config.defaultValue, config.defaultValueDescription);
	return addChoices(optionWithDefault, config.choices);
}

function createFlagText(shortFlag: string, optionName: string): string {
	return `${shortFlag.length > 0 ? ',' : ''} --${optionName}`;
}

function createOptionDescription(description: string, resources?: string[]): string {
	let resourceDescription = resources && resources.length > 0 ? resources.join(' and ') : '';
	resourceDescription = resources && resources.length > 0 ? ` See more information at ${resourceDescription}` : '';
	return [description, resourceDescription].join('');
}

function addMandatory(option: Option, mandatory?: boolean): Option {
	return mandatory === true ? option.makeOptionMandatory(true) : option;
}

function addDefaultValue(option: Option, defaultValue?: boolean | string, defaultValueDescription?: string): Option {
	if (defaultValue !== undefined) {
		option.defaultValue = defaultValue;
		option.default(defaultValue, defaultValueDescription);
	}
	if (defaultValueDescription !== undefined) {
		option.defaultValueDescription = defaultValueDescription;
		option.default(defaultValue, defaultValueDescription);
	}
	return option;
}

function addChoices(option: Option, choices?: string[]): Option {
	return choices && choices.length > 0 ? option.choices(choices) : option;
}

function convertFirstLetterLowerCase(input: string): string {
	return input.charAt(0).toLowerCase() + input.slice(1);
}