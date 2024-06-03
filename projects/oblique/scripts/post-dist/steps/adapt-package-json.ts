import path from 'path';
import {listFiles} from '../../../../../scripts/shared/utils';
import {ExportEntries, PackageJson} from '../../../../../scripts/shared/package-json';

export class AdaptPackageJson {
	private static readonly DIST_PATH = path.join('..', '..', 'dist', 'oblique');

	static perform(): void {
		PackageJson.initialize('oblique')
			.addFieldsFromRoot('version', 'description', 'keywords', 'author', 'contributors', 'homepage', 'repository', 'license', 'bugs')
			.addExports({
				...AdaptPackageJson.getExportEntriesForSCSS(),
				'./assets/images/cover-background.jpg': './assets/images/cover-background.jpg' // used by oblique-components.css
			})
			.write()
			.finalize();
	}

	private static getExportEntriesForSCSS(): ExportEntries {
		return listFiles(path.join(AdaptPackageJson.DIST_PATH, 'styles', 'scss'))
			.map(filePath => filePath.replace(AdaptPackageJson.DIST_PATH, '.'))
			.map(filePath => filePath.replace(/\\/g, '/'))
			.map(filePath => ({importPath: filePath.replace(/_|\.scss/g, ''), filePath}))
			.reduce<ExportEntries>((exportEntries, {importPath, filePath}) => ({...exportEntries, [importPath]: {sass: filePath}}), {});
	}
}
