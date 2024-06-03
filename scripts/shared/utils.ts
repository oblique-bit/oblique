import {execSync} from 'child_process';

export function executeCommand(command: string, showCommand = false): string {
	if (showCommand) {
		console.info(command);
	}
	return execSync(command).toString().trim();
}
