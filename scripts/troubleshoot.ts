import {StaticScript} from './shared/static-script';
import {Git} from './shared/git';
import {Log} from './shared/log';
import {Files} from './shared/files';

class Troubleshoot extends StaticScript {
	static perform(): void {
		Log.start('Troubleshoot the release');
		Troubleshoot.createTroubleshootBranch();
		Troubleshoot.adaptJenkinsFile('Jenkinsfile');
		Git.commit('ci(jenkins): troubleshoot release');
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
		Files.overwrite(jenkinsFilePath, content =>
			content.replace(
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
