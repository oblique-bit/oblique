import {executeCommand} from '../../../../../scripts/shared/utils';

export class DistributeObFeatures {
	static perform(): void {
		executeCommand(`uglifyjs --compress --mangle --output ../../dist/oblique/ob-features.js -- src/ob-features.js`);
	}
}
