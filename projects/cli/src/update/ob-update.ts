import {Command, OptionValues} from '@commander-js/extra-typings';
import * as path from 'node:path';
import fs from 'node:fs';
import {execSync} from 'node:child_process';
import {commandUsageText, currentVersions, getHelpText, getVersionedDependency, ngAddOblique, startObCommand} from '../utils/cli-utils';
import {PackageDependencies, updateDescriptions} from './ob-update.model';
import chalk from 'chalk';

export function createObUpdateCommand(): Command<[string], OptionValues> {
	const command = new Command<[string], OptionValues>();
	return initializeCommand(command);
}

export function initializeCommand(command: Command<[string], OptionValues>): Command<[string], OptionValues> {
	command
		.name('update')
		.helpOption('-h, --help', getHelpText('ob update'))
		.usage(commandUsageText('update', ' '))
		.summary(updateDescriptions.summaryText)
		.action(() => handleAction())
		.showSuggestionAfterError(true)
		.showHelpAfterError(true);
	return command;
}

function handleAction(): void {
	startObCommand(handleObUpdateActions as (options: undefined) => void, 'Oblique CLI ob update completed in', undefined);
}

export function handleObUpdateActions(): void {
	try {
		checkNeededDependencies();
		runUpdateDependencies();
		runUpdateSave();
	} catch (error) {
		console.error(chalk.red('Update failed: '), error);
		process.exit(1);
	}
	// this have to be done at the end, because npm outdated exits with a non-zero exit code (status: 1 in the output) which causes execSync to throw  and catch an error.
	outputOutdatedDependencies();
}

export function checkNeededDependencies(): void {
	if (!isDependencyInPackage('@oblique/oblique')) {
		console.error(
			chalk.red(`Package @oblique/oblique not found. Please install Oblique with '${ngAddOblique.command}' to ${ngAddOblique.description}.`)
		);
		process.exit(1);
	}
}

export function runUpdateDependencies(): void {
	try {
		const dependencies: string[] = [];
		for (const dependency of Object.keys(currentVersions) as (keyof typeof currentVersions)[]) {
			if (isDependencyInPackage(dependency)) {
				dependencies.push(getVersionedDependency(dependency));
			}
		}
		const npxCommand = `npx ${getVersionedDependency('@angular/cli')} update ${dependencies.join(' ')}`;
		execSync(npxCommand, {stdio: 'inherit', cwd: process.cwd()});
	} catch (error) {
		console.error(error);
	}
}

function runUpdateSave(): void {
	let result = '';
	console.info(chalk.blue('[Info]: Runs npm update'));
	try {
		result = execSync(`npm update --save`, {stdio: 'inherit', cwd: process.cwd(), encoding: undefined}).toString();
	} catch (ex) {
		console.info(result);
	}
}

export function outputOutdatedDependencies(): void {
	console.info(chalk.blue('[Info]: Following dependencies should also be manually updated.\n'));
	let result = '';
	try {
		result = execSync('npm outdated', {stdio: 'inherit', cwd: process.cwd(), encoding: undefined}).toString();
	} catch (ex) {
		console.info(result);
	}
}

export function isDependencyInPackage(dependency: keyof typeof currentVersions): boolean {
	try {
		const packageJson: PackageDependencies = findPackage();
		const dependencies = packageJson.dependencies ?? {};
		const devDependencies = packageJson.devDependencies ?? {};
		return dependency in dependencies || dependency in devDependencies;
	} catch (error) {
		console.error(chalk.red(`[Error]: This command is not available when running the Oblique CLI outside a workspace`), error);
		/* eslint-disable @typescript-eslint/no-magic-numbers */
		process.exit(3);
		/* eslint-enable @typescript-eslint/no-magic-numbers */
	}
	return false;
}

export function findPackage(): PackageDependencies {
	const packageJsonPath: string = path.resolve(process.cwd(), 'package.json');
	if (packageJsonPath) {
		return JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')) as PackageDependencies;
	}
	throw new Error(
		`Cant find the package.json at path: ${[process.cwd(), 'package.json'].join('/')}. Please navigate to the level of your package.json and try "ob update" again.`
	);
}
