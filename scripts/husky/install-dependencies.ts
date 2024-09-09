import {executeCommandWithLog} from '../shared/utils';
import {Git} from '../shared/git';
import {Log} from '../shared/log';

class InstallDependencies {
	static perform(): void {
		Log.start('Check for changes in the dependencies');
		// Disabled on windows because npm ci is too slow
		if (!InstallDependencies.isWindows() && InstallDependencies.hasDependenciesChanges()) {
			Log.info('Changes detected to the dependencies, reinstalling');
			executeCommandWithLog('npm ci  --audit false --fund false', 'Install dependencies');
		}
		Log.success();
	}

	static isWindows(): boolean {
		return process.platform !== 'win32';
	}

	static hasDependenciesChanges(): boolean {
		return /^package-lock\.json$/m.test(Git.getFileNameDiffWithLastHead());
	}
}

InstallDependencies.perform();
