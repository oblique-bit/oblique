import {writeFileSync} from 'fs';
import path from 'path';
import {Changelog} from '../../../scripts/shared/changelog';
import {version} from '../../../package.json';
import {updatePackageJsonVersion} from '../../../scripts/shared/utils';

class Release {
	static perform(): void {
		Changelog.update(version, 'oblique');
		writeFileSync(path.join('src', 'lib', 'version.ts'), `export const appVersion = '${version}';\n`);
		updatePackageJsonVersion(version);
	}
}

Release.perform();
