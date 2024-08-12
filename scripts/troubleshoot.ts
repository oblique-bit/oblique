import {StaticScript} from './shared/static-script';
import {readFileSync, writeFileSync} from 'fs';
import {Git} from './shared/git';
import {Log} from './shared/log';

class Troubleshoot extends StaticScript {
	static perform(): void {
		Log.start('Troubleshoot the release');
		Troubleshoot.createTroubleshootBranch();
		Troubleshoot.adaptJenkinsFile('Jenkinsfile');
		Git.commit('chore(toolchain): troubleshoot release');
		Log.success(
			'Push the changes with: `git push -u origin troubleshoot` and continue the troubleshooting process according to the troubleshoot checklist.'
		);
	}

	private static createTroubleshootBranch(): void {
		Git.fetch('master');
		Git.createBranchFrom('troubleshoot', 'origin/master');
	}

	private static adaptJenkinsFile(jenkinsFilePath: string): void {
		Log.info('Update JenkinsFile');
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
