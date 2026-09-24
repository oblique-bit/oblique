import {version} from '../../../package.json';
import {Changelog} from '../../../scripts/shared/changelog';
import {updatePackageJsonVersion} from '../../../scripts/shared/utils';
import {Log} from '../../../scripts/shared/log';

Log.start(`Release Sandbox-e2e ${version}`);
Changelog.addRelease(version, 'sandbox-e2e');
updatePackageJsonVersion('sandbox-e2e', version);
Log.success();
