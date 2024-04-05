import {execSync} from 'child_process';
import {writeFileSync} from 'fs';
import path from 'path';
import {Changelog} from './changelog';

class Release {
	static perform(): void {
		const {version, issue} = Release.parseBranchName();
		Release.bumpVersion(version);
		Changelog.perform();
		Release.commit(version, issue);
	}

	private static parseBranchName(): {version: string; issue: string} {
		const branchName = execSync('git rev-parse --abbrev-ref HEAD').toString();
		const regexp = /(?<issue>OUI-\d+).*?(?<version>\d+\.\d+\.\d+(?:-(?:alpha|beta|RC)\.\d+)?)/;
		if (!regexp.test(branchName)) {
			console.error('The branch MUST contain the version number to release and the Jira issue number');
			throw new Error('Version or Issue number not found');
		}
		return regexp.exec(branchName).groups as {version: string; issue: string};
	}

	private static bumpVersion(version: string): void {
		process.chdir('../..'); // so that the release is made with the info of the root package.json
		execSync(`npm version ${version}`);
		writeFileSync(path.join('projects', 'oblique', 'src', 'lib', 'version.ts'), `export const appVersion = '${version}';\n`, {flag: 'w'});
	}

	private static commit(version: string, issue: string): void {
		execSync(`git commit -am "chore(toolchain): release version ${version}" -m "${issue}"`);
	}
}

Release.perform();
