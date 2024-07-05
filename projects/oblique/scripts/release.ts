import {writeFileSync} from 'fs';
import path from 'path';
import {Changelog} from '../../../scripts/shared/changelog';
import {version} from '../../../package.json';
import {updatePackageJsonVersion, updateSonarPropertiesVersion} from '../../../scripts/shared/utils';

Changelog.addRelease(version, 'oblique');
writeFileSync(path.join('src', 'lib', 'version.ts'), `export const appVersion = '${version}';\n`);
updatePackageJsonVersion(version);
updateSonarPropertiesVersion(version);
