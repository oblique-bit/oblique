import {execSync} from 'child_process';
import {writeFileSync} from 'fs';
import path from 'path';
import {Changelog} from './changelog';

class Release {
	static perform(): void {
		const nextVersion = Release.getVersionFromBranchName();
		Release.bumpVersion(nextVersion);
		Changelog.perform();
	}

	private static getVersionFromBranchName(): string {
		const branchName = execSync('git rev-parse --abbrev-ref HEAD').toString();
		const regexp = /\d+\.\d+\.\d+(?:-(?:alpha|beta|RC)\.\d+)?/;
		if (!regexp.test(branchName)) {
			console.error('The branch MUST contain the version number to release');
			throw new Error('Version number not found');
		}
		return regexp.exec(branchName).toString();
	}

	private static bumpVersion(version: string): void {
		process.chdir('../..'); // so that the release is made with the info of the root package.json
		execSync(`npm version ${version}`);
		writeFileSync(path.join('projects', 'oblique', 'src', 'lib', 'version.ts'), `export const appVersion = '${version}';\n`, {flag: 'w'});
	}
}

Release.perform();
