import {version as currentVersion} from '../../package.json';
import {executeCommandWithLog, getResultFromCommand} from './utils';
import {StaticScript} from './static-script';
import {Log} from './log';
import {Git} from './git';

export class Publish extends StaticScript {
	static perform(packageName: string): void {
		Log.start(`Publish ${packageName}`);
		executeCommandWithLog(`npm publish ./dist/${packageName} --access public`, 'Publish');
		Publish.deprecatePreReleaseVersions(`@oblique/${packageName}`, currentVersion);
		Log.success();
	}

	private static deprecatePreReleaseVersions(packageName: string, version: string): void {
		if (Publish.getTagOnNext(packageName).startsWith(currentVersion)) {
			executeCommandWithLog(
				`npm deprecate ${packageName}@">${version}-0 <${version}" "Oblique ${version} has been released on ${Git.getTagDate(version)}"`,
				`Deprecate all pre-release versions of ${version}`
			);
			executeCommandWithLog(`npm dist-tag rm ${packageName} next`, 'Remove "next" tag');
		}
	}

	private static getTagOnNext(packageName: string): string {
		const distTags = getResultFromCommand(`npm dist-tags ls ${packageName}`);
		return /(?<=next: )(?<next>.*)$/m.exec(distTags)?.groups?.next ?? '';
	}
}
