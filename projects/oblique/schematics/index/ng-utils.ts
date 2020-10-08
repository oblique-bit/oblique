import {Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {colors} from '@angular-devkit/core/src/terminal';
import {NodePackageInstallTask} from '@angular-devkit/schematics/tasks';

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

export function getJson(tree: any, path: string) {
	const json = readFile(tree, path);
	return json ? JSON.parse(json.toString()) : undefined;
}

export function getJsonProperty(json: any, propertyPath: string): string {
	return propertyPath.split(';').reduce((obj, property) => (obj ? obj[property] : undefined), json);
}

export function getAngularConfig(tree: Tree, path: string[]): any {
	const json = getJson(tree, angularJsonConfigPath);
	const defaultProjectName = getJsonProperty(json, 'defaultProject');
	return getJsonProperty(json, ['projects', defaultProjectName, ...path].join(';'));
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

export function installDependencies(): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		_context.addTask(new NodePackageInstallTask());
		_context.logger.debug('Dependencies installed');
		return tree;
	};
}
