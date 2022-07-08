import {execSync} from 'child_process';

export class DistributeObFeatures {
	static perform(): void {
		execSync(`uglifyjs --compress --mangle --output dist/oblique/ob-features.js -- projects/oblique/src/ob-features.js`);
	}
}
