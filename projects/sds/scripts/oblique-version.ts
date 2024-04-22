import {readFileSync, writeFileSync} from 'fs';
import path from 'path';
import {version as currentVersion} from '../../../package.json';

/**
 * The release script in Oblique calls `npm version` on the root level, which triggers the `postversion` script in the root package.json which itself triggers this script.
 * This means that this script is automatically executed when a new Oblique version is released, ensuring SDS always knows the latest Oblique version
 */
export class ObliqueVersion {
	static perform(): void {
		const latest = ObliqueVersion.getLatestNonPreReleaseVersion();
		writeFileSync(path.join('src', 'obliqueVersion.ts'), `export const latest = '${latest}';\n`, {flag: 'w'});
	}

	private static getLatestNonPreReleaseVersion(): string {
		return /^\d+\.\d+.\d+$/.test(currentVersion)
			? currentVersion
			: /# \[(?<latest>\d+\.\d+.\d+)]/.exec(readFileSync('../../CHANGELOG.md').toString()).groups.latest;
	}
}
ObliqueVersion.perform();
