import {Command, OptionValues} from '@commander-js/extra-typings';
import * as cliPackage from '../../package.json';
import * as obNewSchema from './schema.json';
import {execSync} from 'child_process';
import {addStringFlag, getTitlesCommandOption} from './ob-new';
import {HandleObNewActionOptions, ObNewOptions, ObNewSchemaOption, obNewConfig} from './ob-new.model';
import {currentVersions} from '../utils/cli-utils';
import path from 'path';

const nodeChildProcess: typeof import('node:child_process') = jest.requireActual('node:child_process');
interface ObNewModuleType {
	createAddObliqueCommand: (command: string, options: Record<string, string | boolean | ObNewSchemaOption>, projectName: string) => string;
	runNgNewAngularWorkspace: (projectName?: string, prefix?: string | 'app') => void;
	handleObNewActions: (options: HandleObNewActionOptions) => void;
	addImmutableOptionsText: (command: Command<[string], OptionValues>) => Command<[string], OptionValues>;
	createObNewCommand: () => Command<[string], OptionValues>;
	runAddOblique: (options: ObNewOptions<string | boolean>, projectName: string) => void;
	addStringFlag: (option: {key: string; value: string}, projectName: string, property: ObNewSchemaOption) => string[];
	handleAction: (options: HandleObNewActionOptions) => void;
	getTitlesCommandOption: (option: {key: string; value: string}, projectName: string) => string;
}

describe('Ob new command', () => {
	const projectName = 'SuperduperProject';
	// eslint-disable-next-line @typescript-eslint/no-var-requires
	let obNew: ObNewModuleType = require('./ob-new') as ObNewModuleType;
	let obNewCommand: Command<[string], OptionValues>;
	let parsedObNewCommand: Command<[string], OptionValues>;
	describe('addStringFlag', () => {
		test.each([
			{
				description: 'title command option when option key is "title" and property type is "string"',
				option: {key: 'title', value: 'My Project'},
				property: {type: 'string'} as ObNewSchemaOption,
				expected: [getTitlesCommandOption({key: 'title', value: 'My Project'}, projectName)]
			},
			{
				description: 'string flag command option for non-title keys when property type is "string"',
				option: {key: 'description', value: 'This is a test'},
				property: {type: 'string'} as ObNewSchemaOption,
				expected: ['--description="This is a test"']
			},
			{
				description: 'empty array when property type is not "string"',
				option: {key: 'title', value: 'My Project'},
				property: {type: 'number'} as ObNewSchemaOption,
				expected: []
			},
			{
				description: 'empty array when property does not have a "type" property',
				option: {key: 'title', value: 'My Project'},
				property: {type: undefined} as ObNewSchemaOption,
				expected: []
			}
		])('$description', ({option, property, expected}) => {
			const result = addStringFlag(option, projectName, property);
			expect(result).toEqual(expected);
		});
	});

	describe('getTitlesCommandOption', () => {
		test.each([
			{
				description: 'title option when option key is "title" and value is not empty',
				option: {key: 'title', value: 'My Custom Title'},
				expected: '--title="My Custom Title"'
			},
			{
				description: 'title option when option key is "title" and value is an empty string',
				option: {key: 'title', value: ''},
				expected: `--title="${projectName}"`
			},
			{
				description: 'empty string when option key is not "title"',
				option: {key: 'description', value: 'A description'},
				expected: ''
			}
		])('returns $description', ({option, expected}) => {
			const result = getTitlesCommandOption(option, projectName);
			expect(result).toBe(expected);
		});
	});

	describe('after createObNewCommand', () => {
		describe('without error', () => {
			beforeAll(() => {
				const nodeChildProcessWithoutErrorSpy = jest.spyOn(nodeChildProcess, 'execSync').mockImplementation(() => 'ok');
				jest.mock('node:child_process', () => ({
					...jest.requireActual('node:child_process'),
					execSync: nodeChildProcessWithoutErrorSpy
				}));
				jest.spyOn(console, 'info');
				jest.spyOn(console, 'timeEnd');
				obNew = require('./ob-new');
				obNewCommand = obNew.createObNewCommand();
				parsedObNewCommand = obNewCommand.parse([projectName], {from: 'user'});
			});

			describe('command setup', () => {
				test('should have name "new"', () => {
					expect(parsedObNewCommand.name()).toBe('new');
				});

				test('should have description: "Creates a new Angular project and install Oblique"', () => {
					expect(parsedObNewCommand.description()).toBe(obNewConfig.obNewSummaryText);
				});

				test(`should have package version ${cliPackage.version}`, () => {
					expect(parsedObNewCommand.version()).toBe(cliPackage.version);
				});

				test(`should not have aliases`, () => {
					expect(parsedObNewCommand.aliases()).toStrictEqual([]);
				});

				test(`should have usage`, () => {
					expect(parsedObNewCommand.usage()).toStrictEqual('<project-name> [...options]');
				});
				test(`should have description`, () => {
					expect(parsedObNewCommand.description()).toStrictEqual(obNewConfig.obNewSummaryText);
				});

				test(`should have summary`, () => {
					expect(parsedObNewCommand.summary()).toStrictEqual(obNewConfig.obNewSummaryText);
				});
			});

			/* eslint-disable no-console */
			describe.each([
				{index: 1, message: 'OBLIQUE CLI', type: 'info'},
				{index: 2, message: '\nCreates a new Angular workspace', type: 'info'},
				{index: 3, message: '[Info]: Installs Angular Material', type: 'info'},
				{index: 4, message: '[Complete]: Oblique added', type: 'info'},
				{index: 1, message: 'Oblique CLI ob new completed in', type: 'timeEnd'}
			])('calls console ', ({index, message, type}) => {
				test(`${type} ${message}`, () => {
					// eslint
					expect(console[type]).toHaveBeenNthCalledWith(index, message);
				});
			});

			const optionProperties = Object.entries(obNewSchema.properties).map(property => ({key: property[0], value: property[1]}));
			/* eslint-enable */

			describe.each(optionProperties)('default option', ({key, value}) => {
				test(`should have option for ${key} with default value "${value.defaultValue}"`, () => {
					expect(parsedObNewCommand.opts()[key]).toBe(value.defaultValue);
				});
			});

			describe('help text', () => {
				const helpTextLines = [
					{
						description: 'Usage information for creating a new Angular project',
						expected: `Usage: new <project-name> [...options] ${obNewConfig.obNewSummaryText}`
					},
					{
						description: 'Argument for the project name',
						expected: 'Arguments: project-name Unique name for your new project'
					},
					{
						description: 'Section header for options',
						expected: 'Options:'
					},
					{
						description: 'Option to output the current version of the CLI',
						expected: 'Options: -v, --version Shows the current version of @oblique/cli '
					},
					{
						description: "Option to specify the application's title",
						expected:
							"--title <project-name> Add the specified application's title: The title will be visible in the header of your application. (default: project name.)"
					},
					{
						description: 'Option to specify supported locales',
						expected: '--locales <locales> Supported locales: Use a whitespace separated list. (default: "de-CH fr-CH it-CH")'
					},
					{
						description: 'Option to specify environment files',
						expected:
							"--environments <environments> Environment files: Use a whitespace separated list or leave a whitespace to skip the feature. 'local' will create an 'environment.ts' file, all other environments will create a corresponding 'environment.<env>.ts' file. (default: local dev ref test abn prod)"
					},
					{
						description: 'Option to specify the prefix for components and directives',
						expected:
							'--prefix <prefix> Prefix configuration: The prefix for components and directive\'s selectors. Leave empty for no prefix. (default: "app")'
					},
					{
						description: 'Option to configure a proxy server',
						expected:
							'--proxy <port> Proxy configuration: Defines the port for the proxy configuration for server connection. (default: " ")'
					},
					{
						description: 'Option to add Ajv dependency for form validation',
						expected:
							'--ajv Add Ajv dependency: Value "true" enables form validation based on a schema delivered by the server. See more information at https://www.npmjs.com/package/ajv (default: true)'
					},
					{
						description: 'Option for unknown route management',
						expected:
							"--unknownRoute Unknown route management: This will display custom 404 pages instead of redirecting to the home page. See more information at Oblique's Unknown route API at https://oblique.bit.admin.ch/helpers/unknown-route/api (default: true)"
					},
					{
						description: 'Option to add HTTP interceptors',
						expected:
							"-httpInterceptors Http interceptor: If set to true, it will provide the ObHttpApiInterceptor in the app.module.ts. The interceptor displays a spinner on API calls and a notification on errors. See more information at Oblique's ObHttpInterceptor API at https://oblique.bit.admin.ch/helpers/http-interceptor/api (default: true)"
					},
					{
						description: 'Option to show a banner for the current environment',
						expected:
							"--banner Banner to show current environment: The ObBanner will show the current environment in the header. This feature is only available if at least 1 environment will be defined. To define your environments, use the option --environments <Environments>. See more information at Oblique's ObBanner API at https://oblique.bit.admin.ch/helpers/banner/api"
					},
					{
						description: 'Option to add the external link module',
						expected:
							"--externalLink External link: If true, it imports the ObExternalLinkModule. This feature automatically enhances external links. See more information at Oblique's External link API at https://oblique.bit.admin.ch/components/external-link/api (default: true)"
					},
					{
						description: 'Option to use Jest for unit tests',
						expected:
							"--jest Jest for unit tests: If true, Karma/Jasmine will be replaced with Jest as your application's testing framework. See more information at Jest at npm https://www.npmjs.com/package/jest and Jest's documentation: https://jestjs.io/docs/getting-started (default: true)"
					},
					{
						description: 'Option to keep Protractor for end-to-end tests',
						expected: '--protractor Protractor for end to end tests: If you use this flag, you keep Protractor for e2e tests.'
					},
					{
						description: 'Option to create an .npmrc file',
						expected:
							'--npmrc Create .npmrc: If you use this flag, it adds an .npmrc file, suitable for projects located within confederation/federal network. (default: true)'
					},
					{
						description: 'Option to add Sonar configuration',
						expected: '--sonar Sonar configuration: If set to true, a Sonar configuration is added. (default: true)'
					},
					{
						description: 'Option to add ESLint and Prettier',
						expected:
							' --eslint ESLint & Prettier: If true, it adds eslint & prettier configuration as used by the Oblique team. See more information at ESLint Documentation: https://eslint.org/docs/latest/use/getting-started (default: true)'
					},
					{
						description: 'Option to add Husky configuration for git hooks',
						expected:
							"--husky Husky configuration: If true, it adds git hooks to automatically format changed files. See more information at Husky Documentation at https://typicode.github.io/husky/ and Husky's package at npm https://www.npmjs.com/package/husky (default: true)"
					},
					{
						description: 'Option to display help information',
						expected: '-h, --help Shows a help message for the "ob new" command in the console'
					}
				];
				test.each(helpTextLines)('has $description', ({expected}) => {
					expect(cleanOutput(parsedObNewCommand.helpInformation())).toContain(expected);
				});
			});

			describe('handleObNewActions execSync calls', () => {
				test(`should call npx @angular/cli@${currentVersions['@angular/cli']} new ${projectName} --no-standalone --no-ssr --style="scss" --prefix=app`, () => {
					expect(execSync).toHaveBeenNthCalledWith(
						1,
						`npx @angular/cli@${currentVersions['@angular/cli']} new ${projectName} --no-standalone --no-ssr --style="scss" --prefix=app`,
						{
							cwd: process.cwd(),
							stdio: 'inherit'
						}
					);
				});

				test(`should call npm install @angular/material@${currentVersions['@angular/material']}`, () => {
					expect(execSync).toHaveBeenNthCalledWith(2, `npm install @angular/material@${currentVersions['@angular/material']}`, {
						cwd: path.join(process.cwd(), projectName),
						stdio: 'inherit'
					});
				});

				test(`should call npx ${projectName} with default parameter`, () => {
					expect(execSync).toHaveBeenNthCalledWith(
						3,
						`npx @angular/cli@${currentVersions['@angular/cli']} add @oblique/oblique@${currentVersions['@oblique/oblique']} --title="${projectName}" --locales="de-CH fr-CH it-CH" --environments="local dev ref test abn prod" --prefix="app" --proxy=" " --jenkins="" --ajv --unknownRoute --httpInterceptors --no-banner --externalLink --jest --no-protractor --npmrc --sonar --no-static --eslint --husky`,
						{
							cwd: path.join(process.cwd(), projectName),
							stdio: 'inherit'
						}
					);
				});
			});
		});

		describe('with error in ', () => {
			const errorMessage = 'bad bad error';
			beforeAll(() => {
				const nodeChildProcessWithErrorSpy = jest
					.spyOn(nodeChildProcess, 'execSync')
					.mockImplementationOnce(() => {
						throw new Error(errorMessage);
					})
					.mockImplementation(() => 'ok');
				jest.mock('node:child_process', () => ({
					...jest.requireActual('node:child_process'),
					execSync: nodeChildProcessWithErrorSpy
				}));
				jest.spyOn(console, 'error');
				jest.spyOn(console, 'info');
				jest.spyOn(console, 'timeEnd');
				obNew = require('./ob-new');
				obNewCommand = obNew.createObNewCommand();
				// eslint-disable @typescript-eslint/no-unsafe-call @typescript-eslint/no-unsafe-member-access
				parsedObNewCommand = obNewCommand.parse([projectName], {from: 'user'});
			});

			test(`should throw error`, () => {
				expect(console.error).toHaveBeenCalledWith('Installation failed: ', Error(errorMessage));
			});
		});
	});

	function cleanOutput(output: string): string {
		return output.replace(/\s+/g, ' ').trim();
	}
});
