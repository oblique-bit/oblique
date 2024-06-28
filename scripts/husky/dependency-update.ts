import {executeCommand, getResultFromCommand} from '../shared/utils';

class DependencyUpdate {
	static perform(): void {
		// Disabled on windows because npm ci is too slow
		if (process.platform !== 'win32') {
			const diff = getResultFromCommand('git diff --name-only HEAD@{1} HEAD');
			if (/^package-lock\.json$/m.test(diff)) {
				executeCommand('npm ci', true);
			}
		}
	}
}

DependencyUpdate.perform();
