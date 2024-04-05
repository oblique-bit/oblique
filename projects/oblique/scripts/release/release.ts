import {execSync} from 'child_process';
import {writeFileSync} from 'fs';
import path from 'path';
import {Changelog} from './changelog';
import {version as packageVersion} from '../../../../package.json';

interface Version {
	version: string;
	preVersionType: string;
	preVersionNumber: number;
}

class Release {
	static perform(preVersion?: string): void {
		const nextVersion = Release.computeVersion(Release.splitVersion(packageVersion), preVersion);
		Release.bumpVersion(nextVersion);
		Changelog.perform();
	}

	private static splitVersion(version): Version {
		const {groups} = version.match(/(?<version>\d+\.\d+\.\d+)(?:-(?<type>[^.]+)\.(?<typeNbr>\d+))?/);
		return {
			version: groups?.version,
			preVersionType: groups?.type,
			preVersionNumber: +groups?.typeNbr
		};
	}

	private static computeVersion(version: Version, preVersion: string): string {
		if (!version.preVersionType) {
			const newVersion = Release.getVersionFromGit(version.version);
			return preVersion ? `${newVersion}-${preVersion}.1` : newVersion;
		}
		if (!preVersion) {
			return version.version;
		}
		if (version.preVersionType !== preVersion) {
			return `${version.version}-${preVersion}.1`;
		}
		return `${version.version}-${version.preVersionType}.${version.preVersionNumber + 1}`;
	}

	private static getVersionFromGit(versionNbr: string): string {
		const current = /(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)/.exec(versionNbr).groups;
		const commits = execSync(`git log ${versionNbr}..HEAD --abbrev-commit`).toString();
		if (commits.includes('BREAKING CHANGE')) {
			return `${+current?.major + 1}.0.0`;
		}
		return commits.includes('feat:') || commits.includes('feat(')
			? `${current?.major}.${+current?.minor + 1}.0`
			: `${current?.major}.${current?.minor}.${+current?.patch + 1}`;
	}

	private static bumpVersion(version: string): void {
		process.chdir('../..'); // so that the release is made with the info of the root package.json
		execSync(`npm version ${version}`);
		writeFileSync(path.join('projects', 'oblique', 'src', 'lib', 'version.ts'), `export const appVersion = '${version}';\n`, {flag: 'w'});
	}
}

Release.perform(process.argv[2]);
