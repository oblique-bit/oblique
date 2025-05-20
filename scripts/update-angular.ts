import {executeCommandWithLog} from './shared/utils';
import {StaticScript} from './shared/static-script';
import {Log} from './shared/log';
import {Files} from './shared/files';
import {Git} from './shared/git';

interface Dependencies {
	dependencies: Record<string, string>;
	devDependencies: Record<string, string>;
	peerDependencies: Record<string, string>;
	[key: string]: unknown;
}

class UpdateAngular extends StaticScript {
	private static readonly packageJsonPath = 'package.json';

	static perform(): void {
		Log.start('Update Angular and related dependencies');
		UpdateAngular.updateAngular();
		UpdateAngular.updateAngularMaterial();
		UpdateAngular.updatePeerDependencies();
		UpdateAngular.cleanupNodeModules();
		Log.success();
	}

	private static updateAngular(): void {
		// Angular update schematics don't work well with NPM workspaces, therefore all angular dependencies must be present in the root package.json to be correctly updated
		const projects = UpdateAngular.listProjects();
		const rootPackageJson = Files.readJson(UpdateAngular.packageJsonPath) as Dependencies;
		const ngDependencies = UpdateAngular.listNgDependencies(rootPackageJson, projects);
		UpdateAngular.addDependenciesInRootPackageJson(rootPackageJson, ngDependencies);
		executeCommandWithLog(
			'ng update @angular/cli @angular/core @angular-builders/jest @angular-eslint/schematics @schematics/angular --allow-dirty',
			'Update Angular'
		);
		UpdateAngular.updatePackageDependencies(projects);
		UpdateAngular.removeDependenciesFromRootPackageJson(Object.keys(ngDependencies));
		Git.commit('build(dependencies): update Angular');
	}

	private static listProjects(): string[] {
		return Files.listDirectories('projects')
			.map(directory => `${directory}/package.json`)
			.filter(path => Files.exists(path));
	}

	private static listNgDependencies(rootPackageJson: Dependencies, projects: string[]): Record<string, string> {
		const packageDependencies = UpdateAngular.listPackageDependencies(projects);
		return Object.keys(packageDependencies)
			.filter(key => key.startsWith('@angular') || key.startsWith('@schematics') || key === 'ng-packagr')
			.filter(key => !rootPackageJson.dependencies[key] && !rootPackageJson.devDependencies[key])
			.reduce((dependencies, dependencyName) => ({...dependencies, [dependencyName]: packageDependencies[dependencyName]}), {});
	}

	private static listPackageDependencies(projects: string[]): Record<string, string> {
		return projects
			.map(path => Files.readJson(path) as Dependencies)
			.map(packageJson => ({...(packageJson.dependencies || {}), ...(packageJson.devDependencies || {})}))
			.reduce((allDependencies, currentDependencies) => ({...allDependencies, ...currentDependencies}), {});
	}

	private static addDependenciesInRootPackageJson(rootPackageJson: Dependencies, ngDependencies: Record<string, string>): void {
		Log.info("Add packages' dependencies to root package.json");
		rootPackageJson.dependencies = {...rootPackageJson.dependencies, ...ngDependencies};
		Files.writeJson(UpdateAngular.packageJsonPath, rootPackageJson);
	}

	private static updatePackageDependencies(projects: string[]): void {
		const rootDependencies = (Files.readJson(UpdateAngular.packageJsonPath) as Dependencies).dependencies;
		projects
			.map(path => ({path, content: Files.readJson(path) as Dependencies}))
			.forEach(packageJson => {
				Object.keys(rootDependencies).forEach(rootDependency => {
					if (packageJson.content.dependencies?.[rootDependency]) {
						packageJson.content.dependencies[rootDependency] = rootDependencies[rootDependency];
					}
					if (packageJson.content.devDependencies?.[rootDependency]) {
						packageJson.content.devDependencies[rootDependency] = rootDependencies[rootDependency];
					}
					Files.writeJson(packageJson.path, packageJson.content);
				});
			});
	}

	private static removeDependenciesFromRootPackageJson(ngDependencies: string[]): void {
		const rootPackageJson = Files.readJson(UpdateAngular.packageJsonPath) as Dependencies;
		ngDependencies.forEach(dependency => {
			delete rootPackageJson.dependencies[dependency];
		});
		Files.writeJson(UpdateAngular.packageJsonPath, rootPackageJson);
	}

	private static updateAngularMaterial(): void {
		// Angular Material update schematics need a root tsconfig.spec.json file
		Log.info('Create temporary tsconfig.spec.json file');
		Files.write('tsconfig.spec.json', '{}');
		executeCommandWithLog('ng update @angular/material --allow-dirty', 'Update Angular Material');
		Log.info('Remove temporary tsconfig.spec.ts file');
		Files.remove('tsconfig.spec.json');
		UpdateAngular.updateAngularCDKVersion();
		Git.commit('build(dependencies): update Angular Material');
	}

	private static updateAngularCDKVersion(): void {
		const dependencyName = '@angular/cdk';
		const obliquePackageJsonPath = 'projects/oblique/package.json';
		const cdkVersion = (Files.readJson(UpdateAngular.packageJsonPath) as Dependencies).dependencies[dependencyName];
		const packageJson = Files.readJson(obliquePackageJsonPath) as Dependencies;
		packageJson.dependencies[dependencyName] = cdkVersion;
		Files.writeJson(obliquePackageJsonPath, packageJson);
	}

	private static updatePeerDependencies(): void {
		Log.info('Update peer dependencies');
		const rootDependencies = (Files.readJson(UpdateAngular.packageJsonPath) as Dependencies).dependencies;
		UpdateAngular.listProjects()
			.map(path => ({path, content: Files.readJson(path) as Dependencies}))
			.filter(({content}) => !!content.peerDependencies)
			.forEach(({path, content}) => {
				Object.keys(content.peerDependencies)
					.filter(dependency => dependency.startsWith('@angular/'))
					.forEach(dependency => {
						const majorVersion = parseInt(/\d+(?=\.\d+\.\d+)/.exec(rootDependencies[dependency])[0], 10);
						content.peerDependencies[dependency] = `^${majorVersion}.0.0 || ^${majorVersion + 1}.0.0`;
					});
				Files.writeJson(path, content);
			});
	}

	private static cleanupNodeModules(): void {
		Log.info('Cleanup dependencies');
		executeCommandWithLog('npm dedupe --audit false --fund false', 'Execute:');
		executeCommandWithLog('npm prune --audit false --fund false', 'Execute:');
		Files.listDirectories('projects')
			.map(project => `${project}/node_modules`)
			.filter(project => Files.exists(project))
			.forEach(project => Files.remove(project));
	}
}

UpdateAngular.perform();
