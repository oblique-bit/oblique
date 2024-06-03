import path from 'path';
import {listFiles} from '../../../../../scripts/shared/utils';
import {CopyFiles} from '../../../../../scripts/shared/copy-files';

export class CopyDistFiles {
	static perform(): void {
		CopyFiles.initialize('oblique')
			.copyRootFiles('README.md', 'CHANGELOG.md', 'LICENSE')
			.copyProjectFiles(
				'src',
				...listFiles(path.join('src', 'assets')),
				...listFiles(path.join('src', 'styles')).filter(filePath => !filePath.endsWith('.scss')),
				...listFiles(path.join('src', 'styles')).filter(filePath =>
					/(?:core[\\/](?:_variables|_palette)|mixins[\\/](?:_layout|_shadow|_typography))\.scss$/.test(filePath)
				)
			)
			.finalize();
	}
}
