#!/usr/bin/env node

import {program} from '@commander-js/extra-typings';
import * as cliPackage from '../package.json';
import {exampleUsageText, obTitle, obUsageText, optionDescriptions, runObCommand, startObCommand, titleText} from './utils/cli-utils';

program
	.name('ob')
	.description(cliPackage.description)
	.version(cliPackage.version, optionDescriptions.version.flags, optionDescriptions.version.description)
	.helpOption(optionDescriptions.help.flags, optionDescriptions.help.description)
	.usage(obUsageText)
	.addHelpText('beforeAll', titleText(`How to use the ${obTitle}`.toUpperCase(), ''))
	.addHelpText(
		'after',
		exampleUsageText([
			{command: optionDescriptions.version.command, description: optionDescriptions.version.description},
			{command: optionDescriptions.help.command, description: optionDescriptions.help.description}
		])
	)
	.action(handleAction)
	.showSuggestionAfterError(true)
	.showHelpAfterError(true);

program.parse();

function handleAction(options: Record<string, string>): void {
	startObCommand(options, runObCommand, 'Oblique CLI completed in');
}
