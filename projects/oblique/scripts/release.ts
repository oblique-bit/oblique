import {Changelog} from '../../../scripts/shared/changelog';
import {version} from '../../../package.json';
import {updatePackageJsonVersion, updateSonarPropertiesVersion} from '../../../scripts/shared/utils';
import {Log} from '../../../scripts/shared/log';
import {Files} from '../../../scripts/shared/files';

Log.start(`Release Oblique ${version}`);
Changelog.addRelease(version, 'oblique');
Files.write('src/lib/version.ts', `export const appVersion = '${version}';\n`);
updatePackageJsonVersion(version);
updateSonarPropertiesVersion(version);
Log.success();
