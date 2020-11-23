import {Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {colors} from '@angular-devkit/core/src/terminal';
import {NodePackageInstallTask} from '@angular-devkit/schematics/tasks';

export const packageJsonConfigPath = './package.json';
export const ObliquePackage = '@oblique/oblique';

const angularJsonConfigPath = './angular.json/';

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
	context.logger.info(colors.green(`\n✔ ${msg}\n`));
}

export function warn(context: SchematicContext, msg: string): void {
	context.logger.info(colors.yellow(`\n! ${msg}\n`));
}

export function infoHighlights(context: SchematicContext, msg: string, ...highlights: string[]): void {
	const message = highlights.reduce((text, highlight) => text.replace('%c', colors.bold(highlight)), msg);
	context.logger.info(colors.black(`${message}\n`));
}

export function readFile(tree: Tree, filename: string): string {
	const src = tree.read(filename);
	return src ? src.toString() : '';
}

export function addFile(tree: Tree, filename: string, content: string | Buffer | null): void {
	if (!tree.exists(filename) && content) {
		tree.create(filename, content);
	}
}

export function getJson(tree: any, path: string) {
	const json = readFile(tree, path);
	return json ? JSON.parse(json.toString()) : undefined;
}

export function getAngularConfigs(tree: Tree, path: string[]): {project: string; config: any}[] {
	const json = getJson(tree, angularJsonConfigPath);
	return Object.keys(getJsonProperty(json, 'projects'))
		.reduce((config, project) => [...config, {project, config: getJsonProperty(json, ['projects', project, ...path].join(';'))}], [])
		.filter(project => project.config);
}

export function getDefaultAngularConfig(tree: Tree, path: string[]): any {
	const json = getJson(tree, angularJsonConfigPath);
	const defaultProjectName = getJsonProperty(json, 'defaultProject');
	return getJsonProperty(json, ['projects', defaultProjectName, ...path].join(';'));
}

export function setRootAngularConfig(tree: Tree, path: string[], value: any): Tree {
	const json = getJson(tree, angularJsonConfigPath);
	setOption(json, path, value);
	tree.overwrite(angularJsonConfigPath, JSON.stringify(json, null, 2));
	return tree;
}

export function setAngularConfig(tree: Tree, path: string[], value: {project: string; config: any}): Tree {
	return alterAngularConfig(tree, path, value.project, value.config);
}

export function setAngularProjectsConfig(tree: Tree, path: string[], config: any): Tree {
	getAngularConfigs(tree, path).forEach(project => {
		setAngularConfig(tree, path, {project: project.project, config: config instanceof Function ? config(project.config) : config});
	});
	return tree;
}

export function addAngularConfigInList(tree: Tree, path: string[], value: any): Tree {
	getAngularConfigs(tree, path).forEach(project => setAngularConfig(tree, path, {project: project.project, config: [...(project.config || []), value]}));
	return tree;
}

export function removeAngularProjectsConfig(tree: Tree, path: string[]): Tree {
	getAngularConfigs(tree, path).forEach(project => removeAngularConfig(tree, path, project.project));
	return tree;
}

export function installDependencies(): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		_context.addTask(new NodePackageInstallTask());
		_context.logger.debug('Dependencies installed');
		return tree;
	};
}

export function replaceInFile(tree: Tree, path: string, pattern: string | RegExp, replacement: string): void {
	tree.overwrite(path, readFile(tree, path).replace(pattern, replacement));
}

function getJsonProperty(json: any, propertyPath: string): string {
	return propertyPath.split(';').reduce((obj, property) => (obj ? obj[property] : undefined), json);
}

function removeAngularConfig(tree: Tree, path: string[], project: string): Tree {
	return alterAngularConfig(tree, path, project);
}

function alterAngularConfig(tree: Tree, path: string[], project: string, value?: any): Tree {
	const json = getJson(tree, angularJsonConfigPath);
	setOption(json, ['projects', project, ...path], value);
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
