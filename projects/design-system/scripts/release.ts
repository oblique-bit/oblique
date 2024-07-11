import {Changelog} from '../../../scripts/shared/changelog';
import {version} from '../../../package.json';
import {updatePackageJsonVersion, updateSonarPropertiesVersion} from '../../../scripts/shared/utils';
import {Log} from '../../../scripts/shared/log';

Log.start(`Release Design System ${version}`);
Changelog.addRelease(version, 'design-system');
updatePackageJsonVersion(version);
updateSonarPropertiesVersion(version);
Log.success();
