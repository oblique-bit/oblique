import type {Command, OptionValues} from '@commander-js/extra-typings';
import {projectNamePlaceholder} from '../utils/cli-utils';

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
	| 'interactive'
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
	| 'npmrc'
	| 'proxy'
	| 'eslint'
	| 'husky';

export type ImmutableOptionsType = 'standalone' | 'ssr' | 'style' | 'zoneless' | 'ai-config';

export const immutableOptions: Record<ImmutableOptionsType, {value: string | boolean; description: string}> = {
	standalone: {
		value: false,
		description: `Oblique doesn't support standalone components`,
	},
	ssr: {
		value: false,
		description: `Oblique doesn't support server side rendering`,
	},
	zoneless: {
		value: false,
		description: `Oblique doesn't recommend zoneless yet`,
	},
	'ai-config': {
		value: 'none',
		description: `Oblique doesn't recommend AI yet`,
	},
	style: {
		value: 'scss',
		description: 'Oblique uses SCSS',
	},
};

export const obNewConfig = {
	obNewSummaryText: `Creates an Oblique project`,
	projectNameArgument: {
		description: `Unique name for your new project`,
		argumentName: projectNamePlaceholder,
	},
};

export const createsWorkspaceMessage = `\n[Info]: Creates a new Angular workspace`;

/* Generated content, do not edit */
// prettier-ignore
export const schema = {"$id":"oblique-cli-ng-new-schema","title":"Oblique CLI ng new schema","properties":{"interactive":{"type":"boolean","defaultValue":false,"description":"Enables interactive mode for the Oblique's \"add\" Schematic. When activated, this flag prompts the user for all options, bypassing default and predefined settings. It offers greater flexibility and control through a step-by-step configuration process."},"title":{"type":"string","defaultValue":"<project-name>","description":"Add the specified application's title: The title will be visible in the header of your application.","defaultValueDescription":"project name.","minLength":1,"mandatory":true,"flagValuePlaceholder":"<project-name>"},"locales":{"type":"string","flagValuePlaceholder":"<locales>","defaultValue":"de-CH fr-CH it-CH","description":"Supported locales: Use a whitespace separated list."},"environments":{"type":"string","defaultValue":"local dev ref test abn prod","flagValuePlaceholder":"<environments>","defaultValueDescription":"local dev ref test abn prod","description":"Environment files: Use a whitespace separated list or leave a whitespace to skip the feature. 'local' will create an 'environment.ts' file, all other environments will create a corresponding 'environment.<env>.ts' file."},"prefix":{"type":"string","flagValuePlaceholder":"<prefix>","defaultValue":"app","description":"Prefix configuration: The prefix for components and directive's selectors. Leave empty for no prefix."},"proxy":{"type":"string","flagValuePlaceholder":"<port>","defaultValue":" ","description":"Proxy configuration: Defines the port for the proxy configuration for server connection."},"ajv":{"type":"boolean","defaultValue":true,"description":"Add Ajv dependency: Value \"true\" enables form validation based on a schema delivered by the server.","resources":["https://www.npmjs.com/package/ajv"]},"unknownRoute":{"type":"boolean","defaultValue":true,"description":"Unknown route management: This will display custom 404 pages instead of redirecting to the home page.","resources":["Oblique's Unknown route API at https://oblique.bit.admin.ch/helpers/unknown-route/api"]},"httpInterceptors":{"type":"boolean","defaultValue":true,"description":"Http interceptor: If set to true, it will provide the ObHttpApiInterceptor in the app.module.ts. The interceptor displays a spinner on API calls and a notification on errors.","resources":["Oblique's ObHttpInterceptor API at https://oblique.bit.admin.ch/helpers/http-interceptor/api"]},"banner":{"type":"boolean","defaultValue":false,"description":"Banner to show current environment: The ObBanner will show the current environment in the header. This feature is only available if at least 1 environment will be defined. To define your environments, use the option --environments <Environments>.","resources":["Oblique's ObBanner API at https://oblique.bit.admin.ch/helpers/banner/api"]},"externalLink":{"type":"boolean","defaultValue":true,"description":"External link: If true, it imports the ObExternalLinkModule. This feature automatically enhances external links.","resources":["Oblique's External link API at https://oblique.bit.admin.ch/components/external-link/api"]},"jest":{"type":"boolean","defaultValue":true,"description":"Jest for unit tests: If true, Karma/Jasmine will be replaced with Jest as your application's testing framework.","resources":["Jest at npm https://www.npmjs.com/package/jest","Jest's documentation: https://jestjs.io/docs/getting-started"]},"npmrc":{"type":"boolean","defaultValue":true,"description":"Create .npmrc: If you use this flag, it adds an .npmrc file, suitable for projects located within confederation/federal network."},"eslint":{"type":"boolean","defaultValue":true,"description":"ESLint & Prettier: If true, it adds eslint & prettier configuration as used by the Oblique team.","resources":["ESLint Documentation: https://eslint.org/docs/latest/use/getting-started"]},"husky":{"type":"boolean","defaultValue":true,"description":"Husky configuration: If true, it adds git hooks to automatically format changed files.","resources":["Husky Documentation at https://typicode.github.io/husky/","Husky's package at npm https://www.npmjs.com/package/husky"]}}} as {properties: ObNewOptions<ObNewSchemaOption>};
/* End of generated content */
