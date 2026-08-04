import {Command, type OptionValues} from '@commander-js/extra-typings';
import {
	buildOption,
	commandUsageText,
	execute,
	optionDescriptions,
	projectNamePlaceholder,
	startObCommand,
	version,
} from '../utils/cli-utils.js';
import {addObNewCommandOptions, convertOptionPropertyNames} from '../utils/ob-configure-command.js';
import {
	type HandleObNewActionOptions,
	type ObNewOptions,
	type ObOptionValueType,
	createsWorkspaceMessage,
	immutableOptions,
	obNewConfig,
	obliqueOptionKeys,
	schema,
	toolchainOptionKeys,
} from './ob-new.model.js';

export function createObNewCommand(): Command<[string], OptionValues> {
	const command = new Command<[string], OptionValues>();
	const initializedCommand: Command<[string], OptionValues> = initializeCommand(command);
	return configureCommandOptions(initializedCommand);
}

function initializeCommand(command: Command<[string], OptionValues>): Command<[string], OptionValues> {
	command
		.name('new')
		.version(version, optionDescriptions.ob.version.flags, optionDescriptions.ob.version.description)
		.helpOption(optionDescriptions.new.help.flags, optionDescriptions.new.help.description)
		.usage(commandUsageText('new'))
		.summary(obNewConfig.obNewSummaryText)
		.description(obNewConfig.obNewSummaryText)
		.argument(obNewConfig.projectNameArgument.argumentName, obNewConfig.projectNameArgument.description)
		.action(projectName => handleAction({projectName, command}))
		.showSuggestionAfterError(true)
		.showHelpAfterError(true);
	return command;
}

function handleAction(options: HandleObNewActionOptions): void {
	startObCommand(
		handleObNewActions as (options: HandleObNewActionOptions) => void,
		'Oblique CLI ob new completed in',
		options
	);
}

function handleObNewActions(options: HandleObNewActionOptions): void {
	let cmdOptions = convertOptionPropertyNames(options.command.opts());
	cmdOptions = (cmdOptions.interactive as boolean) ? ({interactive: true} as ObNewOptions) : cmdOptions;
	try {
		runNgNewAngularWorkspace(options.projectName, cmdOptions.interactive as boolean, cmdOptions.prefix as string);
		if (cmdOptions.interactive as boolean) {
			console.info(
				`[Info]: Interactive mode is enabled. All other options will be ignored, and you will be prompted to specify each option.`
			);
		}
		const workingDirectory: string = getApplicationDirectory(options.projectName);
		runAddMaterial(workingDirectory);
		runAddOblique(cmdOptions, options.projectName, workingDirectory);
		cleanupDependencies(workingDirectory);
		formatCode(workingDirectory);
	} catch (error) {
		console.error('Installation failed: ', error);
	}
}

function runNgNewAngularWorkspace(projectName: string, interactive: boolean, prefix: string): void {
	console.info(createsWorkspaceMessage);
	const baseOptions = Object.entries(immutableOptions)
		.map(([key, option]) => ({key, value: option.value}))
		.reduce((options, option) => ({...options, [option.key]: option.value}), {});

	execute({
		name: 'ngNew',
		projectName,
		options: interactive ? {...filterValidOptions(baseOptions)} : {...filterValidOptions(baseOptions), prefix},
	});
}

function runAddMaterial(dir: string): void {
	console.info(`[Info]: Adds Angular Material`);
	execute({
		name: 'npmInstall',
		dependencies: ['@angular/material', '@angular/cdk'],
		spawnSyncOptions: {cwd: dir},
	});
}

function runAddOblique(options: ObNewOptions, projectName: string, workingDirectory: string): void {
	console.info(`[Info]: Adds Oblique`);
	const projectTitle = options.title === projectNamePlaceholder || options.title === '' ? projectName : options.title;
	let commandOptions: ObNewOptions = {...options, title: projectTitle};
	if (options.interactive === true) {
		commandOptions = {} as ObNewOptions;
	}
	const filteredOptions = filterValidOptions(commandOptions);
	const toolchainOptions = filterOptionsByKeys(filteredOptions, toolchainOptionKeys, true);
	const obliqueOptions = filterOptionsByKeys(filteredOptions, obliqueOptionKeys);

	execute({
		name: 'ngAdd',
		dependency: '@oblique/toolchain',
		options: toolchainOptions,
		spawnSyncOptions: {cwd: workingDirectory},
	});
	execute({name: 'ngGenerate', schematic: '@oblique/toolchain:add-oblique', spawnSyncOptions: {cwd: workingDirectory}});
	runAddLinting(options.eslint, filteredOptions, workingDirectory);
	execute({
		name: 'ngAdd',
		dependency: '@oblique/oblique',
		options: obliqueOptions,
		spawnSyncOptions: {cwd: workingDirectory},
	});
}

function runAddLinting(
	shouldAddEslint: ObOptionValueType | undefined,
	filteredOptions: Record<string, string | boolean>,
	workingDirectory: string
): void {
	if (shouldAddEslint) {
		execute({
			name: 'ngGenerate',
			schematic: '@oblique/toolchain:linting',
			options: {prefix: filteredOptions['prefix']},
			spawnSyncOptions: {cwd: workingDirectory},
		});
	}
}

function cleanupDependencies(workingDirectory: string): void {
	console.info(`[Info]: Runs npm dedupe and prune`);
	try {
		execute({name: 'npmDedupe', spawnSyncOptions: {cwd: workingDirectory}});
		execute({name: 'npmPrune', spawnSyncOptions: {cwd: workingDirectory}});
	} catch (error) {
		console.info(error);
	}
}

function formatCode(workingDirectory: string): void {
	console.info(`[Info]: Runs npm format`);
	try {
		execute({name: 'npmFormat', spawnSyncOptions: {cwd: workingDirectory}});
	} catch (error) {
		console.info(error);
	}
}

// filter out option 'interactive' / 'no-interactive' and options without an explicit value
function filterValidOptions(
	commandOptions: Record<string, string | boolean | undefined>
): Record<string, string | boolean> {
	return Object.entries(commandOptions)
		.map(([key, option]) => ({key, value: option}))
		.filter(({key, value}) => !key.includes('interactive') && value !== undefined)
		.reduce((options, option) => ({...options, [option.key]: option.value}), {});
}

/**
 * Creates an option object that only contains entries for the provided keys.
 *
 * Used in `runAddOblique` to split CLI options into `@oblique/toolchain` and
 * `@oblique/oblique` option sets. Undefined values are always removed. When
 * `omitBlankStringValues` is enabled, empty string values are removed as well
 * (e.g. to avoid forwarding blank toolchain option values).
 */
function filterOptionsByKeys(
	options: Record<string, ObOptionValueType>,
	allowedKeys: readonly string[],
	omitBlankStringValues = false
): Record<string, ObOptionValueType> {
	return Object.fromEntries(
		allowedKeys
			.map(key => [key, options[key]] as const)
			.filter(([, value]) => value !== undefined)
			.filter(([, value]) => !omitBlankStringValues || typeof value !== 'string' || value.trim() !== '')
	) as Record<string, ObOptionValueType>;
}

function getApplicationDirectory(projectName: string): string {
	return [process.cwd(), projectName].join('/');
}

function configureCommandOptions(newCommand: Command<[string], OptionValues>): Command<[string], OptionValues> {
	const commandWithOptions = addObNewCommandOptions(schema, newCommand);
	return addImmutableOptionsText(commandWithOptions);
}

function addImmutableOptionsText(command: Command<[string], OptionValues>): Command<[string], OptionValues> {
	command.addHelpText('after', '\nThese options are set per default:\n');
	const padEnd = 36;

	Object.entries(immutableOptions).forEach(([key, flag]) => {
		const flagValue = buildOption(key, flag.value);
		const newFlagValue = `  --${flagValue}`.padEnd(padEnd, ' ');
		command.addHelpText('after', `${newFlagValue} ${flag.description}`);
	});
	return command;
}
