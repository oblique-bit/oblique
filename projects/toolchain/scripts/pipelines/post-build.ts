import path from 'path';
import {PackageJson} from '../../../../scripts/shared/package-json';
import {Banner} from '../../../../scripts/shared/banner';
import {CopyFiles} from '../../../../scripts/shared/copy-files';
import {StaticScript} from '../../../../scripts/shared/static-script';
import {adaptReadmeLinks} from '../../../../scripts/shared/utils';
import {getAbsolutePath} from '../../../../scripts/shared/root';
import {Log} from '../../../../scripts/shared/log';
import {Files} from '../../../../scripts/shared/files';

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
		const src = getAbsolutePath(`projects/${PostBuild.projectName}/src`);
		CopyFiles.initialize(PostBuild.projectName)
			.copyRootFiles('LICENSE')
			.copyProjectRootFiles('README.md', 'CHANGELOG.md', 'package.json')
			.copyFile('package.json', 'src/schematics', 'schematics')
			.copyFile('collection.json', 'src/schematics', 'schematics')
			.copyFile('schema.json', 'src/schematics/ng-add', 'schematics/ng-add')
			.copyFile('schema.json', 'src/schematics/linting', 'schematics/linting')
			.copyFile('eslint-config-oblique.mjs', 'src/linting/', 'linting')
			.copyProjectFiles(
				src,
				...Files.list(getAbsolutePath(`projects/${PostBuild.projectName}/src/schematics/ng-add/templates`)).map(file =>
					path.relative(src, file)
				)
			)
			.copyProjectFiles(
				src,
				...Files.list(getAbsolutePath(`projects/${PostBuild.projectName}/src/schematics/linting/templates`)).map(file =>
					path.relative(src, file)
				)
			)
			.finalize();
		Files.writeJson(getAbsolutePath(`dist/${PostBuild.projectName}/logger/package.json`), {type: 'commonjs'});
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
