import {readFileSync, writeFileSync} from 'fs';
import path from 'path';
import {version as currentVersion} from '../../../package.json';
import {StaticScript} from '../../../scripts/shared/static-script';

export class ObliqueVersion extends StaticScript {
	static updateObliqueVersion(): void {
		const latest = ObliqueVersion.getLatestNonPreReleaseVersion();
		writeFileSync(path.join('src', 'obliqueVersion.ts'), `export const latest = '${latest}';\n`, {flag: 'w'});
	}

	private static getLatestNonPreReleaseVersion(): string {
		return /^\d+\.\d+.\d+$/.test(currentVersion)
			? currentVersion
			: /# \[(?<latest>\d+\.\d+.\d+)]/.exec(readFileSync('../oblique/CHANGELOG.md').toString()).groups.latest;
	}
}
