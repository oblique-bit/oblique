import {readFileSync, readdirSync, statSync, writeFileSync} from 'fs';
import path from 'path';

class UpdatePaths {
	private static readonly stylesDirectoryPath: string = path.join('dist', 'oblique', 'styles');
	private static readonly fontAwesomePath = '~@fortawesome/fontawesome-free';
	private static readonly obliquePath = '~@oblique/oblique/styles';

	static perform(): void {
		UpdatePaths.updateBackgroundImagePath();
		UpdatePaths.updateScssFontAwesomePaths();
		UpdatePaths.updateCssFontAwesomePaths();
	}

	private static updateBackgroundImagePath(): void {
		UpdatePaths.replaceInFiles(
			[path.join(UpdatePaths.stylesDirectoryPath, 'css', 'oblique-components.css')],
			'cover-background.jpg',
			'~@oblique/oblique/assets/images/cover-background.jpg'
		);
	}

	private static updateScssFontAwesomePaths(): void {
		const scssFilePaths = this.listFiles(path.join(UpdatePaths.stylesDirectoryPath, 'scss')).filter(filePath => filePath.endsWith('.scss'));
		UpdatePaths.replaceInFiles(scssFilePaths, `${UpdatePaths.fontAwesomePath}/webfonts`, `${UpdatePaths.obliquePath}/fonts`);
		UpdatePaths.replaceInFiles(scssFilePaths, `${UpdatePaths.fontAwesomePath}/scss`, `${UpdatePaths.obliquePath}/scss/fontawesome`);
	}

	private static updateCssFontAwesomePaths(): void {
		UpdatePaths.replaceInFiles(
			[path.join(UpdatePaths.stylesDirectoryPath, 'css', 'oblique-core.css')],
			/(?<=url\()fa-/,
			'~@oblique/oblique/styles/fonts/fa-'
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

UpdatePaths.perform();
