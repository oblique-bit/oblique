import path from 'path';
import {copyFileSync, mkdirSync} from 'fs';

export class CopyFiles {
	private static instance: CopyFiles;
	private distFolder: string;

	// the constructor needs to be private to impede the class instantiation
	private constructor() {
		if (CopyFiles.instance) {
			throw new Error('The "finalize" method needs to be called before calling "initialize" again.');
		}
	}

	static initialize(projectName: string): CopyFiles {
		this.instance = new CopyFiles();
		this.instance.distFolder = path.join('..', '..', 'dist', projectName);
		return this.instance;
	}

	copyRootFiles(...fileList: string[]): CopyFiles {
		fileList.forEach(fileName => {
			copyFileSync(path.join('..', '..', fileName), path.join(this.distFolder, fileName));
		});
		return CopyFiles.instance;
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
		return CopyFiles.instance;
	}

	copyProjectRootFiles(...fileList: string[]): CopyFiles {
		fileList.forEach(fileName => {
			copyFileSync(fileName, path.join(this.distFolder, fileName));
		});
		return CopyFiles.instance;
	}

	copyFile(fileName: string, source: string, destination: string): CopyFiles {
		const destinationFolder = path.join(this.distFolder, destination);
		mkdirSync(destinationFolder, {recursive: true});
		copyFileSync(path.join(source, fileName), path.join(destinationFolder, fileName));
		return CopyFiles.instance;
	}

	finalize(): void {
		CopyFiles.instance = undefined;
	}
}
