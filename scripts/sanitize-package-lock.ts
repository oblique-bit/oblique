import {Log} from './shared/log';
import {Files} from './shared/files';
import {StaticScript} from './shared/static-script';
import {getAbsolutePath} from './shared/root';

class Sanitize extends StaticScript {
	static perform(): void {
		const packageLockPath = getAbsolutePath('package-lock.json');
		if (Files.exists(packageLockPath)) {
			Log.start('Draw all dependencies from NPM instead of Nexus');
			Files.overwrite(packageLockPath, content =>
				content.replace(/repo\.bit\.admin\.ch\/repository\/npm-group/g, 'registry.npmjs.org')
			);
			Log.success();
		}
	}
}

Sanitize.perform();
