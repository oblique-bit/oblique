import {executeCommand} from '../shared/utils';
import {Git} from '../shared/git';

class DependencyUpdate {
	static perform(): void {
		// Disabled on windows because npm ci is too slow
		if (process.platform !== 'win32') {
			const diff = Git.getFileNameDiffWithLastHead();
			if (/^package-lock\.json$/m.test(diff)) {
				executeCommand('npm ci', true);
			}
		}
	}
}

DependencyUpdate.perform();
