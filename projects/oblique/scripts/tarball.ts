import {executeCommand, executeCommandWithLog, fatal, getResultFromCommand} from '../../../scripts/shared/utils';
import {StaticScript} from '../../../scripts/shared/static-script';
import {Log} from '../../../scripts/shared/log';
import {Files} from '../../../scripts/shared/files';

class Tarball extends StaticScript {
	static perform(targetProjects: string[]): void {
		Log.start(`Create ${targetProjects.length ? 'and install ' : ''}tarball`);
		const tarballName = Tarball.buildTarball();
		targetProjects.forEach(targetProject => Tarball.installInProject(targetProject, tarballName));
		Log.success();
	}

	private static buildTarball(): string {
		executeCommandWithLog('npm run build', 'Build Oblique');
		Log.info('Pack Oblique');
		const data = getResultFromCommand('npm pack', {cwd: Files.buildOSSafePath('../../dist/oblique')});
		return /oblique-oblique-\d+\.\d+\.\d+(?:-(?:alpha|beta|rc)\.\d+)?\.tgz/.exec(data)[0];
	}

	private static installInProject(targetProject: string, tarball: string): void {
		const destination = Files.buildOSSafePath(process.cwd(), targetProject);
		this.validateProject(destination);
		Log.info(`Copy ${tarball} into ${destination}`);
		Files.copy(`../../dist/oblique/${tarball}`, `${destination}/${tarball}`);
		Log.info(`Install ${tarball} in ${destination}`);
		executeCommand(`npm install ${tarball}`, {cwd: destination});
	}

	private static validateProject(targetProject: string): void {
		const packagePath = Files.buildOSSafePath(targetProject, 'package.json');
		if (!Files.exists(packagePath)) {
			fatal(`${packagePath} does not exist`);
		}
	}
}

Tarball.perform(process.argv.slice(2));
