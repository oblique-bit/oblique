import {execSync} from 'child_process';
import {readFileSync, writeFileSync} from 'fs';
import path from 'path';

class UpdateDependencies {
	private static readonly packageJsonPath = path.join('projects', 'oblique', 'package.json');
	static perform(): void {
		const peerDependencies = UpdateDependencies.savePeerDependencies();
		UpdateDependencies.execute('npm update --save --audit false');
		UpdateDependencies.execute('npm audit fix --audit-level=none');
		UpdateDependencies.execute('npm dedupe --audit false');
		UpdateDependencies.execute('npm prune --audit false');
		UpdateDependencies.restorePeerDependencies(peerDependencies);
		UpdateDependencies.commit('chore(toolchain): update dependencies and refactor accordingly');
	}

	private static savePeerDependencies(): Record<string, string> {
		return UpdateDependencies.readPackageJson().peerDependencies;
	}

	private static restorePeerDependencies(peerDependencies: Record<string, string>): void {
		writeFileSync(
			UpdateDependencies.packageJsonPath,
			JSON.stringify({...UpdateDependencies.readPackageJson(), peerDependencies}, null, '  ')
		);
	}

	private static readPackageJson(): {peerDependencies: Record<string, string>} {
		return JSON.parse(readFileSync(UpdateDependencies.packageJsonPath).toString());
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
