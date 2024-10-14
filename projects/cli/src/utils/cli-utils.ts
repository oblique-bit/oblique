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
export const obUsageText: string = commandUsageText();

export const runObCommand = (): void => {
	console.info('\nOblique CLI is running now!\n');
};

export const obTitle = `Oblique Cli`;
const spaceUnit = `  `;
const tabulatorAmount = 2;
const defaultTabulatorSpace: string = `\t`.repeat(tabulatorAmount);

export function getHelpText(command: 'ob'): string {
	return `Shows a help message for the "${command}" command in the console.`;
}

export const startObCommand = (
	options: Record<string, string>,
	callback: (options: Record<string, string>) => void,
	label: string
): void => {
	console.info(titleText(obTitle.toUpperCase(), '', ' '));
	console.time(label);
	callback(options);
	console.timeEnd(label);
};

export function commandUsageText(subCommand: '<command>' | 'new' | 'update' = '<command>', option = '[option]'): string {
	return `${subCommand} ${option}`;
}

export function exampleUsageText(examples: {command: string; description: string}[]): string {
	const title = '\nExamples of use:\n';
	return [title, examples.map(example => `${spaceUnit}${example.command}${defaultTabulatorSpace}${example.description}`).join('\n')].join(
		''
	);
}

export function titleText(title: string, delimiterStart = '\n', delimiterEnd = '\n'): string {
	return `${delimiterStart}${title}${delimiterEnd}`;
}
