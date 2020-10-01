import {Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {addModuleImportToRootModule, getProjectFromWorkspace, hasNgModuleImport} from '@angular/cdk/schematics';
import {NodePackageInstallTask} from '@angular-devkit/schematics/tasks';
import {getWorkspace} from '@schematics/angular/utility/config';
import {addPackageJsonDependency, NodeDependency, NodeDependencyType} from '@schematics/angular/utility/dependencies';
import {Change, InsertChange} from '@schematics/angular/utility/change';
import {SourceFile} from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import * as ts from 'typescript';
import {colors} from '@angular-devkit/core/src/terminal';

export const OBLIQUE_PACKAGE = '@oblique/oblique';
export const appModulePath = 'src/app/app.module.ts';
export const packageJsonConfigPath = './package.json/';
export const routingModulePath = 'src/app/app-routing.module.ts';
export const pathToTemplates = './node_modules/@oblique/oblique/schematics/index/ng-add/templates';
export const obliqueCssPath = 'node_modules/@oblique/oblique/styles/css/oblique-core.css';

interface Version {
	major: number;
	minor: number;
	patch: number;
}

const angularJsonConfigPath = './angular.json/';
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

export function error(msg: string): void {
	throw new Error(`✖ Migration failed: ${msg}\n`);
}

export function infoText(context: SchematicContext, msg: string): void {
	context.logger.info(colors.cyan(`** ${msg} **\n`));
}

export function infoMigration(context: SchematicContext, msg: string): void {
	context.logger.info(colors.black(`▸ ${msg}`));
}

export function success(context: SchematicContext, msg: string): void {
	context.logger.info(colors.green(`✔ ${msg}\n`));
}

export function warn(context: SchematicContext, msg: string): void {
	context.logger.info(colors.yellow(`\n! ${msg}\n`));
}

export function checkPrecondition(tree: Tree, pkg: string) {
	const current = extractVersion(getDepVersion(tree, pkg) || '');
	const target = extractVersion(getTargetDepVersion(tree, pkg) || '') || ({} as Version);

	if (!current || current.major < target.major || current.minor < target.minor || current.patch < target.patch) {
		error(`Unmet peer dependency. Need "${pkg}" at least at version "${target.major}.${target.minor}.${target.patch}"`);
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
	return version instanceof Function ? version(getAngularVersion(tree)) : version;
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

export function getRootAngularConfig(tree: Tree, path: string[]): any {
	const json = getJson(tree, angularJsonConfigPath);
	return getJsonProperty(json, path.join(';'));
}

export function setRootAngularConfig(tree: Tree, path: string[], value: any): Tree {
	const json = getJson(tree, angularJsonConfigPath);
	setOption(json, path, value);
	tree.overwrite(angularJsonConfigPath, JSON.stringify(json, null, 2));
	return tree;
}

export function getAngularConfig(tree: Tree, path: string[]): any {
	const json = getJson(tree, angularJsonConfigPath);
	const defaultProjectName = getJsonProperty(json, 'defaultProject');
	return getJsonProperty(json, ['projects', defaultProjectName, ...path].join(';'));
}

export function setAngularConfig(tree: Tree, path: string[], value: any): Tree {
	return alterAngularConfig(tree, path, value);
}

export function addAngularConfig(tree: Tree, path: string[], value: any): Tree {
	return setAngularConfig(tree, path, [...(getAngularConfig(tree, path) || []), value]);
}

export function removeAngularConfig(tree: Tree, path: string[]): Tree {
	return alterAngularConfig(tree, path);
}

function alterAngularConfig(tree: Tree, path: string[], value?: any): Tree {
	const json = getJson(tree, angularJsonConfigPath);
	const defaultProjectName = getJsonProperty(json, 'defaultProject');
	setOption(json, ['projects', defaultProjectName, ...path], value);
	tree.overwrite(angularJsonConfigPath, JSON.stringify(json, null, 2));
	return tree;
}

function setOption(json: any, path: string[], value?: any) {
	const option = path.shift() as string;
	if (path.length) {
		if (!json[option]) {
			json[option] = {};
		}
		setOption(json[option], path, value);
	} else {
		if (value) {
			json[option] = value;
		} else {
			delete json[option];
		}
	}
}

export function getJson(tree: any, path: string) {
	const json = readFile(tree, path);
	return json ? JSON.parse(json.toString()) : undefined;
}

export function getJsonProperty(json: any, propertyPath: string): string {
	return propertyPath.split(';').reduce((obj, property) => (obj ? obj[property] : undefined), json);
}

export function installDependencies(): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		_context.addTask(new NodePackageInstallTask());
		_context.logger.debug('Dependencies installed');
		return tree;
	};
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

export function addFile(tree: Tree, filename: string, content: string): void {
	if (!tree.exists(filename)) {
		tree.create(filename, content);
	}
}

export function readFile(tree: Tree, filename: string): string {
	const src = tree.read(filename);
	return src ? src.toString() : '';
}

export function getAngularVersion(tree: Tree): number {
	return parseInt(readFile(tree, packageJsonConfigPath).match(/@angular\/core":\s*"[~,^]?(?<version>\d+)\.\d+\.\d+"/)?.groups?.version || '0', 10);
}

export function getDepVersion(tree: Tree, dep: string): string | undefined {
	const pattern = new RegExp(`"${dep}":\\s*"[~,^]?(?<version>\\d+\\.\\d+\\.\\d+)"`);
	return readFile(tree, packageJsonConfigPath).match(pattern)?.groups?.version;
}

export function createSrcFile(tree: Tree, source: string): SourceFile {
	return ts.createSourceFile(source, readFile(tree, source), ts.ScriptTarget.Latest, true);
}
