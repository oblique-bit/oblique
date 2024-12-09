import {Command, OptionValues} from '@commander-js/extra-typings';
import {getVersionedDependency, projectNamePlaceholder} from '../utils/cli-utils';

export type ObNewOptions<ValueType> = Record<OptionKeys, ValueType>;

export interface ObNewSchemaOption {
	type: string;
	description: string;
	shortFlag?: string;
	defaultValue?: boolean | string;
	flagValuePlaceholder?: string;
	defaultValueDescription?: string;
	choices?: string[];
	mandatory?: boolean;
	resources?: string[];
}

export interface HandleObNewActionOptions {
	projectName: string;
	command: Command<[string], OptionValues>;
}

export type OptionKeys =
	| 'title'
	| 'locales'
	| 'ajv'
	| 'unknownRoute'
	| 'httpInterceptors'
	| 'banner'
	| 'environments'
	| 'externalLink'
	| 'prefix'
	| 'jest'
	| 'protractor'
	| 'npmrc'
	| 'proxy'
	| 'sonar'
	| 'eslint'
	| 'husky';

export type ImmutableOptionsType = 'no-standalone' | 'no-ssr' | 'style';

export const immutableOptions: Record<ImmutableOptionsType, {value?: string; description: string}> = {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	'no-standalone': {
		description: `Oblique doesn't support standalone components`
	},
	// eslint-disable-next-line @typescript-eslint/naming-convention
	'no-ssr': {
		description: `Oblique doesn't support server side rendering`
	},
	style: {
		value: 'scss',
		description: 'Oblique uses SCSS'
	}
};

export const obNewConfig = {
	obNewSummaryText: `Creates an Oblique project`,
	projectNameArgument: {
		description: `Unique name for your new project`,
		argumentName: projectNamePlaceholder
	}
};

export const createsWorkspaceMessage = `\nCreates a new Angular workspace`;
export const ngAddStringCommand = `npx ${getVersionedDependency('@angular/cli')} add ${getVersionedDependency('@oblique/oblique')}`;
