#!/usr/bin/env node

import * as packageFile from '../package.json';
import {Command} from 'commander';

new Command()
	.name('ob')
	.description('Oblique CLI for managing projects')
	.version(packageFile.version)
	.usage(
		'new <project-name>\t\t\tCreates a new project in current place\n' +
			'or \n' +
			'ob update <project-name>\t\t\tUpdates the oblique package in the project and runs migration\n'
	)
	.action(() => {
		console.info('Starts Oblique CLI');
	})
	.showSuggestionAfterError(true)
	.showHelpAfterError(true)
	.parse();
