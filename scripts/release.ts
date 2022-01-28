interface Version {
	version: string;
	preVersionType: string;
	preVersionNumber: number;
}

class Release {
	private static readonly execSync = require('child_process').execSync;
	private static readonly conventionalChangelog = require('conventional-changelog');
	private static readonly fs = require('fs');
	private static readonly path = require('path');
	private static readonly currentVersion = require('../package.json').version;

	static perform(preVersion?: string): void {
		const nextVersion = Release.computeVersion(Release.splitVersion(Release.currentVersion), preVersion);
		Release.execSync(`npm version ${nextVersion}`);
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

	private static computeVersion(currentVersion: Version, preVersion: string): string {
		if (!currentVersion.preVersionType) {
			const newVersion = Release.getVersionFromGit(currentVersion.version);
			return preVersion ? `${newVersion}-${preVersion}.1` : newVersion;
		}
		if (!preVersion) {
			return currentVersion.version;
		}
		if (currentVersion.preVersionType !== preVersion) {
			return `${currentVersion.version}-${preVersion}.1`;
		}
		return `${currentVersion.version}-${currentVersion.preVersionType}.${currentVersion.preVersionNumber + 1}`;
	}

	private static getVersionFromGit(versionNbr: string): string {
		const current = /(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)/.exec(versionNbr).groups;
		const commits = Release.execSync(`git log ${versionNbr}..HEAD --abbrev-commit`).toString();
		if (commits.indexOf('BREAKING CHANGE') > -1) {
			return `${+current?.major + 1}.0.0`;
		}
		return commits.indexOf('feat:') > -1 || commits.indexOf('feat(') > -1
			? `${current?.major}.${+current?.minor + 1}.0`
			: `${current?.major}.${current?.minor}.${+current?.patch + 1}`;
	}

	private static bumpVersion(version: string): void {
		Release.fs.writeFileSync(Release.path.join('projects', 'oblique', 'src', 'lib', 'version.ts'), `export const appVersion = '${version}';\n`, {flag: 'w'});
	}

	private static bumpPackageVersion(version: string, fileName: string): void {
		const filePath = Release.path.join('projects', 'oblique', 'schematics', fileName);
		const pkg = Release.fs
			.readFileSync(filePath)
			.toString()
			.replace(/"version": "[^"]*",/, `"version": "${version}",`);
		Release.fs.writeFileSync(filePath, pkg);
	}

	private static writeChangelog(): void {
		const changelog: string = Release.fs.readFileSync('CHANGELOG.md').toString();
		const stream = Release.fs.createWriteStream('CHANGELOG.md');
		stream.on('finish', () => {
			const newLog: string = Release.fs
				.readFileSync('CHANGELOG.md')
				.toString()
				.replace(/##(.*)\n/g, '#$1')
				.replace(/\n\n\n/g, '\n\n');
			Release.fs.writeFileSync('CHANGELOG.md', newLog + changelog);
		});
		Release.conventionalChangelog({
			preset: 'angular',
			tagPrefix: ''
		}).pipe(stream);
	}
}

Release.perform(process.argv[2]);
