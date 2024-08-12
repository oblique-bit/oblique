import {readFileSync, writeFileSync} from 'fs';
import path from 'path';
import {buildPath, humanizeList} from './utils';
import {StaticScript} from './static-script';
import {Log} from './log';

export type ExportEntries = Record<string, string | Record<'sass', string>>;
type PackageJsonContent = Record<string, unknown>;

export class PackageJson extends StaticScript {
	private content: PackageJsonContent;
	private path: string;

	static initialize(projectName: string, folder?: string): PackageJson {
		PackageJson.instance = new PackageJson();
		(PackageJson.instance as PackageJson).path = buildPath('..', '..', 'dist', projectName, folder, 'package.json');
		(PackageJson.instance as PackageJson).content = JSON.parse(
			readFileSync((PackageJson.instance as PackageJson).path).toString()
		) as PackageJsonContent;
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
		writeFileSync(this.path, JSON.stringify(this.content, null, 2));
		return PackageJson.instance as PackageJson;
	}

	private static readRootPackageJson(): PackageJsonContent {
		return JSON.parse(readFileSync(path.join('..', '..', 'package.json')).toString()) as PackageJsonContent;
	}
}
