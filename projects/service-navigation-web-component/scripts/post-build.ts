import {PackageJson} from '../../../scripts/shared/package-json';
import {adaptReadmeLinks, humanizeList} from '../../../scripts/shared/utils';
import {Banner} from '../../../scripts/shared/banner';
import {CopyFiles} from '../../../scripts/shared/copy-files';
import {StaticScript} from '../../../scripts/shared/static-script';
import {Log} from '../../../scripts/shared/log';
import {Files} from '../../../scripts/shared/files';

export class PostDist extends StaticScript {
	static perform(): void {
		Log.start('Finalize build');
		PostDist.adaptPackageJson();
		PostDist.pack();
		PostDist.copyProjectFiles();
		Banner.addToFilesInProject('service-navigation-web-component');
		adaptReadmeLinks('service-navigation-web-component');
		Log.success();
	}

	private static adaptPackageJson(): void {
		PackageJson.initialize('service-navigation-web-component')
			.addFieldsFromRoot('version', 'author', 'contributors', 'license')
			.removeDependencies('devDependencies', '@angular/elements')
			.write()
			.finalize();
	}

	private static pack(): void {
		const directory = '../../dist/service-navigation-web-component';
		const fileName = 'service-navigation-web-component.js';
		PostDist.packJsFiles(directory, fileName);
		PostDist.removeUnwantedFiles(directory, fileName);
		PostDist.removeEmptyDirectories(directory);
	}

	private static copyProjectFiles(): void {
		CopyFiles.initialize('service-navigation-web-component')
			.copyRootFiles('LICENSE')
			.copyProjectRootFiles('README.md', 'CHANGELOG.md')
			.finalize();
	}

	private static packJsFiles(directory: string, packFileName: string): void {
		const files = ['runtime.js', 'polyfills.js', 'main.js'];
		Log.info(`Pack ${humanizeList(files)} files together`);
		const content = files
			.map(fileName => `${directory}/${fileName}`)
			.map(filePath => Files.read(filePath))
			.reduce((total, currentFile) => total + currentFile, '');
		Files.write(`${directory}/${packFileName}`, content);
	}

	private static removeUnwantedFiles(directory: string, packFileName: string): void {
		const files = Files.list(directory).filter(filePath => !new RegExp(`${packFileName}|package.json$`, 'u').test(filePath));
		Log.info(`Remove unnecessary files`);
		files.forEach(filePath => Files.remove(filePath));
	}

	private static removeEmptyDirectories(directory: string): void {
		Log.info(`Remove empty directories`);
		Files.readDirectory(directory)
			.map(fileName => `${directory}/${fileName}`)
			.filter(filePath => Files.isDirectory(filePath))
			.forEach(filePath => Files.remove(filePath));
	}
}

PostDist.perform();
