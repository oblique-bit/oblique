import {CopyFiles} from '../../../scripts/shared/copy-files';
import {PackageJson} from '../../../scripts/shared/package-json';
import {Banner} from '../../../scripts/shared/banner';
import {StaticScript} from '../../../scripts/shared/static-script';
import {Log} from '../../../scripts/shared/log';

class PostBuild extends StaticScript {
	private static readonly projectName = 'design-system';

	static perform(): void {
		Log.start('Finalize build');
		PostBuild.copyDistFiles();
		PostBuild.adaptPackageJson();
		PostBuild.addBanner();
		Log.success();
	}

	private static copyDistFiles(): void {
		CopyFiles.initialize(PostBuild.projectName).copyRootFiles('LICENSE').copyProjectRootFiles('README.md', 'CHANGELOG.md').finalize();
	}

	private static adaptPackageJson(): void {
		PackageJson.initialize(PostBuild.projectName)
			.addFieldsFromRoot('version', 'description', 'keywords', 'author', 'contributors', 'homepage', 'repository', 'license', 'bugs')
			.write()
			.finalize();
	}

	private static addBanner(): void {
		Banner.addToFilesInProject(PostBuild.projectName);
	}
}

PostBuild.perform();
