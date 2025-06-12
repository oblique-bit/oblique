import {version as currentVersion} from '../../../package.json';
import {StaticScript} from '../../../scripts/shared/static-script';
import {Files} from '../../../scripts/shared/files';

export class ObliqueVersion extends StaticScript {
	static updateObliqueVersion(): void {
		const latest = ObliqueVersion.getLatestNonPreReleaseVersion();
		Files.write('src/obliqueVersion.ts', `export const latest = '${latest}';\n`);
	}

	private static getLatestNonPreReleaseVersion(): string {
		return /^\d+\.\d+.\d+$/u.test(currentVersion)
			? currentVersion
			: (/# \[(?<latest>\d+\.\d+.\d+)\]/u.exec(Files.read('../oblique/CHANGELOG.md'))?.groups?.latest ?? '');
	}
}
