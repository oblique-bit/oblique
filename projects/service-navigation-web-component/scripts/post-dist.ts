import {readFileSync, readdirSync, rmSync, statSync, unlinkSync, writeFileSync} from 'fs';
import path from 'path';
import {PackageJson} from '../../../scripts/shared/package-json';
import {adaptReadmeLinks, humanizeList, listFiles} from '../../../scripts/shared/utils';
import {Banner} from '../../../scripts/shared/banner';
import {CopyFiles} from '../../../scripts/shared/copy-files';
import {StaticScript} from '../../../scripts/shared/static-script';
import {Log} from '../../../scripts/shared/log';

export class PostDist extends StaticScript {
	static perform(): void {
		Log.start('Finalize build');
		PostDist.adaptPackageJson();
		PostDist.pack();
		PostDist.addBanner();
		CopyFiles.initialize('service-navigation-web-component')
			.copyRootFiles('LICENSE')
			.copyProjectRootFiles('README.md', 'CHANGELOG.md')
			.finalize();
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
		const directory = path.join('..', '..', 'dist', 'service-navigation-web-component');
		const fileName = 'service-navigation-web-component.js';
		PostDist.packJsFiles(directory, fileName);
		PostDist.removeUnwantedFiles(directory, fileName);
		PostDist.removeEmptyDirectories(directory);
	}

	private static addBanner(): void {
		Banner.addToFilesInProject('service-navigation-web-component');
	}

	private static packJsFiles(directory: string, packFileName: string): void {
		const files = ['runtime.js', 'polyfills.js', 'main.js'];
		Log.info(`Pack ${humanizeList(files)} files together`);
		const content = files
			.map(fileName => `${directory}/${fileName}`)
			.map(filePath => readFileSync(filePath).toString())
			.reduce((total, currentFile) => total + currentFile, '');
		writeFileSync(path.join(directory, packFileName), content);
	}

	private static removeUnwantedFiles(directory: string, packFileName: string): void {
		const files = listFiles(directory).filter(filePath => !new RegExp(`${packFileName}|package.json$`).test(filePath));
		Log.info(`Remove unnecessary files`);
		files.forEach(filePath => unlinkSync(filePath));
	}

	private static removeEmptyDirectories(directory: string): void {
		Log.info(`Remove empty directories`);
		readdirSync(directory)
			.map(fileName => path.join(directory, fileName))
			.filter(filePath => statSync(filePath).isDirectory())
			.forEach(filePath => rmSync(filePath, {recursive: true}));
	}
}

PostDist.perform();
