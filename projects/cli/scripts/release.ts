import {Changelog} from '../../../scripts/shared/changelog';
import {updatePackageJsonVersion, updateSonarPropertiesVersion} from '../../../scripts/shared/utils';
import {version} from '../../../package.json';

Changelog.addRelease(version, 'cli');
updatePackageJsonVersion(version);
updateSonarPropertiesVersion(version);
