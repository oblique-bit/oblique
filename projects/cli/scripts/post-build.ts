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
		CopyFiles.initialize(PostBuild.projectName)
			.copyRootFiles('LICENSE')
			.copyProjectRootFiles('README.md', 'CHANGELOG.md', 'package.json')
			.finalize();
		PostBuild.adaptPackageJson();
		PostBuild.addBanner();
		adaptReadmeLinks(PostBuild.projectName);
		Log.success();
	}

	private static adaptPackageJson(): void {
		PackageJson.initialize(PostBuild.projectName)
			.addFieldsFromRoot('version', 'author', 'contributors', 'license')
			.removeScripts()
			.write()
			.finalize();
	}

	private static addBanner(): void {
		Banner.addToFilesInProject(PostBuild.projectName);
	}
}

PostBuild.perform();