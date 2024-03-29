import {readFileSync, readdirSync, rmSync, statSync, unlinkSync, writeFileSync} from 'fs';
import path from 'path';

export class Pack {
	private static readonly directory = path.join('..', '..', 'dist', 'service-navigation-web-component');
	private static readonly fileName = 'service-navigation-web-component.js';

	static perform(): void {
		Pack.packJsFiles();
		Pack.removeUnwantedFiles();
		Pack.removeEmptyDirectories();
	}

	private static packJsFiles(): void {
		const content = ['runtime.js', 'polyfills.js', 'main.js']
			.map(fileName => `${Pack.directory}/${fileName}`)
			.map(filePath => readFileSync(filePath).toString())
			.reduce((total, currentFile) => total + currentFile, '');
		writeFileSync(path.join(Pack.directory, Pack.fileName), content);
	}

	private static removeUnwantedFiles(): void {
		Pack.listFiles(Pack.directory)
			.filter(filePath => !new RegExp(`${Pack.fileName}|package.json$`).test(filePath))
			.forEach(filePath => unlinkSync(filePath));
	}

	private static listFiles(directory: string): string[] {
		return readdirSync(directory)
			.map(fileName => path.join(directory, fileName))
			.reduce(
				(filePaths, filePath) =>
					statSync(filePath).isDirectory() ? [...filePaths, ...Pack.listFiles(filePath)] : [...filePaths, filePath],
				[]
			);
	}

	private static removeEmptyDirectories(): void {
		readdirSync(Pack.directory)
			.map(fileName => path.join(Pack.directory, fileName))
			.filter(filePath => statSync(filePath).isDirectory())
			.forEach(filePath => rmSync(filePath, {recursive: true}));
	}
}
