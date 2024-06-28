import {StaticScript} from './shared/static-script';
import {readFileSync, writeFileSync} from 'fs';
import {Git} from './shared/git';

class Troubleshoot extends StaticScript {
	static perform(): void {
		Troubleshoot.createTroubleshootBranch();
		Troubleshoot.adaptJenkinsFile('Jenkinsfile');
		Git.commit('chore(toolchain): troubleshoot release');
	}

	private static createTroubleshootBranch(): void {
		Git.fetch('master');
		Git.createBranchFrom('troubleshoot', 'origin/master');
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
			gitTag: 'origin/master',
			gitPush: [
				credentialId: 'githubObliqueCredentials',
				repository: 'https://github.com/oblique-bit/oblique.git',
				branch: 'master'
			]
		]`
				)
		);
	}
}

Troubleshoot.perform();
