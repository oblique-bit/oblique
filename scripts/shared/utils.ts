import {execSync} from 'child_process';
import {readFileSync, readdirSync, statSync, writeFileSync} from 'fs';
import path from 'path';
import {Log} from './log';

export function executeCommand(command: string, showCommandResult = false): void {
	if (showCommandResult) {
		console.info(command);
	}
	execSync(command, showCommandResult ? {stdio: 'inherit'} : undefined);
}

export function executeCommandWithLog(command: string, messagePrefix: string): void {
	Log.info(`${messagePrefix}: ${command}`);
	try {
		execSync(command, {stdio: 'pipe'});
	} catch (rawError) {
		const error = rawError as {stdout: Buffer; stderr: Buffer};
		const buffer = error.stdout?.length ? error.stdout : error.stderr;
		fatal(buffer.toString());
	}
}

export function getResultFromCommand(command: string): string {
	return execSync(command).toString().trim();
}

export function listFiles(directory: string): string[] {
	return readdirSync(directory)
		.map(fileName => path.join(directory, fileName))
		.reduce<string[]>(
			(filePaths, filePath) => (statSync(filePath).isDirectory() ? [...filePaths, ...listFiles(filePath)] : [...filePaths, filePath]),
			[]
		);
}

export function hasFlag(flag: string): boolean {
	return process.argv.some(arg => arg === `--${flag}`);
}

export function camelToKebabCase(key: string): string {
	return key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
}

export function buildPath(...pathParts: string[]): string {
	return path.join(...pathParts.filter(part => !!part));
}

export function updatePackageJsonVersion(version: string): void {
	const fileContent = JSON.parse(readFileSync('package.json').toString()) as Record<'version', string>;
	fileContent.version = version;
	writeFileSync('package.json', JSON.stringify(fileContent, null, 2));
}

export function updateSonarPropertiesVersion(version: string): void {
	const filePath = 'sonar-project.properties';
	writeFileSync(
		filePath,
		readFileSync(filePath)
			.toString()
			.replace(/(?<=sonar\.projectVersion=)\d+\.\d+\.\d+/, version)
	);
}

export function adaptReadmeLinks(project: string): void {
	const filePath = path.join('..', '..', 'dist', project, 'README.md');
	writeFileSync(
		filePath,
		readFileSync(filePath)
			.toString()
			.replace('../../README.md)', 'https://github.com/oblique-bit/oblique/blob/master/README.md) on GitHub')
			.replace('../../CONTRIBUTING.md)', 'https://github.com/oblique-bit/oblique/blob/master/CONTRIBUTING.md) on GitHub')
			.replace('../../LICENSE', 'LICENSE')
	);
}

export function humanizeList(list: string[]): string {
	return list.join(', ').replace(/,(?=[^,]*$)/, ' and');
}

export function fatal(error: string): void {
	Log.error(error);
	process.exit(-1);
}
