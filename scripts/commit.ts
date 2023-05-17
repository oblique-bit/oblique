import {execSync} from 'child_process';

export class Commit {
	static perform(header: string): void {
		const issueNumber = (/OUI-\d+/.exec(execSync('git branch --show-current').toString()) ?? [])[0];
		const message = issueNumber ? `${header}\n\n${issueNumber}` : header;
		execSync(`git commit -am "${message}"`);
	}
}
