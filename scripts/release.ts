import {execSync} from 'child_process';
import {readFileSync, writeFileSync} from 'fs';
import {executeCommand} from './shared/utils';

class Release {
	static perform(): void {
		const {version, issue} = Release.parseBranchName();
		executeCommand(`npm version ${version}`, true);
		Release.updateCopyrightDate();
		executeCommand(`npm run release -w @oblique/oblique`);
		executeCommand(`git commit -am "chore(toolchain): release version ${version}" -m "${issue}"`);
	}

	private static parseBranchName(): {version: string; issue: string} {
		const branchName = Release.execute('git branch --show-current');
		const regexp = /(?<issue>OUI-\d+).*?(?<version>\d+\.\d+\.\d+(?:-(?:alpha|beta|RC)\.\d+)?)/;
		if (!regexp.test(branchName)) {
			console.error('The branch MUST contain the version number to release and the Jira issue number');
			throw new Error('Version or Issue number not found');
		}
		return regexp.exec(branchName).groups as {version: string; issue: string};
	}

	private static updateCopyrightDate(): void {
		const licensePath = 'LICENSE';
		writeFileSync(
			licensePath,
			readFileSync(licensePath)
				.toString()
				.replace(/(?!2020-)\d{4}/, new Date().getFullYear().toString())
		);
	}

	private static execute(command: string): string {
		return execSync(command).toString();
	}
}

Release.perform();
