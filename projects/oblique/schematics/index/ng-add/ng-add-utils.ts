import {SchematicContext, Tree} from '@angular-devkit/schematics';
import {addModuleImportToRootModule, getProjectFromWorkspace, hasNgModuleImport} from '@angular/cdk/schematics';
import {getWorkspace} from '@schematics/angular/utility/config';
import {addPackageJsonDependency, NodeDependency, NodeDependencyType, removePackageJsonDependency} from '@schematics/angular/utility/dependencies';
import {Change, InsertChange} from '@schematics/angular/utility/change';
import {SourceFile} from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import {error, getJson, packageJsonConfigPath, readFile} from '../utils';
import * as ts from 'typescript';

export const appModulePath = 'src/app/app.module.ts';
export const routingModulePath = 'src/app/app-routing.module.ts';
export const pathToTemplates = './node_modules/@oblique/oblique/schematics/index/ng-add/templates';
export const obliqueCssPath = 'node_modules/@oblique/oblique/styles/css/oblique-core.css';

export interface IOptionsSchema {
	ajv: boolean;
	banner: boolean;
	eslint: boolean;
	font: string;
	httpInterceptors: boolean;
	husky: boolean;
	ie11: boolean;
	jenkins: string;
	jest: boolean;
	locales: string;
	npmrc: boolean;
	prefix: string;
	protractor: boolean;
	proxy: string;
	sonar: boolean;
	static: boolean;
	theme: string;
	title: string;
	unknownRoute: boolean;
}

interface Version {
	major: number;
	minor: number;
	patch: number;
}

type versionFunc = (version: number) => string;

const versions: {[key: string]: string | versionFunc} = {
	// eslint-disable-next-line prettier/prettier
	ajv: '^6.0.0',
	'@ngx-translate/core': version => (version >= 10 ? '^13.0.0' : '^12.0.0'),
	'@ng-bootstrap/ng-bootstrap': version => (version >= 10 ? '^7.0.0' : '^6.0.0'),
	'@angular/cdk': version => `^${version}.0.0`,
	'@angular/material': version => `^${version}.0.0`,
	'@angular/core': `^9.0.0`,
	'@angular/router': version => `^${version}.0.0`,

	// eslint-disable-next-line prettier/prettier
	jest: '^25.0.0',
	'@types/jest': '^25.0.0',
	'@angular-builders/jest': '^9.0.0',
	'jest-sonar-reporter': '2.0.0',
	'@angular-eslint/builder': '0.0.1-alpha.27',
	'@angular-eslint/eslint-plugin': '0.0.1-alpha.27',
	'@typescript-eslint/eslint-plugin': '^2.0.0',
	'@typescript-eslint/parser': '^2.0.0',
	// eslint-disable-next-line prettier/prettier
	eslint: '^6.0.0',
	'eslint-config-prettier': '^6.0.0',
	'eslint-plugin-prettier': '^3.0.0',
	// eslint-disable-next-line prettier/prettier
	prettier: '^2.0.0',
	// eslint-disable-next-line prettier/prettier
	husky: '^4.0.0'
};

export function checkPrecondition(tree: Tree, pkg: string) {
	const current = extractVersion(getDepVersion(tree, pkg) || '');
	const target = extractVersion(getTargetDepVersion(tree, pkg) || '') || ({} as Version);

	if (!current || current.major < target.major || current.minor < target.minor || current.patch < target.patch) {
		error(
			`Unmet peer dependency. Oblique requires a peer of ${pkg}@${target.major}.${target.minor}.${target.patch} but none is installed.
You must install peer dependencies yourself."`
		);
	}
}

function extractVersion(version: string): Version | undefined {
	const hit = version.match(/(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)/);
	return hit?.groups
		? {
				major: parseInt(hit.groups.major, 10),
				minor: parseInt(hit.groups.minor, 10),
				patch: parseInt(hit.groups.patch, 10)
		  }
		: undefined;
}

export function addDevDependency(tree: Tree, name: string): void {
	addPackageJsonDependency(tree, createDep(tree, NodeDependencyType.Dev, name));
}

export function addDependency(tree: Tree, name: string): void {
	addPackageJsonDependency(tree, createDep(tree, NodeDependencyType.Default, name));
}

function getTargetDepVersion(tree: Tree, name: string): string {
	let version = versions[name];
	if (!version) {
		error(`Unknown dependency: ${name}`);
	}
	return version instanceof Function ? version(getAngularVersion(tree)) : (version as string);
}

function createDep(tree: Tree, type: NodeDependencyType, name: string): NodeDependency {
	const version = getTargetDepVersion(tree, name);
	return {type, version, name};
}

export function importModule(moduleName: string, src: string) {
	return (tree: Tree, _context: SchematicContext) => {
		const workspace = getWorkspace(tree);
		const project = getProjectFromWorkspace(workspace);
		if (!hasNgModuleImport(tree, appModulePath, moduleName)) {
			addModuleImportToRootModule(tree, moduleName, src, project);
		}

		return tree;
	};
}

export function applyChanges(tree: Tree, filePath: string, changes: Change[]) {
	const records = tree.beginUpdate(filePath);
	changes.filter(change => change instanceof InsertChange).forEach((change: InsertChange) => records.insertLeft(change.pos, change.toAdd));
	tree.commitUpdate(records);
	return tree;
}

export function getTemplate(tree: Tree, file: string): string {
	return readFile(tree, `${pathToTemplates}/${file}`);
}

export function deleteFile(tree: Tree, filename: string): Tree {
	if (tree.exists(filename)) {
		tree.delete(filename);
	}
	return tree;
}

export function getAngularVersion(tree: Tree): number {
	return parseInt(readFile(tree, packageJsonConfigPath).match(/@angular\/core":\s*"[~,^]?(?<version>\d+)\.\d+\.\d+"/)?.groups?.version || '0', 10);
}

export function getDepVersion(tree: Tree, dep: string): string | undefined {
	const pattern = new RegExp(`"${dep}":\\s*"[~,^]?(?<version>\\d+\\.\\d+\\.\\d+)"`);
	return readFile(tree, packageJsonConfigPath).match(pattern)?.groups?.version;
}

export function removeDevDependencies(tree: Tree, dependency: string): Tree {
	const json = getJson(tree, packageJsonConfigPath);
	Object.keys(json.devDependencies)
		.filter((dep: string) => dep.indexOf('karma') > -1)
		.forEach((dep: string) => removePackageJsonDependency(tree, dep));

	return tree;
}

export function removeScript(tree: Tree, script: string): Tree {
	const packageJson = getJson(tree, packageJsonConfigPath);
	delete packageJson.scripts[script];
	tree.overwrite(packageJsonConfigPath, JSON.stringify(packageJson, null, 2));
	return tree;
}

export function addRootProperty(tree: Tree, name: string, content: any): Tree {
	const packageJson = getJson(tree, packageJsonConfigPath);
	packageJson[name] = content;
	tree.overwrite(packageJsonConfigPath, JSON.stringify(packageJson, null, 2));
	return tree;
}

export function addScript(tree: Tree, name: string, content: any): Tree {
	const packageJson = getJson(tree, packageJsonConfigPath);
	packageJson.scripts[name] = content;
	tree.overwrite(packageJsonConfigPath, JSON.stringify(packageJson, null, 2));
	return tree;
}

export function createSrcFile(tree: Tree, source: string): SourceFile {
	return ts.createSourceFile(source, readFile(tree, source), ts.ScriptTarget.Latest, true);
}

export function adaptInsertChange(tree: Tree, change: InsertChange, search: string | RegExp, replace: string): InsertChange {
	const pos = readFile(tree, appModulePath).indexOf('@NgModule');
	if (change.pos < pos) {
		change.toAdd = change.toAdd.replace(search, replace);
		change.description = change.description.replace(search, replace);
	}
	return change;
}
