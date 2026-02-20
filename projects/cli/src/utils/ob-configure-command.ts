import {type Command, Option, type OptionValues} from '@commander-js/extra-typings';
import type {ObNewOptions, ObNewSchemaOption, OptionKeys} from '../new/ob-new.model';
import type {ObCliSchema} from './ob-cli.model';

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
	validateFlags(config, longFlag);
	const flags = buildFlags(config.shortFlag, longFlag);
	const option = createValueCommanderOption(config, flags);
	const optionWithMandatory = addMandatory(option, config.mandatory);
	const optionWithDefault = addDefaultValue(optionWithMandatory, config.defaultValue, config.defaultValueDescription);
	return addChoices(optionWithDefault, config.choices);
}

function validateFlags(config: ObNewSchemaOption, longFlag: string): void {
	if (isBlank(config.shortFlag) && isBlank(longFlag)) {
		throw new Error('Either a shortFlag or a longFlag must be provided.');
	}
}

function isBlank(value?: string): boolean {
	return value === undefined || value === null || value.trim().length === 0;
}

function buildFlags(shortFlag?: string, longFlag?: string): string {
	const shortFlagClean = (shortFlag ?? '').trim();
	const longFlagClean = (longFlag ?? '').trim();

	return [shortFlagClean ? `-${shortFlagClean}` : '', longFlagClean ? `--${longFlagClean}` : '']
		.filter(Boolean)
		.join(', ');
}

function createValueCommanderOption(config: ObNewSchemaOption, flags: string): Option {
	return new Option(`${flags} ${config.flagValuePlaceholder}`.trim(), config.description);
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
