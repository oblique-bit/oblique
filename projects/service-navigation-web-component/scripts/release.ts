import {Changelog} from '../../../scripts/shared/changelog';
import {updatePackageJsonVersion} from '../../../scripts/shared/utils';
import {version} from '../../../package.json';

Changelog.update(version, 'service-navigation');
updatePackageJsonVersion(version);
