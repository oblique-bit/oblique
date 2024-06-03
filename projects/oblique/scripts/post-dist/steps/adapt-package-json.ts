import path from 'path';
import {PackageJson} from './package-json';
import {listFiles} from '../../../../../scripts/shared/utils';

type ExportEntries = Record<string, Record<'sass', string>>;

export class AdaptPackageJson {
	private static readonly DIST_PATH = path.join('..', '..', 'dist', 'oblique');

	static perform(): void {
		const filePath = path.join(AdaptPackageJson.DIST_PATH, 'package.json');
		const fields = ['version', 'description', 'keywords', 'author', 'contributors', 'homepage', 'repository', 'license', 'bugs'];
		const distPackage = PackageJson.getData(filePath);
		const rootPackage = PackageJson.filterIn(path.join('..', '..', 'package.json'), fields);
		PackageJson.write(filePath, {
			...distPackage,
			...rootPackage,
			exports: {
				...distPackage.exports,
				...AdaptPackageJson.getExportEntriesForSCSS(),
				'./assets/images/cover-background.jpg': './assets/images/cover-background.jpg' // used by oblique-components.css
			}
		});
	}

	private static getExportEntriesForSCSS(): ExportEntries {
		return listFiles(path.join(AdaptPackageJson.DIST_PATH, 'styles', 'scss'))
			.map(filePath => filePath.replace(AdaptPackageJson.DIST_PATH, '.'))
			.map(filePath => filePath.replace(/\\/g, '/'))
			.map(filePath => ({importPath: filePath.replace(/_|\.scss/g, ''), filePath}))
			.reduce<ExportEntries>((exportEntries, file) => ({...exportEntries, [file.importPath]: {sass: file.filePath}}), {});
	}
}
