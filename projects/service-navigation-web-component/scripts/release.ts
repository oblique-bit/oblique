import {Changelog} from '../../../scripts/shared/changelog';
import {version} from '../../../package.json';
import {updatePackageJsonVersion} from '../../../scripts/shared/utils';
import {Log} from '../../../scripts/shared/log';
import {getAbsolutePath} from '../../../scripts/shared/root';
import {Files} from '../../../scripts/shared/files';

Log.start(`Release Service Navigation Web Component ${version}`);
Changelog.addRelease(
	version,
	{scope: 'service-navigation', folder: 'service-navigation-web-component'},
	'oblique/service-navigation'
);
Files.write(
	getAbsolutePath('projects/service-navigation-web-component/src/app/version.ts'),
	`export const appVersion = '${version}';\n`
);
updatePackageJsonVersion('service-navigation-web-component', version);
Log.success();
