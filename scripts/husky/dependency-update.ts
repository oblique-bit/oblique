import {execSync} from 'child_process';

class DependencyUpdate {
	static perform(): void {
		// Disabled on windows because npm ci is too slow
		if (process.platform !== 'win32') {
			const diff = execSync('git diff --name-only HEAD@{1} HEAD').toString();
			if (/^package-lock\.json$/m.test(diff)) {
				execSync('npm ci', {stdio: 'inherit'});
			}
		}
	}
}

DependencyUpdate.perform();
