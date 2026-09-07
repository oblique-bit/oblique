import {executeCommandWithLog} from '../shared/utils';
import {Git} from '../shared/git';
import {Log} from '../shared/log';

class InstallDependencies {
	static perform(): void {
		Log.start('Check git Oblique config');
		const npmCi = Git.getGlobalConfig('oblique.hooks.npm-ci');
		if (npmCi !== null && !npmCi) {
			Log.info('Oblique npm-ci hook is disabled, skipping automatic dependencies installation check.');
			Log.success();
			return;
		}
		Log.success();

		Log.start('Check for changes in the dependencies');
		// Disabled on windows because npm ci is too slow
		if (InstallDependencies.hasDependenciesChanges()) {
			Log.info('Changes detected to the dependencies, reinstalling');
			executeCommandWithLog('npm ci  --audit false --fund false', 'Install dependencies');
		}
		Log.success();
	}

	static hasDependenciesChanges(): boolean {
		return /^package-lock\.json$/m.test(Git.getFileNameDiffWithLastHead());
	}
}

InstallDependencies.perform();
