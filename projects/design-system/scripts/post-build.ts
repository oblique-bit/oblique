import {CopyFiles} from '../../../scripts/shared/copy-files';
import {PackageJson} from '../../../scripts/shared/package-json';
import {Banner} from '../../../scripts/shared/banner';
import {StaticScript} from '../../../scripts/shared/static-script';
import {Log} from '../../../scripts/shared/log';
import {adaptReadmeLinks} from '../../../scripts/shared/utils';
import {Files} from '../../../scripts/shared/files';
import {minifyCss} from '../../../scripts/shared/minifyCss';

class PostBuild extends StaticScript {
	private static readonly projectName = 'design-system';
	private static readonly cssFolder = 'src/lib/css';

	static async perform(): Promise<void> {
		Log.start('Finalize build');
		PostBuild.copyDistFiles();
		PostBuild.adaptPackageJson();
		await minifyCss(`${PostBuild.cssFolder}/oblique.css`, `${PostBuild.projectName}/css/oblique.min.css`);
		Banner.addToFilesInProject(PostBuild.projectName);
		adaptReadmeLinks(PostBuild.projectName);
		Log.success();
	}

	private static copyDistFiles(): void {
		CopyFiles.initialize(PostBuild.projectName)
			.copyRootFiles('LICENSE')
			.copyProjectRootFiles('README.md', 'CHANGELOG.md')
			.copyProjectFiles(Files.buildOSSafePath('src/lib'), ...Files.list(PostBuild.cssFolder))
			.finalize();
	}

	private static adaptPackageJson(): void {
		PackageJson.initialize(PostBuild.projectName)
			.addFieldsFromRoot(
				'version',
				'description',
				'keywords',
				'author',
				'contributors',
				'homepage',
				'repository',
				'license',
				'bugs'
			)
			.write()
			.finalize();
	}
}

void PostBuild.perform();
