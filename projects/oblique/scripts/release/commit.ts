import {execSync} from 'child_process';

export class Commit {
	static perform(message: string): void {
		execSync(`git commit -am "${message}"`);
	}
}
