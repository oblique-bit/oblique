import {version as currentVersion} from '../../package.json';
import {executeCommandWithLog, getResultFromCommand} from './utils';
import {StaticScript} from './static-script';
import {Files} from './files';
import {Log} from './log';

export class Publish extends StaticScript {
	static perform(packageName: string): void {
		Log.start(`Publish ${packageName}`);
		const tag = /^\d+\.\d+\.\d+$/.test(currentVersion) ? 'latest' : 'next';
		const distPath = `../../dist/${packageName}`;
		executeCommandWithLog(`npm publish ${distPath} --access public --tag ${tag}`, 'Publish');
		Publish.deprecatePreReleaseVersions(`@oblique/${packageName}`, distPath, currentVersion);
		Log.success();
	}

	private static deprecatePreReleaseVersions(packageName: string, distPath: string, version: string): void {
		const nextTag = Publish.getTagOnNext(packageName);
		if (nextTag.startsWith(version) && nextTag !== version) {
			executeCommandWithLog(
				`npm deprecate ${packageName}@">${version}-0 <${version}" "Oblique ${version} has been released on ${Publish.getTagDateFromChangelog(version, distPath)}"`,
				`Deprecate all pre-release versions of ${version}`
			);
			executeCommandWithLog(`npm dist-tag rm ${packageName} next`, 'Remove "next" tag');
		}
	}

	private static getTagOnNext(packageName: string): string {
		const distTags = getResultFromCommand(`npm dist-tags ls ${packageName}`);
		return /(?<=next: )(?<next>.*)$/m.exec(distTags)?.groups?.next ?? '';
	}

	private static getTagDateFromChangelog(version: string, distPath: string): string {
		return new RegExp(`(?<=#\\s+\\[${version}]\\([\\w:/.-]*\\)\\s*\\()\\d{4}-\\d{2}-\\d{2}(?=\\))`)
			.exec(Files.read(`${distPath}/CHANGELOG.md`))
			.toString()
			.trim();
	}
}
