import {readFileSync, readdirSync, statSync, writeFileSync} from 'fs';
import path from 'path';

export class UpdatePaths {
	private static readonly stylesDirectoryPath: string = path.join('..', '..', 'dist', 'oblique', 'styles');

	static perform(): void {
		UpdatePaths.updateBackgroundImagePath();
	}

	private static updateBackgroundImagePath(): void {
		UpdatePaths.replaceInFiles(
			[path.join(UpdatePaths.stylesDirectoryPath, 'css', 'oblique-components.css')],
			'cover-background.jpg',
			'~@oblique/oblique/assets/images/cover-background.jpg'
		);
	}

	private static listFiles(directory: string): string[] {
		return readdirSync(directory)
			.map(fileName => path.join(directory, fileName))
			.reduce(
				(filePaths, filePath) =>
					statSync(filePath).isDirectory() ? [...filePaths, ...UpdatePaths.listFiles(filePath)] : [...filePaths, filePath],
				[]
			);
	}

	private static replaceInFiles(filePathList: string[], searchValue: string | RegExp, replaceValue: string): void {
		filePathList
			.map(filePath => ({file: readFileSync(filePath).toString(), filePath}))
			.filter(fileObject => (typeof searchValue === 'string' ? fileObject.file.includes(searchValue) : searchValue.test(fileObject.file)))
			.forEach(fileObject => writeFileSync(fileObject.filePath, fileObject.file.replace(new RegExp(searchValue, 'g'), replaceValue)));
	}
}
