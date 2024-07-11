import {readFileSync, writeFileSync} from 'fs';
import path from 'path';
import {executeCommandWithLog} from './shared/utils';
import {StaticScript} from './shared/static-script';
import {Git} from './shared/git';
import {Log} from './shared/log';

class DependenciesUpdate extends StaticScript {
	private static readonly packageJsonPath = path.join('projects', 'oblique', 'package.json');
	static perform(): void {
		Log.start('Update dependencies');
		const peerDependencies = DependenciesUpdate.savePeerDependencies();
		DependenciesUpdate.execute('npm update --save --audit false');
		DependenciesUpdate.execute('npm audit fix --audit-level=none');
		DependenciesUpdate.execute('npm dedupe --audit false');
		DependenciesUpdate.execute('npm prune --audit false');
		DependenciesUpdate.restorePeerDependencies(peerDependencies);
		DependenciesUpdate.commit();
		Log.success();
	}

	private static savePeerDependencies(): Record<string, string> {
		return DependenciesUpdate.readPackageJson().peerDependencies;
	}

	private static restorePeerDependencies(peerDependencies: Record<string, string>): void {
		writeFileSync(
			DependenciesUpdate.packageJsonPath,
			JSON.stringify({...DependenciesUpdate.readPackageJson(), peerDependencies}, null, '  ')
		);
	}

	private static readPackageJson(): {peerDependencies: Record<string, string>} {
		return JSON.parse(readFileSync(DependenciesUpdate.packageJsonPath).toString());
	}

	private static execute(command: string): void {
		executeCommandWithLog(`${command} --fund false`, `Execute`);
	}

	private static commit(): void {
		const issueNumber = (/OUI-\d+/.exec(Git.getBranchName()) ?? [])[0];
		Git.commit('chore(toolchain): update dependencies and refactor accordingly', issueNumber);
	}
}

DependenciesUpdate.perform();
