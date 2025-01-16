import {PackageJson} from '../../../scripts/shared/package-json';
import {Banner} from '../../../scripts/shared/banner';
import {CopyFiles} from '../../../scripts/shared/copy-files';
import {StaticScript} from '../../../scripts/shared/static-script';
import {adaptReadmeLinks} from '../../../scripts/shared/utils';
import {Log} from '../../../scripts/shared/log';

export class PostBuild extends StaticScript {
	private static readonly projectName = 'cli';

	static perform(): void {
		Log.start('Finalize build');
		PostBuild.copyProjectFiles();
		PostBuild.adaptPackageJson();
		Banner.addToFilesInProject(PostBuild.projectName);
		adaptReadmeLinks(PostBuild.projectName);
		Log.success();
	}

	private static copyProjectFiles(): void {
		CopyFiles.initialize(PostBuild.projectName)
			.copyRootFiles('LICENSE')
			.copyProjectRootFiles('README.md', 'CHANGELOG.md', 'package.json')
			.finalize();
	}

	private static adaptPackageJson(): void {
		PackageJson.initialize(PostBuild.projectName)
			.addFieldsFromRoot('version', 'author', 'contributors', 'license')
			.copyDependenciesFromRoot('tslib')
			.removeScripts()
			.write()
			.finalize();
	}
}

PostBuild.perform();
