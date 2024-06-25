import {Changelog} from '../../../scripts/shared/changelog';
import {updatePackageJsonVersion} from '../../../scripts/shared/utils';
import {version} from '../../../package.json';
import {ObliqueVersion} from './oblique-version';

ObliqueVersion.updateObliqueVersion();
Changelog.addRelease(version, 'sds');
updatePackageJsonVersion(version);
