import {Changelog} from '../../../scripts/shared/changelog';
import {version} from '../../../package.json';
import {updatePackageJsonVersion, updateSonarPropertiesVersion} from '../../../scripts/shared/utils';

Changelog.addRelease(version, 'design-system');
updatePackageJsonVersion(version);
updateSonarPropertiesVersion(version);
