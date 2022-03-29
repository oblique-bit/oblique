import {copyFileSync, mkdirSync, readdirSync, statSync} from 'fs';
import path from 'path';

class SchematicsCopy {
	static perform(): void {
		const excludedFiles = ['package-lock.json', 'tsconfig.schematics.json'];
		SchematicsCopy.copyFiles(
			SchematicsCopy.listFiles(path.join('projects', 'oblique', 'schematics'))
				.filter(filePath => /\.(?:json|html|config)$/.test(filePath))
				.filter(filePath => !excludedFiles.includes(path.basename(filePath)))
		);
	}

	private static listFiles(directory: string): string[] {
		return readdirSync(directory)
			.map(fileName => path.join(directory, fileName))
			.reduce(
				(filePaths, filePath) =>
					statSync(filePath).isDirectory() ? [...filePaths, ...SchematicsCopy.listFiles(filePath)] : [...filePaths, filePath],
				[]
			);
	}

	private static copyFiles(fileList: string[]): void {
		fileList.forEach(sourcePath => {
			const targetPath: string = sourcePath.replace('projects', 'dist');
			mkdirSync(path.dirname(targetPath), {recursive: true});
			copyFileSync(sourcePath, targetPath);
		});
	}
}

SchematicsCopy.perform();
