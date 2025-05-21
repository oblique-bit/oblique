import type {ObCommandConfig, ObOptions} from './ob-cli.model';
import {type ExecSyncOptions, execSync} from 'child_process';
import {gte, major} from 'semver';

/* Generated content, do not edit */
export const version = '13.2.3';
/* End of generated content */

export const currentVersions = {
	'@oblique/oblique': '13',
	'@angular/cli': '19',
	'@angular/material': '19',
	'@angular/core': '19',
	'@types/jest': '29',
	'@angular-builders/jest': '19',
	'@schematics/angular': '19',
	'angular-oauth2-oidc': '19',
	jest: '29'
} as const;

export const optionDescriptions = {
	ob: {
		version: {flags: '-v, --version', description: 'Shows the current version of @oblique/cli', command: 'ob -v'},
		help: {flags: '-h, --help', description: getHelpText('ob'), command: 'ob -h'}
	},
	new: {
		obNewCommand: {command: 'ob new <project-name> [...options]', description: 'Create a new Oblique project'},
		help: {flags: '-h, --help', description: getHelpText('ob new'), command: 'ob new -h'}
	},
	update: {obUpdateCommand: {command: 'ob update', description: 'Update an Oblique project'}}
};

export const ngAddOblique = {command: 'ng add @oblique/oblique', description: 'add Oblique to the project'};

export const obExamples = [
	{command: optionDescriptions.ob.version.command, description: optionDescriptions.ob.version.description},
	{command: optionDescriptions.ob.help.command, description: optionDescriptions.ob.help.description},
	{command: optionDescriptions.new.obNewCommand.command, description: optionDescriptions.new.obNewCommand.description},
	{command: optionDescriptions.new.help.command, description: optionDescriptions.new.help.description},
	{command: optionDescriptions.update.obUpdateCommand.command, description: optionDescriptions.update.obUpdateCommand.description}
];

const spaceUnit = `\t`;
export const projectNamePlaceholder = `<project-name>`;

export const runObCommand = (): void => {
	console.info(
		`\n${spaceUnit}Use \`ob new ${projectNamePlaceholder}\` to create a new project\n` +
			`${spaceUnit}Use \`ob --help\` to explore the available commands\n` +
			`${spaceUnit}Or use \`ob new --help\` to explore the available options for the ob new command\n`
	);
};

export const obTitle = `Oblique Cli`;

export const recommendedVersion = 20;
export const minimumSupportedVersion = '18.3.0';

export function getHelpText(command: 'ob' | 'ob new' | 'ob update'): string {
	return `Shows a help message for the "${command}" command in the console`;
}

export function checkNodeVersion(): void {
	console.info('Checks your node version');
	if (!isNodeVersionSupported(minimumSupportedVersion)) {
		console.error(
			`Error: Oblique CLI requires Node.js v${minimumSupportedVersion} or higher. You are using v${process.versions.node}. Please upgrade.`
		);
		process.exit(1);
	} else if (!isNodeVersionRecommended(recommendedVersion)) {
		console.warn(
			`Warning: Oblique CLI was tested with Node.js v${recommendedVersion}, but you are using v${process.versions.node}. Compatibility issues may occur.`
		);
	}
}

export const startObCommand = <T>(callback: (options: T) => void, label: string, options: T): void => {
	console.info(`${obTitle.toUpperCase()} ${printCliVersion()}`);
	checkNodeVersion();
	console.time(label);
	callback(options);
	console.timeEnd(label);
};

export function commandUsageText(subCommand: '<command>' | 'new' | 'update' = '<command>', option = '[...options]'): string {
	if (subCommand === 'new') {
		return `${projectNamePlaceholder} ${option}`;
	}
	return subCommand === 'update' ? option : `${subCommand} ${option}`;
}

export function exampleUsageText(examples: {command: string; description: string}[]): string {
	const title = '\nExamples of use:\n';
	return [title, examples.map(example => `${spaceUnit}${example.command}${example.description}`).join('\n')].join('');
}
const paddingSize = 5;
export function createAdditionalHelpText(
	title: string,
	examples: {command: string; description: string}[],
	maxCommandWidth: number
): string {
	return [
		title,
		examples.map(example => `${spaceUnit}${example.command.padEnd(maxCommandWidth + paddingSize, ' ')}${example.description}`).join('\n')
	].join('');
}

export function titleText(title: string, delimiterStart = '\n', delimiterEnd = '\n'): string {
	return `${delimiterStart}${title}${delimiterEnd}`;
}

export function getVersionedDependency(dependency: keyof typeof currentVersions): string {
	return `${dependency}@${currentVersions[dependency]}`;
}

export function buildOption(key: string, value: string | boolean): string {
	if (typeof value === 'string') {
		return `${key}="${value}"`;
	}
	return value ? key : `no-${key}`;
}

export function execute(config: ObCommandConfig): void {
	switch (config.name) {
		case 'ngNew':
			return executeNgCommand(`new ${config.projectName}`, config.options, config.execSyncOptions);
		case 'ngAdd':
			return executeNgCommand(`add ${getVersionedDependency(config.dependency)}`, config.options, config.execSyncOptions);
		case 'ngUpdate':
			return executeNgCommand(
				`update ${versionDependencies(config.dependencies).join(' ')}`,
				{'allow-dirty': true},
				config.execSyncOptions
			);
		case 'npmInstall':
			return executeCommand(`npm install ${versionDependencies(config.dependencies).join(' ')}`, config.execSyncOptions);
		case 'npmUpdate':
			return executeCommand('npm update --save', config.execSyncOptions);
		case 'npmDedupe':
			return executeCommand(`npm dedupe`, config.execSyncOptions);
		case 'npmPrune':
			return executeCommand('npm prune', config.execSyncOptions);
		case 'npmOutdated':
			return executeCommand('npm outdated', config.execSyncOptions);
	}
}

function isNodeVersionRecommended(recommendedNodeMajorVersion: number): boolean {
	const currentNodeVersion: string = process.versions.node;
	return major(currentNodeVersion) === recommendedNodeMajorVersion;
}

function isNodeVersionSupported(minimumSupportedNodeVersion: string): boolean {
	const currentNodeVersion: string = process.versions.node;
	return gte(currentNodeVersion, minimumSupportedNodeVersion);
}

function executeNgCommand(command: string, options: ObOptions = {}, execSyncOptions: ExecSyncOptions = {}): void {
	const parsedOptions = Object.entries<string | boolean>(options).map(([key, value]) => `--${buildOption(key, value)}`);
	executeCommand(['npx', getVersionedDependency('@angular/cli'), command, ...parsedOptions].join(' '), execSyncOptions);
}

function executeCommand(command: string, execSyncOptions: ExecSyncOptions = {}): void {
	execSync(command, {stdio: 'inherit', ...execSyncOptions});
}

function versionDependencies(dependencies: (keyof typeof currentVersions)[]): string[] {
	return dependencies.map(dependency => getVersionedDependency(dependency));
}

function printCliVersion(): string {
	return `v${version}`;
}
