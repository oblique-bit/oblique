import {execSync} from 'child_process';
import {readdirSync, statSync} from 'fs';
import path from 'path';

export function executeCommand(command: string, showCommand = false): string {
	if (showCommand) {
		console.info(command);
	}
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
