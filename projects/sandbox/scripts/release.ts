import {version} from '../../../package.json';
import {Changelog} from '../../../scripts/shared/changelog';
import {updatePackageJsonVersion} from '../../../scripts/shared/utils';

Changelog.addRelease(version, 'sandbox');
updatePackageJsonVersion(version);
