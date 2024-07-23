import {CopyFiles} from '../../../scripts/shared/copy-files';
import {adaptReadmeLinks, executeCommandWithLog} from '../../../scripts/shared/utils';
import {ExportEntries, PackageJson} from '../../../scripts/shared/package-json';
import {Banner} from '../../../scripts/shared/banner';
import {StaticScript} from '../../../scripts/shared/static-script';
import {Log} from '../../../scripts/shared/log';
import {Files} from '../../../scripts/shared/files';

class PostBuild extends StaticScript {
	static perform(): void {
		Log.start('Finalize build');
		PostBuild.copyDistFiles();
		PostBuild.renameDistribution();
		PostBuild.adaptPackageJson();
		PostBuild.adaptSchematicsPackageJson();
		PostBuild.updateBackgroundImagePath();
		PostBuild.distributeObFeatures();
		PostBuild.addBanner();
		adaptReadmeLinks('oblique');
		Log.success();
	}

	private static copyDistFiles(): void {
		CopyFiles.initialize('oblique')
			.copyRootFiles('LICENSE')
			.copyProjectFiles(
				'src',
				...Files.list('src/assets'),
				...Files.list('src/styles').filter(filePath => !filePath.endsWith('.scss')),
				...Files.list('src/styles').filter(filePath =>
					/(?:core[\\/](?:_variables|_palette)|mixins[\\/](?:_layout|_shadow|_typography))\.scss$/.test(filePath)
				)
			)
			.copyProjectRootFiles('README.md', 'CHANGELOG.md')
			.finalize();
	}

	private static renameDistribution(): void {
		const searchValue = 'oblique-oblique';
		const replaceValue = 'oblique';
		// Please note that order is important!
		const fileList = Files.list('../../dist');
		PostBuild.renameInFiles(fileList, searchValue, replaceValue);
		PostBuild.renameFiles(fileList, searchValue, replaceValue);
	}

	private static adaptPackageJson(): void {
		PackageJson.initialize('oblique')
			.addFieldsFromRoot('version', 'description', 'keywords', 'author', 'contributors', 'homepage', 'repository', 'license', 'bugs')
			.addExports({
				...PostBuild.getExportEntriesForSCSS(),
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
		Log.info(`Update path to cover-background.jpg.`);
		PostBuild.replaceInFiles(
			['../../dist/oblique/styles/css/oblique-components.css'],
			'cover-background.jpg',
			'@oblique/oblique/assets/images/cover-background.jpg'
		);
	}

	private static distributeObFeatures(): void {
		executeCommandWithLog(
			`uglifyjs --compress --mangle --output ../../dist/oblique/ob-features.js -- src/ob-features.js`,
			'Copy and minify ob-features.js'
		);
	}

	private static addBanner(): void {
		Banner.addToFilesInProject('oblique');
	}

	private static renameInFiles(fileList: string[], searchValue: string, replaceValue: string): void {
		Log.info(`Rename ${searchValue} into ${replaceValue} in all distributed files.`);
		fileList
			.filter(filePath => !filePath.includes(`CHANGELOG.md`))
			.map(filePath => ({file: Files.read(filePath), filePath}))
			.filter(({file}) => file.includes(searchValue))
			.forEach(({filePath, file}) => Files.write(filePath, file.replace(new RegExp(searchValue, `g`), replaceValue)));
	}

	private static renameFiles(fileList: string[], searchValue: string, replaceValue: string): void {
		Log.info(`Rename ${searchValue} file into ${replaceValue}.`);
		fileList
			.filter(filePath => filePath.includes(searchValue))
			.forEach(filePath => Files.rename(filePath, filePath.replace(searchValue, replaceValue)));
	}

	private static getExportEntriesForSCSS(): ExportEntries {
		const distPath = '../../dist/oblique';
		return Files.list(`${distPath}/styles/scss`)
			.map(filePath => filePath.replace(distPath, '.'))
			.map(filePath => filePath.replace(/\\/g, '/'))
			.map(filePath => ({importPath: filePath.replace(/_|\.scss/g, ''), filePath}))
			.reduce<ExportEntries>((exportEntries, {importPath, filePath}) => ({...exportEntries, [importPath]: {sass: filePath}}), {});
	}

	private static replaceInFiles(filePathList: string[], searchValue: string | RegExp, replaceValue: string): void {
		filePathList
			.map(filePath => ({file: Files.read(filePath), filePath}))
			.filter(fileObject => (typeof searchValue === 'string' ? fileObject.file.includes(searchValue) : searchValue.test(fileObject.file)))
			.forEach(fileObject => Files.write(fileObject.filePath, fileObject.file.replace(new RegExp(searchValue, 'g'), replaceValue)));
	}
}

PostBuild.perform();
