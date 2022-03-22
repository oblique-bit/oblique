class DependencyUpdate {
	private static readonly execSync = require('child_process').execSync;

	static perform(): void {
		// Disabled on windows because npm ci is too slow
		if (process.platform !== 'win32') {
			const diff = DependencyUpdate.execSync('git diff --name-only HEAD@{1} HEAD').toString();
			if (/^package-lock\.json$/m.test(diff)) {
				DependencyUpdate.execSync('npm ci', {stdio: 'inherit'});
			}
		}
	}
}

DependencyUpdate.perform();
