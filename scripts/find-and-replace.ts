import {readFileSync, readdirSync, renameSync, statSync, writeFileSync} from 'fs';
import path from 'path';
class FindAndReplace {
	private static readonly searchValue = 'oblique-oblique';
	private static readonly replaceValue = 'oblique';
	private static readonly directory = 'dist';

	static perform(): void {
		// Please note that order is important!
		const fileList = FindAndReplace.listFiles(FindAndReplace.directory);
		FindAndReplace.renameInFiles(fileList, FindAndReplace.searchValue, FindAndReplace.replaceValue);
		FindAndReplace.renameFiles(fileList, FindAndReplace.searchValue, FindAndReplace.replaceValue);
	}

	private static listFiles(directory: string): string[] {
		return readdirSync(directory)
			.map(fileName => path.join(directory, fileName))
			.reduce(
				(filePaths, filePath) =>
					statSync(filePath).isDirectory() ? [...filePaths, ...FindAndReplace.listFiles(filePath)] : [...filePaths, filePath],
				[]
			);
	}

	private static renameFiles(fileList: string[], searchValue: string, replaceValue: string): void {
		fileList
			.filter(filePath => filePath.includes(searchValue))
			.forEach(filePath => renameSync(filePath, filePath.replace(searchValue, replaceValue)));
	}

	private static renameInFiles(fileList: string[], searchValue: string, replaceValue: string): void {
		fileList
			.filter(filePath => !filePath.includes(`CHANGELOG.md`))
			.map(filePath => ({file: readFileSync(filePath).toString(), filePath}))
			.filter(fileObject => fileObject.file.includes(searchValue))
			.forEach(fileObject => writeFileSync(fileObject.filePath, fileObject.file.replace(new RegExp(searchValue, `g`), replaceValue)));
	}
}

FindAndReplace.perform();
