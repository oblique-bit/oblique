import {Changelog} from '../../../scripts/shared/changelog';
import {updatePackageJsonVersion} from '../../../scripts/shared/utils';
import {version} from '../../../package.json';

Changelog.addRelease(version, 'service-navigation');
updatePackageJsonVersion(version);
