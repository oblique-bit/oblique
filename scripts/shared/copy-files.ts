import {StaticScript} from './static-script';
import {Log} from './log';
import {humanizeList} from './utils';
import {Files} from './files';

export class CopyFiles extends StaticScript {
	private distFolder: string;

	static initialize(projectName: string): CopyFiles {
		StaticScript.instance = new CopyFiles();
		(StaticScript.instance as CopyFiles).distFolder = `../../dist/${projectName}`;
		return CopyFiles.instance as CopyFiles;
	}

	copyRootFiles(...fileList: string[]): CopyFiles {
		Log.info(`Add ${humanizeList(fileList)} to the distribution`);
		fileList.forEach(fileName => {
			Files.copy(`../../${fileName}`, `${this.distFolder}/${fileName}`);
		});
		return CopyFiles.instance as CopyFiles;
	}

	copyProjectFiles(source: string, ...fileList: string[]): CopyFiles {
		Log.info(`Add assets to the distribution`);
		fileList
			.map(filePath => ({
				source: filePath,
				destination: filePath.replace(source, this.distFolder)
			}))
			.forEach(file => {
				Files.copy(file.source, file.destination);
			});
		return CopyFiles.instance as CopyFiles;
	}

	copyProjectRootFiles(...fileList: string[]): CopyFiles {
		Log.info(`Add ${humanizeList(fileList)} to the distribution`);
		fileList.forEach(fileName => {
			Files.copy(fileName, `${this.distFolder}/${fileName}`);
		});
		return CopyFiles.instance as CopyFiles;
	}

	copyFile(fileName: string, source: string, destination: string): CopyFiles {
		Log.info(`Add ${fileName} to the distribution`);
		const destinationFolder = `${this.distFolder}/${destination}`;
		Files.copy(`${source}/${fileName}`, `${destinationFolder}/${fileName}`);
		return CopyFiles.instance as CopyFiles;
	}
}
