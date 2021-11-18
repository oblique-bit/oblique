class FindAndReplace {
	private static readonly fs = require('fs');
	private static readonly path = require('path');

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
		return FindAndReplace.fs
			.readdirSync(directory)
			.map(fileName => FindAndReplace.path.join(directory, fileName))
			.reduce(
				(filePaths, filePath) =>
					FindAndReplace.fs.statSync(filePath).isDirectory() ? [...filePaths, ...FindAndReplace.listFiles(filePath)] : [...filePaths, filePath],
				[]
			);
	}

	private static renameFiles(fileList: string[], searchValue: string, replaceValue: string): void {
		fileList
			.filter(filePath => filePath.includes(searchValue))
			.forEach(filePath => FindAndReplace.fs.renameSync(filePath, filePath.replace(searchValue, replaceValue)));
	}

	private static renameInFiles(fileList: string[], searchValue: string, replaceValue: string): void {
		fileList
			.filter(filePath => !filePath.includes(`CHANGELOG.md`))
			.map(filePath => ({file: FindAndReplace.fs.readFileSync(filePath).toString(), filePath}))
			.filter(fileObject => fileObject.file.includes(searchValue))
			.forEach(fileObject => FindAndReplace.fs.writeFileSync(fileObject.filePath, fileObject.file.replace(new RegExp(searchValue, `g`), replaceValue)));
	}
}

FindAndReplace.perform();
