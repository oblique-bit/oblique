import {Tree} from '@angular-devkit/schematics';
import {addModuleImportToModule, hasNgModuleImport} from '@angular/cdk/schematics';
import {NodeDependency, NodeDependencyType, addPackageJsonDependency, removePackageJsonDependency} from '@schematics/angular/utility/dependencies';
import {Change, InsertChange} from '@schematics/angular/utility/change';
import {error, getJson, packageJsonConfigPath, readFile} from '../utils';
import * as ts from 'typescript';
import {ObIVersion} from './ng-add.model';

export const appModulePath = 'src/app/app.module.ts';
export const routingModulePath = 'src/app/app-routing.module.ts';
export const pathToTemplates = './node_modules/@oblique/oblique/schematics/index/ng-add/templates';
export const obliqueCssPath = 'node_modules/@oblique/oblique/styles/css/oblique-core.css';

type versionFunc = (version: number) => string;

const versions: {[key: string]: string | versionFunc} = {
	ajv: '^8.0.0',
	'ajv-formats': '^2.0.0',
	'@ngx-translate/core': '^14.0.0',
	'@ng-bootstrap/ng-bootstrap': '^11.0.0',
	'@angular/cdk': version => `^${version}.0.0`,
	'@angular/material': version => `^${version}.0.0`,
	'@angular/core': `^13.0.0`,
	'@angular/router': version => `^${version}.0.0`,
	'@angular/localize': version => `^${version}.0.0`,
	'@popperjs/core': '^2.0.0',

	jest: '^27.0.0',
	'@types/jest': '^27.0.0',
	'@angular-builders/jest': '^13.0.0',
	'jest-sonar-reporter': '2.0.0',
	'eslint-config-prettier': '^8.0.0',
	'eslint-plugin-prettier': '^4.0.0',
	prettier: '^2.0.0',
	husky: '^4.0.0'
};

export function getPreconditionVersion(tree: Tree, pkg: string): string {
	const current = extractVersion(getDepVersion(tree, pkg) || '');
	const target = extractVersion(getDepVersion(tree, '@angular/core') || '') || ({} as ObIVersion);
	return !current || current.major !== target.major || current.minor !== target.minor ? `${target.major}.${target.minor}` : '';
}

export function checkPrecondition(tree: Tree, pkg: string): void {
	const current = extractVersion(getDepVersion(tree, pkg) || '');
	const target = extractVersion(getTargetDepVersion(tree, pkg) || '') || ({} as ObIVersion);

	if (!current || current.major < target.major || current.minor < target.minor || current.patch < target.patch) {
		error(
			`Unmet peer dependency. Oblique requires a peer of ${pkg}@${target.major}.${target.minor}.${target.patch} but none is installed.
You must install peer dependencies yourself."`
		);
	}
}

export function addDevDependency(tree: Tree, name: string): void {
	addPackageJsonDependency(tree, createDep(tree, NodeDependencyType.Dev, name));
}

export function addDependency(tree: Tree, name: string): void {
	addPackageJsonDependency(tree, createDep(tree, NodeDependencyType.Default, name));
}

export function importModuleInRoot(tree: Tree, moduleName: string, src: string): void {
	if (!hasNgModuleImport(tree, appModulePath, moduleName)) {
		addModuleImportToModule(tree, appModulePath, moduleName, src);
	}
}

export function applyChanges(tree: Tree, filePath: string, changes: Change[]): Tree {
	const records = tree.beginUpdate(filePath);
	changes.filter(change => change instanceof InsertChange).forEach((change: InsertChange) => records.insertLeft(change.pos, change.toAdd));
	tree.commitUpdate(records);
	return tree;
}

export function getTemplate(tree: Tree, file: string): string {
	return readFile(tree, `${pathToTemplates}/${file}`);
}

export function getAngularVersion(tree: Tree): number {
	return parseInt(/@angular\/core":\s*"[~,^]?(?<version>\d+)\.\d+\.\d+"/.exec(readFile(tree, packageJsonConfigPath))?.groups?.version || '0', 10);
}

export function getDepVersion(tree: Tree, dep: string): string | undefined {
	const pattern = new RegExp(`"${dep}":\\s*"[~,^]?(?<version>\\d+\\.\\d+\\.\\d+)"`);
	return readFile(tree, packageJsonConfigPath).match(pattern)?.groups?.version;
}

export function removeDevDependencies(tree: Tree, dependency: string): Tree {
	const json = getJson(tree, packageJsonConfigPath);
	Object.keys(json.devDependencies)
		.filter((dep: string) => dep.includes(dependency))
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

export function createSrcFile(tree: Tree, source: string): any {
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

function extractVersion(version: string): ObIVersion | undefined {
	const hit = /(?<major>\d+)\.(?<minor>\d+)\.(?<patch>\d+)/.exec(version);
	return hit?.groups
		? {
				major: parseInt(hit.groups.major, 10),
				minor: parseInt(hit.groups.minor, 10),
				patch: parseInt(hit.groups.patch, 10)
		  }
		: undefined;
}

function getTargetDepVersion(tree: Tree, name: string): string {
	const version = versions[name];
	if (!version) {
		error(`Unknown dependency: ${name}`);
	}
	return version instanceof Function ? version(getAngularVersion(tree)) : version;
}

function createDep(tree: Tree, type: NodeDependencyType, name: string): NodeDependency {
	const version = getTargetDepVersion(tree, name);
	return {type, version, name};
}
