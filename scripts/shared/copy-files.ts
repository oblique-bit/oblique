import path from 'path';
import {StaticScript} from './static-script';
import {copyFileSync, mkdirSync} from 'fs';

export class CopyFiles extends StaticScript {
	private distFolder: string;

	static initialize(projectName: string): CopyFiles {
		StaticScript.instance = new CopyFiles();
		(StaticScript.instance as CopyFiles).distFolder = path.join('..', '..', 'dist', projectName);
		return CopyFiles.instance as CopyFiles;
	}

	copyRootFiles(...fileList: string[]): CopyFiles {
		fileList.forEach(fileName => {
			copyFileSync(path.join('..', '..', fileName), path.join(this.distFolder, fileName));
		});
		return CopyFiles.instance as CopyFiles;
	}

	copyProjectFiles(source: string, ...fileList: string[]): CopyFiles {
		fileList
			.map(filePath => ({
				source: filePath,
				destination: filePath.replace(source, this.distFolder)
			}))
			.forEach(file => {
				mkdirSync(path.dirname(file.destination), {recursive: true});
				copyFileSync(file.source, file.destination);
			});
		return CopyFiles.instance as CopyFiles;
	}

	copyProjectRootFiles(...fileList: string[]): CopyFiles {
		fileList.forEach(fileName => {
			copyFileSync(fileName, path.join(this.distFolder, fileName));
		});
		return CopyFiles.instance as CopyFiles;
	}

	copyFile(fileName: string, source: string, destination: string): CopyFiles {
		const destinationFolder = path.join(this.distFolder, destination);
		mkdirSync(destinationFolder, {recursive: true});
		copyFileSync(path.join(source, fileName), path.join(destinationFolder, fileName));
		return CopyFiles.instance as CopyFiles;
	}
}
