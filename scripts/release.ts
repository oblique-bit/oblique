import {executeCommandWithLog} from './shared/utils';
import {StaticScript} from './shared/static-script';
import {Git} from './shared/git';
import {Log} from './shared/log';
import {Files} from './shared/files';

class Release extends StaticScript {
	static perform(version: string, issue: string): void {
		Log.start('Release');
		Release.validateInputs(version, issue);
		executeCommandWithLog(`npm version ${version}`, 'Bump version');
		Release.updateJenkinsFile(version);
		Release.updateCopyrightDate();
		Release.updatePubliccode(version);
		executeCommandWithLog(`npm run release --workspaces`, 'Perform release');
		Git.commit(`build(release): release version ${version}`, `OUI-${issue}`);
		Log.success('Push the changes and continue the release process according to the release checklist');
	}

	private static validateInputs(version: string, issue: string): void {
		Log.info(`Validate arguments`);
		if (!/^\d+\.\d+\.\d+(?:-(?:alpha|beta|rc)\.\d+)?$/u.test(version)) {
			Log.error(`Version "${version}" is not a valid semver version`);
			process.exit(1);
		}

		if (!/^\d{4}$/u.test(issue)) {
			Log.error(`Issue number "${issue}" is not a valid issue number`);
			process.exit(1);
		}
	}

	private static updateCopyrightDate(): void {
		Log.info(`Update copyright date in LICENSE`);
		Files.overwrite('LICENSE', content => content.replace(/(?!2020-)\d{4}/, new Date().getFullYear().toString()));
	}

	private static updateJenkinsFile(version: string): void {
		if (version.includes('-')) {
			Log.info('Adding publish instruction to JenkinsFile');
			const branchName = Git.getCurrentBranchName();
			Files.overwrite('Jenkinsfile', content =>
				content.replace(
					/(?=master)/,
					`'${branchName}': [\n\t\t\tpublish: [\n\t\t\t\t'@oblique/oblique',\n\t\t\t\t'@oblique/cli',\n\t\t\t\t'@oblique/service-navigation-web-component',\n\t\t\t\t'@oblique/toolchain'\n\t\t\t],\n\t\t\tgitTag: true\n\t\t],\n\t\t`
				)
			);
		}
	}

	private static updatePubliccode(version: string): void {
		// ignores preversions
		if (/^\d+\.\d+\.\d+\$/u.test(version)) {
			Log.info('Update publiccode release version and date');
			const today = new Date().toISOString().split('T')[0];
			Files.overwrite('publiccode.yml', content =>
				content
					.replace(/(?=softwareVersion:\s)\d+\.\d+\.\d+/u, version)
					.replace(/(?=releaseDate:\s)\d{4}-\d{2}-\d{2}/, today)
			);
		}
	}
}

Release.perform(process.argv[2], process.argv[3]);
