import {Command, OptionValues} from '@commander-js/extra-typings';
import {buildOption, commandUsageText, execute, optionDescriptions, projectNamePlaceholder, startObCommand} from '../utils/cli-utils';
import {addObNewCommandOptions, convertOptionPropertyNames} from '../utils/ob-configure-command';
import {
	HandleObNewActionOptions,
	ObNewOptions,
	createsWorkspaceMessage,
	immutableOptions,
	obNewConfig,
	schema,
	version
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
	const cmdOptions: ObNewOptions<string | boolean> = convertOptionPropertyNames(options.command.opts() as ObNewOptions<string | boolean>);
	try {
		runNgNewAngularWorkspace(options.projectName, cmdOptions.prefix as string);
		runAddOblique(cmdOptions, options.projectName);
	} catch (error) {
		console.error('Installation failed: ', error);
	}
}

function runNgNewAngularWorkspace(projectName: string, prefix: string | 'app'): void {
	console.info(createsWorkspaceMessage);
	const baseOptions = Object.entries(immutableOptions)
		.map(([key, option]) => ({key, value: option.value}))
		.reduce((options, option) => ({...options, [option.key]: option.value}), {});
	execute({name: 'ngNew', projectName, options: {...baseOptions, prefix}});
}

function runAddOblique(options: ObNewOptions<string | boolean>, projectName: string): void {
	const dir: string = getApplicationDirectory(projectName);
	installMaterial(dir);
	const projectTitle = options.title === projectNamePlaceholder || options.title === '' ? projectName : options.title;
	execute({name: 'ngAdd', dependency: '@oblique/oblique', options: {...options, title: projectTitle}, execSyncOptions: {cwd: dir}});
	console.info(`[Complete]: Oblique added`);
}

function getApplicationDirectory(projectName: string): string {
	return [process.cwd(), projectName].join('/');
}

function installMaterial(dir: string): void {
	console.info(`[Info]: Installs Angular Material`);
	execute({name: 'npmInstall', dependencies: ['@angular/material'], execSyncOptions: {cwd: dir}});
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
