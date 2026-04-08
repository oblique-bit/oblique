import path from 'path';
import {StaticScript} from './static-script';
import {Log} from './log';
import {humanizeList} from './utils';
import {getAbsolutePath} from './root';
import {Files} from './files';

export class CopyFiles extends StaticScript {
	private projectRootFolder: string;
	private projectDistFolder: string;

	static initialize(projectName: string): CopyFiles {
		StaticScript.instance = new CopyFiles();

		(StaticScript.instance as CopyFiles).projectRootFolder = getAbsolutePath(`projects/${projectName}`);
		(StaticScript.instance as CopyFiles).projectDistFolder = getAbsolutePath(`dist/${projectName}`);

		return CopyFiles.instance as CopyFiles;
	}

	copyRootFiles(...fileList: string[]): CopyFiles {
		Log.info(`Add ${humanizeList(fileList)} to the distribution`);
		fileList.forEach(fileName => {
			Files.copy(getAbsolutePath(fileName), `${this.projectDistFolder}/${fileName}`);
		});
		return CopyFiles.instance as CopyFiles;
	}

	copyProjectFiles(source: string, ...fileList: string[]): CopyFiles {
		Log.info(`Add assets to the distribution`);
		fileList
			.map(filePath => {
				const src = `${source}${path.sep}${filePath}`;
				return {
					source: src,
					destination: src.replace(source, this.projectDistFolder),
				};
			})
			.forEach(file => {
				Files.copy(file.source, file.destination);
			});
		return CopyFiles.instance as CopyFiles;
	}

	copyProjectRootFiles(...fileList: string[]): CopyFiles {
		Log.info(`Add ${humanizeList(fileList)} to the distribution`);
		fileList.forEach(fileName => {
			Files.copy(`${this.projectRootFolder}/${fileName}`, `${this.projectDistFolder}/${fileName}`);
		});
		return CopyFiles.instance as CopyFiles;
	}

	copyFile(fileName: string, source: string, destination: string): CopyFiles {
		Log.info(`Add ${fileName} to the distribution`);
		const srcFolder = `${this.projectRootFolder}/${source}`;
		const destinationFolder = `${this.projectDistFolder}/${destination}`;
		Files.copy(`${srcFolder}/${fileName}`, `${destinationFolder}/${fileName}`);
		return CopyFiles.instance as CopyFiles;
	}
}
