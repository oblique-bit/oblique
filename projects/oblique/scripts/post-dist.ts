import path from 'path';
import {readFileSync, renameSync, writeFileSync} from 'fs';
import {CopyFiles} from '../../../scripts/shared/copy-files';
import {executeCommand, listFiles} from '../../../scripts/shared/utils';
import {ExportEntries, PackageJson} from '../../../scripts/shared/package-json';
import {Banner} from '../../../scripts/shared/banner';

class PostDist {
	static perform(): void {
		PostDist.copyDistFiles();
		PostDist.renameDistribution();
		PostDist.adaptPackageJson();
		PostDist.adaptSchematicsPackageJson();
		PostDist.updateBackgroundImagePath();
		PostDist.distributeObFeatures();
		PostDist.addBanner();
	}

	private static copyDistFiles(): void {
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

	private static renameDistribution(): void {
		const searchValue = 'oblique-oblique';
		const replaceValue = 'oblique';
		// Please note that order is important!
		const fileList = listFiles(path.join('..', '..', 'dist'));
		PostDist.renameInFiles(fileList, searchValue, replaceValue);
		PostDist.renameFiles(fileList, searchValue, replaceValue);
	}

	private static adaptPackageJson(): void {
		PackageJson.initialize('oblique')
			.addFieldsFromRoot('version', 'description', 'keywords', 'author', 'contributors', 'homepage', 'repository', 'license', 'bugs')
			.addExports({
				...PostDist.getExportEntriesForSCSS(),
				'./assets/images/cover-background.jpg': './assets/images/cover-background.jpg' // used by oblique-components.css
			})
			.write()
			.finalize();
	}

	private static adaptSchematicsPackageJson(): void {
		PackageJson.initialize('oblique', 'schematics')
			.addFieldsFromRoot('version', 'author', 'contributors', 'license')
			.removeScripts()
			.write()
			.finalize();
	}

	private static updateBackgroundImagePath(): void {
		PostDist.replaceInFiles(
			[path.join('..', '..', 'dist', 'oblique', 'styles', 'css', 'oblique-components.css')],
			'cover-background.jpg',
			'@oblique/oblique/assets/images/cover-background.jpg'
		);
	}

	private static distributeObFeatures(): void {
		executeCommand(`uglifyjs --compress --mangle --output ../../dist/oblique/ob-features.js -- src/ob-features.js`);
	}

	private static addBanner(): void {
		Banner.addToFilesInProject('oblique');
	}

	private static renameInFiles(fileList: string[], searchValue: string, replaceValue: string): void {
		fileList
			.filter(filePath => !filePath.includes(`CHANGELOG.md`))
			.map(filePath => ({file: readFileSync(filePath).toString(), filePath}))
			.filter(({file}) => file.includes(searchValue))
			.forEach(({filePath, file}) => writeFileSync(filePath, file.replace(new RegExp(searchValue, `g`), replaceValue)));
	}

	private static renameFiles(fileList: string[], searchValue: string, replaceValue: string): void {
		fileList
			.filter(filePath => filePath.includes(searchValue))
			.forEach(filePath => renameSync(filePath, filePath.replace(searchValue, replaceValue)));
	}

	private static getExportEntriesForSCSS(): ExportEntries {
		const distPath = path.join('..', '..', 'dist', 'oblique');
		return listFiles(path.join(distPath, 'styles', 'scss'))
			.map(filePath => filePath.replace(distPath, '.'))
			.map(filePath => filePath.replace(/\\/g, '/'))
			.map(filePath => ({importPath: filePath.replace(/_|\.scss/g, ''), filePath}))
			.reduce<ExportEntries>((exportEntries, {importPath, filePath}) => ({...exportEntries, [importPath]: {sass: filePath}}), {});
	}

	private static replaceInFiles(filePathList: string[], searchValue: string | RegExp, replaceValue: string): void {
		filePathList
			.map(filePath => ({file: readFileSync(filePath).toString(), filePath}))
			.filter(fileObject => (typeof searchValue === 'string' ? fileObject.file.includes(searchValue) : searchValue.test(fileObject.file)))
			.forEach(fileObject => writeFileSync(fileObject.filePath, fileObject.file.replace(new RegExp(searchValue, 'g'), replaceValue)));
	}
}

PostDist.perform();
