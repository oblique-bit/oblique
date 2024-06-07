import {readFileSync, writeFileSync} from 'fs';
import path from 'path';
import {executeCommand} from '../../../scripts/shared/utils';
import {Changelog} from '../../../scripts/shared/changelog';

class Release {
	static perform(): void {
		const {version, issue} = Release.parseBranchName();
		Release.bumpVersion(version);
		Changelog.update(version, 'oblique');
		Release.updateCopyrightDate();
		Release.commit(version, issue);
	}

	private static parseBranchName(): {version: string; issue: string} {
		const branchName = executeCommand('git branch --show-current');
		const regexp = /(?<issue>OUI-\d+).*?(?<version>\d+\.\d+\.\d+(?:-(?:alpha|beta|RC)\.\d+)?)/;
		if (!regexp.test(branchName)) {
			console.error('The branch MUST contain the version number to release and the Jira issue number');
			throw new Error('Version or Issue number not found');
		}
		return regexp.exec(branchName).groups as {version: string; issue: string};
	}

	private static bumpVersion(version: string): void {
		process.chdir('../..'); // so that the release is made with the info of the root package.json
		executeCommand(`npm version ${version}`, true);
		writeFileSync(path.join('projects', 'oblique', 'src', 'lib', 'version.ts'), `export const appVersion = '${version}';\n`);
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

	private static commit(version: string, issue: string): void {
		executeCommand(`git commit -am "chore(toolchain): release version ${version}" -m "${issue}"`, true);
	}
}

Release.perform();
