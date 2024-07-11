import {Changelog} from '../../../scripts/shared/changelog';
import {updatePackageJsonVersion, updateSonarPropertiesVersion} from '../../../scripts/shared/utils';
import {version} from '../../../package.json';
import {Log} from '../../../scripts/shared/log';

Log.start(`Release Service Navigation Web Component ${version}`);
Changelog.addRelease(version, 'service-navigation', 'oblique/service-navigation');
updatePackageJsonVersion(version);
updateSonarPropertiesVersion(version);
Log.success();
