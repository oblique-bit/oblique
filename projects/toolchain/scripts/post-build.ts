import {PackageJson} from '../../../scripts/shared/package-json';
import {Banner} from '../../../scripts/shared/banner';
import {CopyFiles} from '../../../scripts/shared/copy-files';
import {StaticScript} from '../../../scripts/shared/static-script';
import {adaptReadmeLinks} from '../../../scripts/shared/utils';
import {Log} from '../../../scripts/shared/log';

export class PostBuild extends StaticScript {
	private static readonly projectName = 'toolchain';

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
			.copyFile('collection.json', 'src/schematics', 'schematics')
			.finalize();
	}

	private static adaptPackageJson(): void {
		PackageJson.initialize(PostBuild.projectName)
			.addFieldsFromRoot('version', 'author', 'contributors', 'license')
			.removeScripts()
			.write()
			.finalize();
	}
}

PostBuild.perform();
