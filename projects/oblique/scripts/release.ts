import {Changelog} from '../../../scripts/shared/changelog';
import {version} from '../../../package.json';
import {updatePackageJsonVersion} from '../../../scripts/shared/utils';
import {Log} from '../../../scripts/shared/log';
import {Files} from '../../../scripts/shared/files';
import {getAbsolutePath} from '../../../scripts/shared/root';

Log.start(`Release Oblique ${version}`);
Changelog.addRelease(version, 'oblique');
Files.write(getAbsolutePath('projects/oblique/src/lib/version.ts'), `export const appVersion = '${version}';\n`);
updatePackageJsonVersion('oblique', version);
Log.success();
