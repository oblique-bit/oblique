import {version} from '../../../package.json';
import {Changelog} from '../../../scripts/shared/changelog';
import {updatePackageJsonVersion, updateSonarPropertiesVersion} from '../../../scripts/shared/utils';

Changelog.addRelease(version, 'sandbox-ssr');
updatePackageJsonVersion(version);
updateSonarPropertiesVersion(version);
