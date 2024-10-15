#!/usr/bin/env node

export const optionDescriptions = {
	ob: {
		version: {
			flags: '-v, --version',
			description: 'Shows the current version of @oblique/cli',
			command: 'ob -v'
		},
		help: {
			flags: '-h, --help',
			description: getHelpText('ob'),
			command: 'ob -h'
		}
	}
};

export const obExamples = [
	{command: optionDescriptions.ob.version.command, description: optionDescriptions.ob.version.description},
	{command: optionDescriptions.ob.help.command, description: optionDescriptions.ob.help.description}
];

const spaceUnit = `  `;
const projectNamePlaceholder = `<project-name>`;

export const runObCommand = (): void => {
	console.info(
		`\n${spaceUnit}Use \`ob new ${projectNamePlaceholder}\` to create a new project\n` +
			`${spaceUnit}Use \`ob --help\` to explore the available commands\n`
	);
};

export const obTitle = `Oblique Cli`;

export function getHelpText(command: 'ob'): string {
	return `Shows a help message for the "${command}" command in the console.`;
}

export const startObCommand = <T>(callback: (options: T) => void, label: string, options: T): void => {
	console.info(obTitle.toUpperCase());
	console.time(label);
	callback(options);
	console.timeEnd(label);
};

export function commandUsageText(subCommand: '<command>' | 'new' | 'update' = '<command>', option = '[option]'): string {
	return `${subCommand} ${option}`;
}

export function exampleUsageText(examples: {command: string; description: string}[]): string {
	const title = '\nExamples of use:\n';
	return [title, examples.map(example => `${spaceUnit}${example.command}${example.description}`).join('\n')].join('');
}
const PADDING_SIZE = 5;
export function createAdditionalHelpText(
	title: string,
	examples: {command: string; description: string}[],
	maxCommandWidth: number
): string {
	return [
		title,
		examples.map(example => `${spaceUnit}${example.command.padEnd(maxCommandWidth + PADDING_SIZE, ' ')}${example.description}`).join('\n')
	].join('');
}

export function titleText(title: string, delimiterStart = '\n', delimiterEnd = '\n'): string {
	return `${delimiterStart}${title}${delimiterEnd}`;
}
