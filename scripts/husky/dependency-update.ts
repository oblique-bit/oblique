import {executeCommandWithLog} from '../shared/utils';
import {Git} from '../shared/git';
import {Log} from '../shared/log';

class DependencyUpdate {
	static perform(): void {
		// Disabled on windows because npm ci is too slow
		if (process.platform !== 'win32') {
			Log.start('Check for changes in the dependencies');
			const diff = Git.getFileNameDiffWithLastHead();
			if (/^package-lock\.json$/m.test(diff)) {
				Log.info('Changes detected to the dependencies, reinstalling');
				executeCommandWithLog('npm ci  --audit false --fund false', 'Install dependencies');
			}
			Log.success();
		}
	}
}

DependencyUpdate.perform();
