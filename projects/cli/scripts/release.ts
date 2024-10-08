import {Changelog} from '../../../scripts/shared/changelog';
import {updatePackageJsonVersion, updateSonarPropertiesVersion} from '../../../scripts/shared/utils';
import {version} from '../../../package.json';
import {Log} from '../../../scripts/shared/log';

Log.start(`Release CLI@${version}`);
Changelog.addRelease(version, 'cli');
updatePackageJsonVersion(version);
updateSonarPropertiesVersion(version);
Log.success();
