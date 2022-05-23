import {copyFileSync, mkdirSync, readdirSync, statSync} from 'fs';
import path from 'path';

export class CopyDistFiles {
	private static readonly SOURCE = path.join('projects', 'oblique', 'src');
	private static readonly DESTINATION = path.join('dist', 'oblique');
	private static readonly FONT_AWESOME = path.join('node_modules', '@fortawesome', 'fontawesome-free');

	static perform(): void {
		CopyDistFiles.copyRootFiles(['README.md', 'CHANGELOG.md', 'LICENSE']);

		CopyDistFiles.copyObliqueFiles([
			...CopyDistFiles.listFiles(path.join(CopyDistFiles.SOURCE, 'lib')).filter(filePath =>
				/\.description\.html|\.api\.json$/.test(filePath)
			),
			...CopyDistFiles.listFiles(path.join(CopyDistFiles.SOURCE, 'assets')),
			...CopyDistFiles.listFiles(path.join(CopyDistFiles.SOURCE, 'styles'))
		]);

		CopyDistFiles.copyFontAwesomeFiles(path.join(CopyDistFiles.FONT_AWESOME, 'webfonts'), path.join('styles', 'fonts'));
		CopyDistFiles.copyFontAwesomeFiles(path.join(CopyDistFiles.FONT_AWESOME, 'scss'), path.join('styles', 'scss', 'fontawesome'));
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
		CopyDistFiles.copyFiles(fileList, /^/, `${CopyDistFiles.DESTINATION}${path.sep}`);
	}

	private static copyObliqueFiles(fileList: string[]): void {
		CopyDistFiles.copyFiles(fileList, CopyDistFiles.SOURCE, CopyDistFiles.DESTINATION);
	}

	private static copyFontAwesomeFiles(source: string, destination: string): void {
		CopyDistFiles.copyFiles(CopyDistFiles.listFiles(source), source, path.join(CopyDistFiles.DESTINATION, destination));
	}

	private static copyFiles(fileList: string[], source: string | RegExp, destination: string): void {
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
