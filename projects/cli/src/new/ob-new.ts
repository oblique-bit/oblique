import {Command, OptionValues} from '@commander-js/extra-typings';
import {execSync} from 'child_process';
import {
	buildOption,
	commandUsageText,
	getVersionedDependency,
	optionDescriptions,
	projectNamePlaceholder,
	startObCommand
} from '../utils/cli-utils';
import {addObNewCommandOptions, convertOptionPropertyNames} from '../utils/ob-configure-command';
import {
	HandleObNewActionOptions,
	ObNewOptions,
	ObNewSchemaOption,
	createsWorkspaceMessage,
	immutableOptions,
	ngAddStringCommand,
	obNewConfig,
	schema,
	version
} from './ob-new.model';

export function createObNewCommand(): Command<[string], OptionValues> {
	const command = new Command<[string], OptionValues>();
	const initializedCommand: Command<[string], OptionValues> = initializeCommand(command);
	return configureCommandOptions(initializedCommand);
}

export function handleObNewActions(options: HandleObNewActionOptions): void {
	const cmdOptions: ObNewOptions<string | boolean> = convertOptionPropertyNames(options.command.opts() as ObNewOptions<string | boolean>);
	try {
		runNgNewAngularWorkspace(options.projectName, cmdOptions.prefix as string);
		runAddOblique(cmdOptions, options.projectName);
	} catch (error) {
		console.error('Installation failed: ', error);
	}
}

export function createAddObliqueCommand(
	command: string,
	options: Record<string, string | boolean | ObNewSchemaOption>,
	projectName: string
): string {
	const commandOptions: string[] = [];
	const properties = schema.properties as Record<string, ObNewSchemaOption>;
	for (const [key, value] of Object.entries(options)) {
		const propertyOptions: ObNewSchemaOption = properties[key];
		if (Object.prototype.hasOwnProperty.call(propertyOptions, 'type')) {
			const optionsList: string[] =
				propertyOptions.type === 'boolean'
					? addBooleanFlag(key, value as boolean)
					: addStringFlag({key, value: value as string}, projectName, propertyOptions);
			commandOptions.push(...optionsList);
		}
	}
	return [command, ...commandOptions].join(' ');
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

export function handleAction(options: HandleObNewActionOptions): void {
	startObCommand(handleObNewActions as (options: HandleObNewActionOptions) => void, 'Oblique CLI ob new completed in', options);
}

function configureCommandOptions(newCommand: Command<[string], OptionValues>): Command<[string], OptionValues> {
	const commandWithOptions = addObNewCommandOptions(schema, newCommand);
	return addImmutableOptionsText(commandWithOptions);
}

export function addImmutableOptionsText(command: Command<[string], OptionValues>): Command<[string], OptionValues> {
	command.addHelpText('after', '\nThese options are set per default:\n');
	const padEnd = 36;

	Object.entries(immutableOptions).forEach(([key, flag]) => {
		const flagValue = buildOption(key, flag.value);
		const newFlagValue = `  --${flagValue}`.padEnd(padEnd, ' ');
		command.addHelpText('after', `${newFlagValue} ${flag.description}`);
	});
	return command;
}

function getApplicationDirectory(projectName: string): string {
	return [process.cwd(), projectName].join('/');
}

export function runAddOblique(options: ObNewOptions<string | boolean>, projectName: string): void {
	const command = createAddObliqueCommand(ngAddStringCommand, options, projectName);
	const dir: string = getApplicationDirectory(projectName);
	installMaterial(dir);
	execSync(command, {stdio: 'inherit', cwd: dir});
	console.info(`[Complete]: Oblique added`);
}

function installMaterial(dir: string): void {
	console.info(`[Info]: Installs Angular Material`);
	execSync(`npm install ${getVersionedDependency('@angular/material')}`, {stdio: 'inherit', cwd: dir});
}

export function runNgNewAngularWorkspace(projectName?: string, prefix?: string | 'app'): void {
	console.info(createsWorkspaceMessage);
	const options: string[] = [];
	Object.entries(immutableOptions).forEach(([key, flag]) => {
		options.push(`--${buildOption(key, flag.value)}`);
	});
	execSync(`npx ${getVersionedDependency('@angular/cli')} new ${projectName} ${options.join(' ')} --prefix=${prefix}`, {
		stdio: 'inherit',
		cwd: process.cwd()
	});
}

function addBooleanFlag(key: string, value: boolean): string[] {
	const commandOptions: string[] = [];
	if (value) {
		commandOptions.push(`--${key}`);
	} else {
		commandOptions.push(`--no-${key}`);
	}
	return commandOptions;
}

export function getTitlesCommandOption(option: {key: string; value: string}, projectName: string): string {
	if (option.key === 'title') {
		if (option.value === projectNamePlaceholder || option.value === '') {
			return `--${option.key}="${projectName}"`;
		}
		return `--${option.key}="${option.value}"`;
	}
	return '';
}

export function addStringFlag(option: {key: string; value: string}, projectName: string, property: ObNewSchemaOption): string[] {
	const commandOptions: string[] = [];
	if (Object.prototype.hasOwnProperty.call(property, 'type') && property.type === 'string') {
		if (option.key === 'title') {
			commandOptions.push(getTitlesCommandOption(option, projectName));
		} else {
			commandOptions.push(`--${option.key}="${option.value}"`);
		}
	}
	return commandOptions;
}
