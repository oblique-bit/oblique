import {Command, type OptionValues} from '@commander-js/extra-typings';
import {
	buildOption,
	commandUsageText,
	execute,
	optionDescriptions,
	projectNamePlaceholder,
	startObCommand,
	version
} from '../utils/cli-utils';
import {addObNewCommandOptions, convertOptionPropertyNames} from '../utils/ob-configure-command';
import {
	type HandleObNewActionOptions,
	type ObNewOptions,
	createsWorkspaceMessage,
	immutableOptions,
	obNewConfig,
	schema
} from './ob-new.model';

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
	startObCommand(handleObNewActions as (options: HandleObNewActionOptions) => void, 'Oblique CLI ob new completed in', options);
}

function handleObNewActions(options: HandleObNewActionOptions): void {
	let cmdOptions: ObNewOptions<string | boolean> = convertOptionPropertyNames(options.command.opts() as ObNewOptions<string | boolean>);
	cmdOptions = (cmdOptions.interactive as boolean) ? ({interactive: true} as ObNewOptions<string | boolean>) : cmdOptions;
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
		options: interactive ? {...filterValidOptions(baseOptions)} : {...filterValidOptions(baseOptions), prefix}
	});
}

function runAddMaterial(dir: string): void {
	console.info(`[Info]: Adds Angular Material`);
	execute({name: 'npmInstall', dependencies: ['@angular/material', '@angular/cdk', '@angular/animations'], execSyncOptions: {cwd: dir}});
}

function runAddOblique(options: ObNewOptions<string | boolean>, projectName: string, workingDirectory: string): void {
	const projectTitle = options.title === projectNamePlaceholder || options.title === '' ? projectName : options.title;
	let commandOptions: ObNewOptions<string | boolean> = {...options, title: projectTitle};
	if (options.interactive === true) {
		commandOptions = {} as ObNewOptions<string | boolean>;
	}
	const filteredOptions = filterValidOptions(commandOptions);

	execute({name: 'ngAdd', dependency: '@oblique/toolchain', execSyncOptions: {cwd: workingDirectory}});
	execute({name: 'ngAdd', dependency: '@oblique/oblique', options: filteredOptions, execSyncOptions: {cwd: workingDirectory}});
	console.info(`[Complete]: Oblique added`);
}

function cleanupDependencies(workingDirectory: string): void {
	console.info(`[Info]: Runs npm dedupe and prune`);
	try {
		execute({name: 'npmDedupe', execSyncOptions: {cwd: workingDirectory}});
		execute({name: 'npmPrune', execSyncOptions: {cwd: workingDirectory}});
	} catch (error) {
		console.info(error);
	}
}

function formatCode(workingDirectory: string): void {
	console.info(`[Info]: Runs npm format`);
	try {
		execute({name: 'npmFormat', execSyncOptions: {cwd: workingDirectory}});
	} catch (error) {
		console.info(error);
	}
}

// filter out option 'interactive' or 'no-interactive'
function filterValidOptions(commandOptions: Record<string, string | boolean>): Record<string, string | boolean> {
	return Object.entries(commandOptions)
		.map(([key, option]) => ({key, value: option}))
		.filter(({key}) => !key.includes('interactive'))
		.reduce((options, option) => ({...options, [option.key]: option.value}), {});
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
