import type {Command, OptionValues} from '@commander-js/extra-typings';
import type {ObSchemaOption} from '../utils/ob-cli.model';

export const updateDescriptions = {
	summaryText: 'Updates Oblique and runs the migration.',
};

export type ObUpdateOptions<ValueType> = Record<ObUpdateOptionKeys, ValueType>;

export type ObUpdateOptionKeys = 'force' | 'verbose' | 'allow-dirty';

export interface PackageDependencies {
	dependencies?: Record<string, string>;
	devDependencies?: Record<string, string>;
}

export interface HandleObUpdateActionOptions {
	command: Command<[string], OptionValues>;
}

/* Generated content, do not edit */
// prettier-ignore
export const schema = {"$id":"oblique-cli-ob-update-schema","title":"Oblique CLI ob update schema","properties":{"verbose":{"type":"boolean","defaultValue":false,"description":"Enables verbose mode for the Oblique's \"update\" Schematic."},"force":{"type":"boolean","defaultValue":true,"description":"Enables force mode for the Oblique's \"update\" Schematic."},"allow-dirty":{"type":"boolean","defaultValue":true,"description":"Enables allow-dirty mode for the Oblique's \"update\" Schematic."}}} as {properties: ObUpdateOptions<ObSchemaOption>};
/* End of generated content */
