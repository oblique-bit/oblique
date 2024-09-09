import {executeCommand, executeCommandWithLog} from './shared/utils';
import {StaticScript} from './shared/static-script';
import {Git} from './shared/git';
import {Log} from './shared/log';
import {Files} from './shared/files';

class Release extends StaticScript {
	static perform(): void {
		Log.start('Release');
		const {version, issue} = Release.parseBranchName();
		executeCommandWithLog(`npm version ${version}`, 'Bump version');
		Release.updateCopyrightDate();
		executeCommand(`npm run release -ws`);
		Git.commit(`chore(toolchain): release version ${version}`, issue);
		Log.success('Push the changes and continue the release process according to the release checklist');
	}

	private static parseBranchName(): {version: string; issue: string} {
		Log.info('Extract the version number and the Jira issue number from the branch name');
		const branchName = Git.getBranchName();
		const regexp = /(?<issue>OUI-\d+).*?(?<version>\d+\.\d+\.\d+(?:-(?:alpha|beta|RC)\.\d+)?)/;
		if (!regexp.test(branchName)) {
			Log.error('The branch MUST contain the version number to release and the Jira issue number');
			process.exit(1);
		}
		return regexp.exec(branchName).groups as {version: string; issue: string};
	}

	private static updateCopyrightDate(): void {
		Log.info(`Update copyright date in LICENSE`);
		Files.overwrite('LICENSE', content => content.replace(/(?!2020-)\d{4}/, new Date().getFullYear().toString()));
	}
}

Release.perform();
