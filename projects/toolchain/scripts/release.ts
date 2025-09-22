import {Changelog} from '../../../scripts/shared/changelog';
import {updatePackageJsonVersion} from '../../../scripts/shared/utils';
import {version} from '../../../package.json';
import {Log} from '../../../scripts/shared/log';
import {Files} from '../../../scripts/shared/files';

Log.start(`Release Toolchain ${version}`);
Changelog.addRelease(version, 'toolchain');
Files.write('src/schematics/version.ts', `export const currentToolchainVersion = '${version}';\n`);
updatePackageJsonVersion(version);
Log.success();
