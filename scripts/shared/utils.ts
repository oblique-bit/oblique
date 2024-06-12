import {execSync} from 'child_process';
import {readFileSync, readdirSync, statSync, writeFileSync} from 'fs';
import path from 'path';

export function executeCommand(command: string, showCommandResult = false): void {
	if (showCommandResult) {
		console.info(command);
	}
	execSync(command, showCommandResult ? {stdio: 'inherit'} : undefined);
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
	return process.argv.some(arg => arg === flag);
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
