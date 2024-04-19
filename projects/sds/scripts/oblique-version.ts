import {readFileSync, writeFileSync} from 'fs';
import path from 'path';

/**
 * The release script in Oblique calls `npm version` on the root level, which triggers the `postversion` script in the root package.json which itself triggers this script.
 * This means that this script is automatically executed when a new Oblique version is released, ensuring SDS always knows the latest Oblique version
 */
export class ObliqueVersion {
	static perform(): void {
		const changelog = readFileSync('../../CHANGELOG.md').toString();
		const {latest} = /# \[(?<latest>\d+\.\d+.\d+)]/.exec(changelog).groups; // get the latest non-pre-release version
		writeFileSync(path.join('src', 'obliqueVersion.ts'), `export const latest = '${latest}';\n`, {flag: 'w'});
	}
}
ObliqueVersion.perform();
