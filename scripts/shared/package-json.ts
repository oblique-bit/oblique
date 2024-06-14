import {readFileSync, writeFileSync} from 'fs';
import path from 'path';
import {buildPath} from './utils';

export type ExportEntries = Record<string, string | Record<'sass', string>>;
type PackageJsonContent = Record<string, unknown>;

export class PackageJson {
	private static instance: PackageJson;
	private content: PackageJsonContent;
	private path: string;

	// the constructor needs to be private to impede the class instantiation
	private constructor() {
		if (PackageJson.instance) {
			throw new Error('"finalize" needs to be called in between calls to "initialize".');
		}
	}

	static initialize(projectName: string, folder?: string): PackageJson {
		PackageJson.instance = new PackageJson();
		PackageJson.instance.path = buildPath('..', '..', 'dist', projectName, folder, 'package.json');
		PackageJson.instance.content = JSON.parse(readFileSync(PackageJson.instance.path).toString()) as PackageJsonContent;
		return PackageJson.instance;
	}

	addFieldsFromRoot(...fields: string[]): PackageJson {
		const rootPackage = PackageJson.readRootPackageJson();
		Object.keys(rootPackage)
			.filter(key => fields.includes(key))
			.forEach(key => (this.content[key] = rootPackage[key]));
		return PackageJson.instance;
	}

	addExports(fields: ExportEntries): PackageJson {
		this.content.exports = {
			...(this.content.exports as object),
			...Object.keys(fields).reduce<ExportEntries>((exports, field) => ({...exports, [field]: fields[field]}), {})
		};
		return PackageJson.instance;
	}

	removeDependencies(dependencyType: 'devDependencies' | 'dependencies', ...dependencyNames: string[]): PackageJson {
		dependencyNames.forEach(dependencyName => delete this.content[dependencyType][dependencyName]);
		if (!Object.keys(this.content[dependencyType]).length) {
			delete this.content[dependencyType];
		}
		return PackageJson.instance;
	}

	removeScripts(): PackageJson {
		delete this.content.scripts;
		return PackageJson.instance;
	}

	write(): PackageJson {
		writeFileSync(this.path, JSON.stringify(this.content, null, 2));
		return PackageJson.instance;
	}

	finalize(): void {
		PackageJson.instance = undefined;
	}

	private static readRootPackageJson(): PackageJsonContent {
		return JSON.parse(readFileSync(path.join('..', '..', 'package.json')).toString()) as PackageJsonContent;
	}
}
