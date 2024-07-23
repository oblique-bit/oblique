import {executeCommandWithLog} from './shared/utils';
import {StaticScript} from './shared/static-script';
import {Git} from './shared/git';
import {Log} from './shared/log';
import {Files} from './shared/files';

class DependenciesUpdate extends StaticScript {
	private static readonly packageJsonPath = 'projects/oblique/package.json';
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
		Files.writeJson(DependenciesUpdate.packageJsonPath, {...DependenciesUpdate.readPackageJson(), peerDependencies});
	}

	private static readPackageJson(): {peerDependencies: Record<string, string>} {
		return Files.readJson(DependenciesUpdate.packageJsonPath);
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
