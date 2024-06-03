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
