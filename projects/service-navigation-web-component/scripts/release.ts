import {writeFileSync} from 'fs';
import path from 'path';
import {Changelog} from '../../../scripts/shared/changelog';
import {version} from '../../../package.json';
import {updatePackageJsonVersion} from '../../../scripts/shared/utils';
import {Log} from '../../../scripts/shared/log';

Log.start(`Release Service Navigation Web Component ${version}`);
Changelog.addRelease(version, 'service-navigation', 'oblique/service-navigation');
writeFileSync(path.join('src', 'app', 'version.ts'), `export const appVersion = '${version}';\n`);
updatePackageJsonVersion(version);
Log.success();
