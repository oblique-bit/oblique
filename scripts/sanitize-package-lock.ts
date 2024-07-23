import {Log} from './shared/log';
import {Files} from './shared/files';
import {StaticScript} from './shared/static-script';

class Sanitize extends StaticScript {
	static perform(): void {
		if (Files.exists('package-lock.json')) {
			Log.start('Draw all dependencies from NPM instead of Nexus');
			Files.write(
				'package-lock.json',
				Files.read('package-lock.json')

					.replace(/repo\.bit\.admin\.ch\/repository\/npm-group/g, 'registry.npmjs.org')
			);
			Log.success();
		}
	}
}

Sanitize.perform();
