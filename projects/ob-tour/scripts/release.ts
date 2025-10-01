import {Log} from '../../../scripts/shared/log';
import {Changelog} from '../../../scripts/shared/changelog';
import {updatePackageJsonVersion} from '../../../scripts/shared/utils';
const version = '1.0.0';

Log.start(`Release Ob-Tour ${version}`);
Changelog.addRelease(version, 'ob-tour');
updatePackageJsonVersion(version);
Log.success();
