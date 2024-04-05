import {execSync} from 'child_process';
import {Commit} from './commit';

class UpdateDependencies {
	static perform(): void {
		UpdateDependencies.execute('npm update --save --audit false');
		UpdateDependencies.execute('npm audit fix');
		UpdateDependencies.execute('npm dedupe --audit false');
		UpdateDependencies.execute('npm prune --audit false');
		Commit.perform('chore(toolchain): update dependencies and refactor accordingly');
	}

	private static execute(command: string): void {
		execSync(command, {stdio: 'inherit'});
	}
}

UpdateDependencies.perform();
