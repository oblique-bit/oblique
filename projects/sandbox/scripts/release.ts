import {version} from '../../../package.json';
import {Changelog} from '../../../scripts/shared/changelog';
import {updatePackageJsonVersion} from '../../../scripts/shared/utils';
import {Log} from '../../../scripts/shared/log';

Log.start(`Release Sandbox ${version}`);
Changelog.addRelease(version, 'sandbox');
updatePackageJsonVersion(version);
Log.success();
