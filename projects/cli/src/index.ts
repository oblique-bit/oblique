#!/usr/bin/env node

import {program} from '@commander-js/extra-typings';
import * as cliPackage from '../package.json';
import {exampleUsageText, obTitle, obUsageText, optionDescriptions, runObCommand, startObCommand, titleText} from './utils/cli-utils';

program
	.name('ob')
	.description(cliPackage.description)
	.version(cliPackage.version, optionDescriptions.ob.version.flags, optionDescriptions.ob.version.description)
	.helpOption(optionDescriptions.ob.help.flags, optionDescriptions.ob.help.description)
	.usage(obUsageText)
	.addHelpText('beforeAll', titleText(`How to use the ${obTitle}`.toUpperCase(), ''))
	.addHelpText(
		'after',
		exampleUsageText([
			{command: optionDescriptions.ob.version.command, description: optionDescriptions.ob.version.description},
			{command: optionDescriptions.ob.help.command, description: optionDescriptions.ob.help.description}
		])
	)
	.action(handleAction)
	.showSuggestionAfterError(true)
	.showHelpAfterError(true);

program.parse();

function handleAction(options: Record<string, string>): void {
	startObCommand(options, runObCommand, 'Oblique CLI completed in');
}
