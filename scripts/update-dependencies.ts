import {readFileSync, writeFileSync} from 'fs';
import path from 'path';
import {executeCommand} from './shared/utils';
import {StaticScript} from './shared/static-script';
import {Git} from './shared/git';

class UpdateDependencies extends StaticScript {
	private static readonly packageJsonPath = path.join('projects', 'oblique', 'package.json');
	static perform(): void {
		const peerDependencies = UpdateDependencies.savePeerDependencies();
		UpdateDependencies.execute('npm update --save --audit false');
		UpdateDependencies.execute('npm audit fix --audit-level=none');
		UpdateDependencies.execute('npm dedupe --audit false');
		UpdateDependencies.execute('npm prune --audit false');
		UpdateDependencies.restorePeerDependencies(peerDependencies);
		UpdateDependencies.commit();
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
		executeCommand(`${command} --fund false`, true);
	}

	private static commit(): void {
		const issueNumber = (/OUI-\d+/.exec(Git.getBranchName()) ?? [])[0];
		Git.commit('chore(toolchain): update dependencies and refactor accordingly', issueNumber);
	}
}

UpdateDependencies.perform();
