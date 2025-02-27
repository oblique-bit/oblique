import {humanizeList} from './utils';
import {StaticScript} from './static-script';
import {Log} from './log';
import {Files} from './files';

export type ExportEntries = Record<string, string | Record<'sass', string>>;
type PackageJsonContent = Record<string, unknown>;

export class PackageJson extends StaticScript {
	private content: PackageJsonContent;
	private path: string;

	static initialize(projectName: string, folder?: string): PackageJson {
		PackageJson.instance = new PackageJson();
		const subPath = folder ? `${projectName}/${folder}` : projectName;
		(PackageJson.instance as PackageJson).path = `../../dist/${subPath}/package.json`;
		(PackageJson.instance as PackageJson).content = Files.readJson((PackageJson.instance as PackageJson).path) as PackageJsonContent;
		return PackageJson.instance as PackageJson;
	}

	addFieldsFromRoot(...fields: string[]): PackageJson {
		Log.info(`Add ${humanizeList(fields)} properties to the distributed package.json`);
		const rootPackage = PackageJson.readRootPackageJson();
		Object.keys(rootPackage)
			.filter(key => fields.includes(key))
			.forEach(key => (this.content[key] = rootPackage[key]));
		return PackageJson.instance as PackageJson;
	}

	copyDependenciesFromRoot(...dependencies: string[]): PackageJson {
		Log.info(`Add ${humanizeList(dependencies)} dependencies to the distributed package.json`);
		const rootPackage = PackageJson.readRootPackageJson() as {dependencies: Record<string, string>};
		Object.entries(rootPackage.dependencies)
			.filter(([key]) => dependencies.includes(key))
			.forEach(([key, value]) => (this.content.dependencies[key] = value));
		return PackageJson.instance as PackageJson;
	}

	addExports(fields: ExportEntries): PackageJson {
		Log.info(`Add export property to the distributed package.json`);
		this.content.exports = {
			...(this.content.exports as object),
			...Object.keys(fields).reduce<ExportEntries>((exports, field) => ({...exports, [field]: fields[field]}), {})
		};
		return PackageJson.instance as PackageJson;
	}

	removeDependencies(dependencyType: 'devDependencies' | 'dependencies', ...dependencyNames: string[]): PackageJson {
		Log.info(`Remove ${humanizeList(dependencyNames)} ${dependencyType} from the distributed package.json`);
		dependencyNames.forEach(dependencyName => delete this.content[dependencyType][dependencyName]);
		if (!Object.keys(this.content[dependencyType]).length) {
			delete this.content[dependencyType];
		}
		return PackageJson.instance as PackageJson;
	}

	removeScripts(): PackageJson {
		Log.info(`Remove scripts from the distributed package.json`);
		delete this.content.scripts;
		return PackageJson.instance as PackageJson;
	}

	write(): PackageJson {
		Files.writeJson(this.path, this.content);
		return PackageJson.instance as PackageJson;
	}

	static readVersion(): string {
		const rootPackage = PackageJson.readRootPackageJson();
		return typeof rootPackage.version === 'string' ? rootPackage.version : '';
	}

	private static readRootPackageJson(): PackageJsonContent {
		return Files.readJson('../../package.json') as PackageJsonContent;
	}
}
