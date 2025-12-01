import {version as currentVersion} from '../../package.json';
import {executeCommandWithLog, getResultFromCommand} from './utils';
import {StaticScript} from './static-script';
import {Files} from './files';
import {Log} from './log';

export class Publish extends StaticScript {
	private static readonly eolDates: Record<number, string> = {
		11: '2025-03-31',
		12: '2025-10-31',
		13: '2026-03-31',
		14: '2026-09-30'
	};

	static perform(packageName: string, releaseTag?: string): void {
		Log.start(`Publish ${packageName}`);
		const tag = releaseTag || (/^\d+\.\d+\.\d+$/.test(currentVersion) ? 'latest' : 'next');
		// as the `projects/oblique` folder contains a package.json with publish instructions, the directory parameter is ignored and the current working directory is published instead.
		process.chdir(`../../`);
		executeCommandWithLog(`npm publish ./dist/${packageName} --access public --tag ${tag}`, 'Publish');
		Publish.deprecatePreReleaseVersions(packageName, currentVersion);
		Publish.deprecateMajorVersion(packageName);
		Log.success();
	}

	private static deprecatePreReleaseVersions(packageName: string, version: string): void {
		const fullPackageName = `@oblique/${packageName}`;
		const nextTag = Publish.getTagOnNext(fullPackageName);
		if (nextTag.startsWith(version) && nextTag !== version) {
			executeCommandWithLog(
				`npm deprecate ${fullPackageName}@">${version}-0 <${version}" "Oblique ${version} has been released on ${Publish.getTagDateFromChangelog(version, packageName)}"`,
				`Deprecate all pre-release versions of ${version}`
			);
			executeCommandWithLog(`npm dist-tag rm ${fullPackageName} next`, 'Remove "next" tag');
		}
	}

	private static deprecateMajorVersion(packageName: string): void {
		const fullPackageName = `@oblique/${packageName}`;
		Object.entries(Publish.eolDates)
			.map(([major, endOfLifeDate]) => ({major, endOfLifeDate}))
			.filter(({endOfLifeDate}) => new Date() > new Date(endOfLifeDate))
			.filter(({major}) => getResultFromCommand(`npm view ${fullPackageName}@${major} deprecated`).length === 0)
			.forEach(({major, endOfLifeDate}) => {
				executeCommandWithLog(
					`npm deprecate ${fullPackageName}@${major} "Oblique ${major} has reached its End Of Life on ${endOfLifeDate}"`,
					`Deprecate all versions of ${major}`
				);
			});
	}

	private static getTagOnNext(packageName: string): string {
		const distTags = getResultFromCommand(`npm dist-tags ls ${packageName}`);
		return /(?<=next: )(?<next>.*)$/m.exec(distTags)?.groups?.next ?? '';
	}

	private static getTagDateFromChangelog(version: string, packageName: string): string {
		return new RegExp(`(?<=#\\s+\\[${version}]\\([\\w:/.-]*\\)\\s*\\()\\d{4}-\\d{2}-\\d{2}(?=\\))`)
			.exec(Files.read(`./dist/${packageName}/CHANGELOG.md`))
			.toString()
			.trim();
	}
}
