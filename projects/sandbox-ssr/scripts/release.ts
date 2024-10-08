import {version} from '../../../package.json';
import {Changelog} from '../../../scripts/shared/changelog';
import {updatePackageJsonVersion, updateSonarPropertiesVersion} from '../../../scripts/shared/utils';
import {Log} from '../../../scripts/shared/log';

Log.start(`Release Sandbox SSR ${version}`);
Changelog.addRelease(version, 'sandbox-ssr');
updatePackageJsonVersion(version);
updateSonarPropertiesVersion(version);
Log.success();
