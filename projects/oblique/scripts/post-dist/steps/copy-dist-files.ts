import {copyFileSync, mkdirSync} from 'fs';
import path from 'path';
import {listFiles} from '../../../../../scripts/shared/utils';

export class CopyDistFiles {
	private static readonly SOURCE = path.join('..', 'oblique', 'src');
	private static readonly DESTINATION = path.join('..', '..', 'dist', 'oblique');

	static perform(): void {
		CopyDistFiles.copyRootFiles(['README.md', 'CHANGELOG.md', 'LICENSE']);

		CopyDistFiles.copyObliqueFiles([
			...listFiles(path.join(CopyDistFiles.SOURCE, 'assets')),
			...listFiles(path.join(CopyDistFiles.SOURCE, 'styles')).filter(filePath => !filePath.endsWith('.scss')),
			...listFiles(path.join(CopyDistFiles.SOURCE, 'styles')).filter(filePath =>
				/(?:core[\\/](?:_variables|_palette)|mixins[\\/](?:_layout|_shadow|_typography))\.scss$/.test(filePath)
			)
		]);
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
