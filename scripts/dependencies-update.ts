import {executeCommandWithLog} from './shared/utils';
import {StaticScript} from './shared/static-script';
import {Git} from './shared/git';
import {Log} from './shared/log';
import {Files} from './shared/files';

class DependenciesUpdate extends StaticScript {
	private static readonly packageJsonPaths = DependenciesUpdate.buildPackageJsonList();

	static perform(): void {
		Log.start('Update dependencies');
		const dependencies = DependenciesUpdate.readPackagesJson();

		DependenciesUpdate.execute('npm update --save --audit false');
		DependenciesUpdate.execute('npm audit fix --audit-level=none');
		DependenciesUpdate.execute('npm dedupe --audit false');
		DependenciesUpdate.execute('npm prune --audit false');
		DependenciesUpdate.restoreDependencies(dependencies);
		DependenciesUpdate.commit();
		Log.success();
	}

	private static buildPackageJsonList(): string[] {
		const dir = `${__dirname}/../projects/`;
		const files = Files.readDirectory(dir)
			.filter(path => Files.isDirectory(`${dir}${path}`))
			.filter(path => Files.exists(`${dir}${path}/package.json`))
			.map(path => `${dir}${path}/package.json`);

		if (Files.exists('package.json')) {
			files.push('package.json');
		}

		return files;
	}

	private static restoreDependencies(dependencies: {peerDependencies: Record<string, string>}[]): void {
		DependenciesUpdate.packageJsonPaths.forEach((path, iterator) => {
			if (dependencies[iterator]?.peerDependencies) {
				Files.writeJson(path, {
					...DependenciesUpdate.readPackagesJson()[iterator],
					peerDependencies: dependencies[iterator].peerDependencies
				});
			}
		});
	}

	private static readPackagesJson(): {peerDependencies: Record<string, string>}[] {
		return DependenciesUpdate.packageJsonPaths.map(path => Files.readJson(path) as {peerDependencies: Record<string, string>});
	}

	private static execute(command: string): void {
		executeCommandWithLog(`${command} --fund false`, `Execute`);
	}

	private static commit(): void {
		const issueNumber = (/OUI-\d+/.exec(Git.getCurrentBranchName()) ?? [])[0];
		Git.commit('chore(toolchain): update dependencies and refactor accordingly', issueNumber);
	}
}

DependenciesUpdate.perform();
