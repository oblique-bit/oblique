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
		runAddOblique(cmdOptions, options.projectName);
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

function runAddOblique(options: ObNewOptions<string | boolean>, projectName: string): void {
	const dir: string = getApplicationDirectory(projectName);
	installMaterial(dir);
	installCdkAndAnimations(dir);
	const projectTitle = options.title === projectNamePlaceholder || options.title === '' ? projectName : options.title;
	let commandOptions: ObNewOptions<string | boolean> = {...options, title: projectTitle};
	if (options.interactive === true) {
		commandOptions = {} as ObNewOptions<string | boolean>;
	}
	const filteredOptions = filterValidOptions(commandOptions);

	execute({name: 'ngAdd', dependency: '@oblique/oblique', options: filteredOptions, execSyncOptions: {cwd: dir}});
	runNpmDedupe();
	runNpmPrune();
	console.info(`[Complete]: Oblique added`);
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

function installMaterial(dir: string): void {
	console.info(`[Info]: Installs Angular Material`);
	execute({name: 'npmInstall', dependencies: ['@angular/material'], execSyncOptions: {cwd: dir}});
}

function installCdkAndAnimations(dir: string): void {
	console.info(`[Info]: Installs @angular/cdk and @angular/animations`);
	execute({name: 'npmInstall', dependencies: ['@angular/cdk', '@angular/animations'], execSyncOptions: {cwd: dir}});
}

function runNpmDedupe(): void {
	console.info('[Info]: Runs npm dedupe');
	try {
		execute({name: 'npmDedupe'});
	} catch (error) {
		console.info(error);
	}
}

function runNpmPrune(): void {
	console.info('[Info]: Runs npm prune');
	try {
		execute({name: 'npmPrune'});
	} catch (error) {
		console.info(error);
	}
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
