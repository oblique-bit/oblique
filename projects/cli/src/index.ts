#!/usr/bin/env node

import {program} from '@commander-js/extra-typings';
import * as cliPackage from '../package.json';
import {createObNewCommand} from './new/ob-new';
import {
	commandUsageText,
	createAdditionalHelpText,
	obExamples,
	obTitle,
	optionDescriptions,
	runObCommand,
	startObCommand,
	titleText
} from './utils/cli-utils';

program
	.name('ob')
	.description(cliPackage.description)
	.version(cliPackage.version, optionDescriptions.ob.version.flags, optionDescriptions.ob.version.description)
	.helpOption(optionDescriptions.ob.help.flags, optionDescriptions.ob.help.description)
	.usage(commandUsageText('<command>'))
	.addHelpText('beforeAll', titleText(`How to use the ${obTitle}`.toUpperCase(), ''))
	.addHelpText('after', createAdditionalHelpText('\nExample usages:\n', obExamples, getMaxCommandLength(obExamples)))
	.action(handleAction)
	.showSuggestionAfterError(true)
	.showHelpAfterError('(Add --help for additional information)');

const obNewCommandConfigured = createObNewCommand();

program.addCommand(obNewCommandConfigured);

program.parse();

export function handleAction(options: Record<string, string>): void {
	startObCommand(runObCommand, 'Oblique CLI completed in', options);
}

export function getMaxCommandLength(examples: {command: string; description: string}[]): number {
	return examples.map(entry => entry.command.length).reduce((max, length) => (length > max ? length : max), 0);
}
