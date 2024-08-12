import {executeCommandWithLog} from '../shared/utils';
import {Git} from '../shared/git';

class DependencyUpdate {
	static perform(): void {
		// Disabled on windows because npm ci is too slow
		if (process.platform !== 'win32') {
			const diff = Git.getFileNameDiffWithLastHead();
			if (/^package-lock\.json$/m.test(diff)) {
				executeCommandWithLog('npm ci  --audit false --fund false`', 'Install dependencies');
			}
		}
	}
}

DependencyUpdate.perform();
