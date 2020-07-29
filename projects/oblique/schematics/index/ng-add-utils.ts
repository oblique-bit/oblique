import {Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {addModuleImportToRootModule, getProjectFromWorkspace, hasNgModuleImport} from '@angular/cdk/schematics';
import {colors} from '@angular-devkit/core/src/terminal';
import {NodePackageInstallTask} from '@angular-devkit/schematics/tasks';
import {getFileContent} from '@schematics/angular/utility/test';
import {getWorkspace} from '@schematics/angular/utility/config';
import {addPackageJsonDependency, NodeDependency, NodeDependencyType} from '@schematics/angular/utility/dependencies';
import {Change, InsertChange} from '@schematics/angular/utility/change';
import {execSync} from 'child_process';
import * as fs from 'fs';

export const OBLIQUE_PACKAGE = '@oblique/oblique';
export const appModulePath = 'src/app/app.module.ts';
export const angularJsonConfigPath = './angular.json/';
export const packageJsonConfigPath = './package.json/';
export const routingModulePath = 'src/app/app-routing.module.ts';
export const pathToTemplates = './node_modules/@oblique/oblique/schematics/index/ng-add/templates';
export const obliqueCssPath = 'node_modules/@oblique/oblique/styles/css/oblique-core.css';
const versions: {[key: string]: string | string[]} = {
	// eslint-disable-next-line prettier/prettier
	ajv: '^6.0.0',
	'@ngx-translate/core': ['^12.0.0', '^13.0.0'],
	'@ng-bootstrap/ng-bootstrap': ['^6.0.0', '^7.0.0'],
	'@angular/cdk': ['^9.0.0', '^10.0.0'],
	'@angular/material': ['^9.0.0', '^10.0.0'],

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

export function createDevDependency(name: string, angular10 = false): NodeDependency {
	let version = versions[name];
	if (Array.isArray(version)) {
		version = version[angular10 ? 1 : 0];
	}
	return {type: NodeDependencyType.Dev, version: version as string, name: name};
}

export function createDependency(name: string, angular10 = false): NodeDependency {
	let version = versions[name];
	if (Array.isArray(version)) {
		version = version[angular10 ? 1 : 0];
	}
	return {type: NodeDependencyType.Default, version: version as string, name: name};
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

export function addPackageDependency(dependencyName: string, version: string, dependencyType?: NodeDependencyType, overwrite?: boolean): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		addPackageJsonDependency(tree, {
			type: dependencyType || NodeDependencyType.Default,
			name: dependencyName,
			version: version,
			overwrite: overwrite
		});
		return tree;
	};
}

export function applyChanges(tree: Tree, filePath: string, changes: Change[]) {
	const records = tree.beginUpdate(filePath);
	changes.filter(change => change instanceof InsertChange).forEach((change: InsertChange) => records.insertLeft(change.pos, change.toAdd));
	tree.commitUpdate(records);
	return tree;
}

export function getJson(tree: any, path: string) {
	const json = tree.read(path);
	return json ? JSON.parse(json.toString()) : undefined;
}

export function getJsonProperty(json: any, propertyPath: string): string {
	return propertyPath.split(';').reduce((obj, property) => obj[property], json);
}

export function getObliqueVersion(tree: Tree): string {
	// Version of oblique is inserted into version.d.ts from gulpfile and we can take the version value out of that file.
	const fileContent = getFileContent(tree, 'node_modules/@oblique/oblique/lib/version.d.ts');
	return (/\d\.\d\.\d/.exec(fileContent) || [])[0];
}

export function addPreconditions(): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (!getFileContent(tree, './package.json').includes('"@angular/localize"')) {
			_context.logger.info(colors.blue('- Seems there is no @localize, will add it for you...'));
			execSync('ng add @angular/localize');
		}

		_context.logger.info(colors.black(colors.bold(`\nTHANK YOU FOR USING OBLIQUE! STARTING ADDING OBLIQUE TO YOUR PROJECT 💙 \n`)));

		return tree;
	};
}

export function installDependencies(): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		_context.addTask(new NodePackageInstallTask());
		_context.logger.debug('Dependencies installed');
		return tree;
	};
}

export function getTemplate(file: string): string {
	return fs.readFileSync(`${pathToTemplates}/${file}`).toString();
}

export function deleteFile(tree: Tree, filename: string): void {
	if (tree.exists(filename)) {
		tree.delete(filename);
	}
}

export function addFile(tree: Tree, filename: string, content: string): void {
	if (!tree.exists(filename)) {
		tree.create(filename, content);
	}
}

export function isAngular10(tree: Tree): boolean {
	return !!getJson(tree, 'tsconfig.base.json');
}
