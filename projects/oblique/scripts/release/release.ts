import {execSync} from 'child_process';
import {createWriteStream, readFileSync, writeFileSync} from 'fs';
import path from 'path';
import {version as packageVersion} from '../../../../package.json';

interface Version {
	version: string;
	preVersionType: string;
	preVersionNumber: number;
}

class Release {
	// conventionalChangelog is not available as an ESM module therefore it has to be imported with require and not with import
	private static readonly conventionalChangelog = require('conventional-changelog');

	static perform(preVersion?: string): void {
		const nextVersion = Release.computeVersion(Release.splitVersion(packageVersion), preVersion);
		process.chdir('../..'); // so that the release is made with the info of the root package.json
		execSync(`npm version ${nextVersion}`);
		Release.bumpVersion(nextVersion);
		Release.bumpPackageVersion(nextVersion, 'package.json');
		Release.bumpPackageVersion(nextVersion, 'package-lock.json');
		Release.writeChangelog();
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
		writeFileSync(path.join('projects', 'oblique', 'src', 'lib', 'version.ts'), `export const appVersion = '${version}';\n`, {flag: 'w'});
	}

	private static bumpPackageVersion(version: string, fileName: string): void {
		const filePath = path.join('projects', 'oblique', 'schematics', fileName);
		const pkg = readFileSync(filePath)
			.toString()
			.replace(/"version": "[^"]*",/, `"version": "${version}",`);
		writeFileSync(filePath, pkg);
	}

	private static writeChangelog(): void {
		const changelog: string = readFileSync('CHANGELOG.md').toString();
		const stream = createWriteStream('CHANGELOG.md');
		stream.on('finish', () => {
			const newLog: string = readFileSync('CHANGELOG.md')
				.toString()
				.replace(Release.getLinesWithNonObliquePrefix(), '')
				.replace(Release.getObliquePrefix(), '')
				.replace(/##(?<title>.*)\n/g, '#$<title>')
				.replace(/\n\n\n/g, '\n\n');
			writeFileSync('CHANGELOG.md', newLog + changelog);
		});
		Release.conventionalChangelog({
			preset: 'angular',
			tagPrefix: ''
		}).pipe(stream);
	}

	private static getLinesWithNonObliquePrefix(): RegExp {
		return /^[-*] \*{2}(?!oblique)[a-z-]+\/[a-z-]+:\*{2}.*$\n/g;
	}

	private static getObliquePrefix(): RegExp {
		return /(?<=[-*] \*{2})oblique\/(?=[a-z-]+:\*{2})/g;
	}
}

Release.perform(process.argv[2]);
