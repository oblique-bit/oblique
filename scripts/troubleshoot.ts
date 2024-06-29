import {executeCommand} from './shared/utils';
import {readFileSync, writeFileSync} from 'fs';

class Troubleshoot {
	static perform(): void {
		Troubleshoot.createTroubleshootBranch();
		Troubleshoot.adaptJenkinsFile('Jenkinsfile');
		executeCommand('git commit -am "chore(toolchain): troubleshoot release" --no-verify');
	}

	private static createTroubleshootBranch(): void {
		executeCommand('git fetch --all');
		executeCommand('git checkout -b troubleshoot --no-track origin/master');
	}

	private static adaptJenkinsFile(jenkinsFilePath: string): void {
		writeFileSync(
			jenkinsFilePath,
			readFileSync(jenkinsFilePath)
				.toString()
				.replace(
					/(?<=branches = \[\s\t\t).*(?=\s\t])/ms,
					`troubleshoot: [
			build: 'npm run build -w projects/sds',
			cloudFoundry: [[project: 'sds', space: 'prod']],
			gitTag: 'origin/master'
		]`
				)
		);
	}
}

Troubleshoot.perform();
