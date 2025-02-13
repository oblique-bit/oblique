import {executeCommandWithLog} from './utils';
import {StaticScript} from './static-script';
import {Log} from './log';

export class Publish extends StaticScript {
	static perform(packageName: string): void {
		Log.start(`Publish ${packageName}`);
		executeCommandWithLog(`npm publish ./dist/${packageName} --access public`, 'Publish');
		Log.success();
	}
}
