import path from 'path';
import {CopyFiles} from '../../../scripts/shared/copy-files';
import {PackageJson} from '../../../scripts/shared/package-json';
import {Banner} from '../../../scripts/shared/banner';
import {StaticScript} from '../../../scripts/shared/static-script';
import {Log} from '../../../scripts/shared/log';
import {adaptReadmeLinks} from '../../../scripts/shared/utils';
import {Files} from '../../../scripts/shared/files';
import {minifyCss} from '../../../scripts/shared/minifyCss';
import {findObliqueRootPath, getAbsolutePath} from '../../../scripts/shared/root';

class PostBuild extends StaticScript {
	private static readonly rootPath = findObliqueRootPath();
	private static readonly projectName = 'design-system';
	private static readonly cssFolder = `${PostBuild.rootPath}/projects/${PostBuild.projectName}/src/lib/css`;

	static async perform(): Promise<void> {
		Log.start('Finalize build');
		PostBuild.copyDistFiles();
		PostBuild.adaptPackageJson();
		await minifyCss(
			`${PostBuild.cssFolder}/oblique.css`,
			`${PostBuild.rootPath}/dist/${PostBuild.projectName}/css/oblique.min.css`
		);
		Banner.addToFilesInProject(PostBuild.projectName);
		adaptReadmeLinks(PostBuild.projectName);
		Log.success();
	}

	private static copyDistFiles(): void {
		const src = getAbsolutePath(`projects/${PostBuild.projectName}/src/lib`);
		CopyFiles.initialize(PostBuild.projectName)
			.copyRootFiles('LICENSE')
			.copyProjectRootFiles('README.md', 'CHANGELOG.md', 'package.json')
			.copyProjectFiles(src, ...Files.list(PostBuild.cssFolder).map(file => path.relative(src, file)))
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
			.removeScripts()
			.write()
			.finalize();
	}
}

void PostBuild.perform();
