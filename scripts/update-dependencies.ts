import {execSync} from 'child_process';

class UpdateDependencies {
	static perform(): void {
		UpdateDependencies.execute('npm update --save --audit false');
		UpdateDependencies.execute('npm audit fix --audit-level=none');
		UpdateDependencies.execute('npm dedupe --audit false');
		UpdateDependencies.execute('npm prune --audit false');
		UpdateDependencies.commit('chore(toolchain): update dependencies and refactor accordingly');
	}

	private static execute(command: string): void {
		execSync(`${command} --fund false`, {stdio: 'inherit'});
	}

	private static commit(header: string): void {
		const issueNumber = (/OUI-\d+/.exec(execSync('git branch --show-current').toString()) ?? [])[0];
		const message = issueNumber ? `${header}\n\n${issueNumber}` : header;
		execSync(`git commit -am "${message}"`);
	}
}

UpdateDependencies.perform();
