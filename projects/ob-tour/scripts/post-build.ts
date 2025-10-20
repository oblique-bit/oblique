import {existsSync, readFileSync, writeFileSync} from 'fs';
import {join} from 'path';
import {PackageJson} from '../../../scripts/shared/package-json';
import {Banner} from '../../../scripts/shared/banner';
import {CopyFiles} from '../../../scripts/shared/copy-files';
import {StaticScript} from '../../../scripts/shared/static-script';
import {adaptReadmeLinks} from '../../../scripts/shared/utils';
import {Log} from '../../../scripts/shared/log';

export class PostBuild extends StaticScript {
	private static readonly projectName = 'ob-tour';

	static perform(): void {
		Log.start('Finalize build');
		PostBuild.copyProjectFiles();
		PostBuild.adaptPackageJson();
		PostBuild.addIndex();
		PostBuild.addExports();
		Banner.addToFilesInProject(this.projectName);
		adaptReadmeLinks(this.projectName);
		Log.success('Finalize build');
	}

	// Dynamische Pfaderkennung, funktioniert aus jedem Arbeitsverzeichnis
	private static getDistPath(): string {
		const defaultPath = join(process.cwd(), 'dist', PostBuild.projectName);
		const altPath = join(process.cwd(), '../../dist', PostBuild.projectName);
		return existsSync(defaultPath) ? defaultPath : altPath;
	}

	private static copyProjectFiles(): void {
		CopyFiles.initialize(this.projectName)
			.copyRootFiles('LICENSE')
			.copyProjectRootFiles('README.md', 'CHANGELOG.md', 'package.json')
			.finalize();
	}

	private static adaptPackageJson(): void {
		PackageJson.initialize(PostBuild.projectName)
			.addFieldsFromRoot('version', 'description', 'keywords', 'author', 'contributors', 'homepage', 'repository', 'license', 'bugs')
			.copyDependenciesFromRoot('tslib')
			.removeScripts()
			.write()
			.finalize();
	}

	private static addIndex(): void {
		const pkgPath = join(this.getDistPath(), 'package.json');
		if (!existsSync(pkgPath)) {
			Log.info(`package.json not found at ${pkgPath}`);
			return;
		}
		Log.info('Add index entries to package.json');
		const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));

		pkg.main = './fesm2022/ob-tour.mjs';
		pkg.module = './fesm2022/ob-tour.mjs';
		pkg.types = './index.d.ts';

		writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
		Log.info('index fields added to package.json');
	}

	private static addExports(): void {
		const pkgPath = join(this.getDistPath(), 'package.json');
		if (!existsSync(pkgPath)) {
			Log.info(`package.json not found at ${pkgPath}`);
			return;
		}
		Log.info('Add exports section to package.json');
		const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
		pkg.exports = {
			'.': {
				types: './index.d.ts',
				default: './fesm2022/oblique-ob-tour.mjs',
				import: './fesm2022/oblique-ob-tour.mjs'
			},
			'./package.json': './package.json'
		};
		writeFileSync(pkgPath, JSON.stringify(pkg, null, 2), 'utf8');
		Log.info('package.json exports added');
	}
}

PostBuild.perform();
