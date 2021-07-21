/* eslint-disable */

const execSync = require('child_process').execSync,
	conventionalChangelog = require('conventional-changelog'),
	fs = require('fs'),
	path = require('path');

const newVersion = computeVersion(splitVersion(require('../package.json').version), process.argv[2]);
execSync(`npm version ${newVersion}`);
bumpVersion(newVersion);
bumpPackageVersion(newVersion, 'package.json');
bumpPackageVersion(newVersion, 'package-lock.json');
writeChangelog();

function computeVersion(currentVersion, preVersion) {
	if (!currentVersion.preVersionType) {
		const newVersion = getVersionFromGit(currentVersion.version);
		return preVersion ? `${newVersion}-${preVersion}.1` : newVersion;
	}
	if (!preVersion) {
		return currentVersion.version;
	}
	if (currentVersion.preVersionType != preVersion) {
		return `${currentVersion.version}-${preVersion}.1`;
	}
	return `${currentVersion.version}-${currentVersion.preVersionType}.${currentVersion.preVersionNumber + 1}`;
}

function getVersionFromGit(versionNbr) {
	const current = versionNbr.match(/(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)/).groups;
	const commits = execSync(`git log ${versionNbr}..HEAD --abbrev-commit`).toString();
	return commits.indexOf('BREAKING CHANGE') > -1
		? `${+current.major + 1}.0.0`
		: (commits.indexOf('feat:') > -1 || commits.indexOf('feat(') > -1
			? `${current.major}.${+current.minor + 1}.0`
			: `${current.major}.${current.minor}.${+current.patch + 1}`);
}

function splitVersion(version) {
	const groups = version.match(/(?<version>\d+\.\d+\.\d+)(?:-(?<type>[^.]+)\.(?<typeNbr>\d+))?/).groups;
	return {
		version: groups.version,
		preVersionType: groups.type,
		preVersionNumber: +groups.typeNbr
	};
}

function writeChangelog() {
	const changelog = fs.readFileSync('CHANGELOG.md');
	const stream = fs.createWriteStream('CHANGELOG.md');
	stream.on('finish', () => {
		const newLog = fs.readFileSync('CHANGELOG.md').toString()
			.replace(/##(.*)\n/g, '#$1')
			.replace(/\n\n\n/g, '\n\n');
		fs.writeFileSync('CHANGELOG.md', newLog + changelog);
	});
	conventionalChangelog({
		preset: 'angular',
		tagPrefix: ''
	}).pipe(stream);
}

function bumpVersion(version) {
	fs.writeFile(
		path.join('projects', 'oblique', 'src', 'lib', 'version.ts'),
		`export const appVersion = '${version}';\n`,
		{flag: 'w'},
		err => console.log(err || 'Version patched'));
}

function bumpPackageVersion(version, file) {
	const fileName = path.join('projects', 'oblique', 'schematics', file);
	const pkg = fs.readFileSync(fileName).toString().replace(/"version": "[^"]*",/, `"version": "${version}",`);
	fs.writeFileSync(fileName, pkg);
}
