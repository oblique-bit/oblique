import path from 'path';
import {PackageJson} from './package-json';
import {readdirSync, statSync} from 'fs';

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
			exports: {...distPackage.exports, ...AdaptPackageJson.getExportEntriesForSCSS()}
		});
	}

	private static getExportEntriesForSCSS(): ExportEntries {
		return AdaptPackageJson.listFiles(path.join(AdaptPackageJson.DIST_PATH, 'styles', 'scss'))
			.map(filePath => filePath.replace(AdaptPackageJson.DIST_PATH, '.'))
			.map(filePath => ({importPath: filePath.replace(/_|\.scss/g, ''), filePath}))
			.reduce<ExportEntries>((exportEntries, file) => ({...exportEntries, [file.importPath]: {sass: file.filePath}}), {});
	}

	private static listFiles(directory: string): string[] {
		return readdirSync(directory)
			.map(fileName => path.join(directory, fileName))
			.reduce(
				(filePaths, filePath) =>
					statSync(filePath).isDirectory() ? [...filePaths, ...AdaptPackageJson.listFiles(filePath)] : [...filePaths, filePath],
				[]
			);
	}
}
