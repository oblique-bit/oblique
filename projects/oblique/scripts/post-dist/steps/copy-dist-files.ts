import {copyFileSync, mkdirSync, readdirSync, statSync} from 'fs';
import path from 'path';

export class CopyDistFiles {
	private static readonly SOURCE = path.join('..', 'oblique', 'src');
	private static readonly DESTINATION = path.join('..', '..', 'dist', 'oblique');

	static perform(): void {
		CopyDistFiles.copyRootFiles(['README.md', 'CHANGELOG.md', 'LICENSE']);

		CopyDistFiles.copyObliqueFiles([
			...CopyDistFiles.listFiles(path.join(CopyDistFiles.SOURCE, 'lib')).filter(filePath =>
				/\.description\.html|\.api\.json$/.test(filePath)
			),
			...CopyDistFiles.listFiles(path.join(CopyDistFiles.SOURCE, 'assets')),
			...CopyDistFiles.listFiles(path.join(CopyDistFiles.SOURCE, 'styles')).filter(filePath => !filePath.endsWith('.scss'))
		]);
	}

	private static listFiles(directory: string): string[] {
		return readdirSync(directory)
			.map(fileName => path.join(directory, fileName))
			.reduce(
				(filePaths, filePath) =>
					statSync(filePath).isDirectory() ? [...filePaths, ...CopyDistFiles.listFiles(filePath)] : [...filePaths, filePath],
				[]
			);
	}

	private static copyRootFiles(fileList: string[]): void {
		CopyDistFiles.copyFiles(
			fileList.map(filename => path.join('..', '..', filename)),
			path.join('..', '..'),
			CopyDistFiles.DESTINATION
		);
	}

	private static copyObliqueFiles(fileList: string[]): void {
		CopyDistFiles.copyFiles(fileList, CopyDistFiles.SOURCE, CopyDistFiles.DESTINATION);
	}

	private static copyFiles(fileList: string[], source: string, destination: string): void {
		fileList
			.map(filePath => ({
				source: filePath,
				destination: filePath.replace(source, destination)
			}))
			.forEach(file => {
				mkdirSync(path.dirname(file.destination), {recursive: true});
				copyFileSync(file.source, file.destination);
			});
	}
}
