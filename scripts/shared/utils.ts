import {ExecSyncOptions, execSync} from 'child_process';
import {Log} from './log';
import {Files} from './files';

export function executeCommand(command: string, options?: ExecSyncOptions): void {
	execSync(command, options);
}

export function executeCommandWithLog(command: string, messagePrefix: string, options: ExecSyncOptions = {}): void {
	Log.info(`${messagePrefix}: ${command}`);
	try {
		execSync(command, {...options, stdio: 'pipe'});
	} catch (rawError) {
		const error = rawError as {stdout: Buffer; stderr: Buffer};
		const errorMessage = [error.stdout, error.stderr]
			.filter(buffer => !!buffer)
			.map(buffer => buffer.toString())
			.join('\n');
		fatal(errorMessage);
	}
}

export function getResultFromCommand(command: string, options?: ExecSyncOptions): string {
	return execSync(command, options).toString().trim();
}

export function hasFlag(flag: string): boolean {
	return process.argv.some(arg => arg === `--${flag}`);
}

export function camelToKebabCase(key: string): string {
	return key.replace(/[A-Z]/g, match => `-${match.toLowerCase()}`);
}

export function updatePackageJsonVersion(version: string): void {
	Log.info(`Update package.json version to ${version}.`);
	const fileContent = Files.readJson('package.json') as Record<'version', string>;
	fileContent.version = version;
	Files.writeJson('package.json', fileContent);
}

export function updateSonarPropertiesVersion(version: string): void {
	Log.info(`Update Sonar properties' project version to ${version}.`);
	Files.overwrite('sonar-project.properties', content => content.replace(/(?<=sonar\.projectVersion=)\d+\.\d+\.\d+/, version));
}

export function adaptReadmeLinks(project: string): void {
	Log.info('Update links in the distributed README.md');
	const filePath = `../../dist/${project}/README.md`;
	Files.overwrite(filePath, content =>
		content
			.replace('../../README.md)', 'https://github.com/oblique-bit/oblique/blob/master/README.md) on GitHub')
			.replace('../../CONTRIBUTING.md)', 'https://github.com/oblique-bit/oblique/blob/master/CONTRIBUTING.md) on GitHub')
			.replace('../../LICENSE', 'LICENSE')
	);
}

export function humanizeList(list: string[]): string {
	return list.join(', ').replace(/,(?=[^,]*$)/, ' and');
}

export function fatal(error: string): void {
	Log.error(error);
	process.exit(-1);
}
