import {existsSync, readFileSync, writeFileSync} from 'fs';
import {StaticScript} from './shared/static-script';
import {Log} from './shared/log';

class Sanitize extends StaticScript {
	static perform(): void {
		if (existsSync('package-lock.json')) {
			Log.start('Draw all dependencies from NPM instead of Nexus');
			writeFileSync(
				'package-lock.json',
				readFileSync('package-lock.json')
					.toString()
					.replace(/repo\.bit\.admin\.ch\/repository\/npm-group/g, 'registry.npmjs.org')
			);
			Log.success();
		}
	}
}

Sanitize.perform();
