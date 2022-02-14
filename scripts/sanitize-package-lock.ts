import {existsSync, readFileSync, writeFileSync} from 'fs';

class Sanitize {
	static perform(): void {
		if (existsSync('package-lock.json')) {
			writeFileSync(
				'package-lock.json',
				readFileSync('package-lock.json')
					.toString()
					.replace(/repo\.bit\.admin\.ch\/repository\/npm-group/g, 'registry.npmjs.org')
			);
		}
	}
}

Sanitize.perform();
