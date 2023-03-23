import {Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {NodePackageInstallTask} from '@angular-devkit/schematics/tasks';
import * as colors from 'ansi-colors';
import {getTemplate} from './ng-add/ng-add-utils';

export const packageJsonConfigPath = '/package.json';
export const ObliquePackage = '@oblique/oblique';
const glob = require('glob'); /* eslint-disable-line @typescript-eslint/no-var-requires */

const angularJsonConfigPath = './angular.json/';
export let isSuccessful = true;

export interface PathPerProject {
	project: string;
	path: string;
}

export function error(msg: string): void {
	throw new Error(`${colors.symbols.cross} Migration failed: ${msg}\n`);
}

export function infoText(context: SchematicContext, msg: string): void {
	context.logger.info(colors.cyanBright(`\n${colors.symbols.info} ${msg}\n`));
}

export function infoMigration(context: SchematicContext, msg: string): void {
	context.logger.info(`${colors.symbols.pointer} ${msg}`);
}

export function success(context: SchematicContext, msg: string): void {
	context.logger.info(colors.greenBright(`\n${colors.symbols.check} ${msg}\n`));
}

export function warn(context: SchematicContext, msg: string): void {
	context.logger.info(colors.yellowBright(`\n${colors.symbols.warning} ${msg}\n`));
}

export function createSafeRule(callback: (tree: Tree, context: SchematicContext) => Rule | Tree): Rule {
	return (tree: Tree, context: SchematicContext) => {
		try {
			return callback(tree, context);
		} catch (thrownError) {
			isSuccessful = false;
			const groups =
				/@oblique[/\\]oblique[/\\]schematics[/\\].*[/\\](?<file>\w*\.js):(?<line>\d*)/.exec(thrownError.stack || '')?.groups || {};
			const errorMessage: string = thrownError.message || thrownError;
			warn(
				context,
				`The previous task failed and the change needs to be done manually.\nPlease inform the Oblique team (oblique@bit.admin.ch) of the following error:\n\t${errorMessage}, in "${groups.file}" on line ${groups.line}`
			);
			return tree;
		}
	};
}

export function infoHighlights(context: SchematicContext, msg: string, ...highlights: string[]): void {
	const message = highlights.reduce((text, highlight) => text.replace('%c', colors.bold(highlight)), msg);
	context.logger.info(`${message}\n`);
}

export function readFile(tree: Tree, fileName: string): string {
	const src = tree.read(fileName);
	return src ? src.toString() : '';
}

export function addFile(tree: Tree, fileName: string, content: string | Buffer | null): void {
	if (!tree.exists(fileName) && content) {
		tree.create(fileName, content);
	}
}

export function writeFile(tree: Tree, fileName: string, content: string | Buffer | null): void {
	if (content) {
		if (tree.exists(fileName) && content) {
			tree.overwrite(fileName, content);
		} else {
			tree.create(fileName, content);
		}
	}
}

export function deleteFile(tree: Tree, fileName: string): Tree {
	if (tree.exists(fileName)) {
		tree.delete(fileName);
	}
	return tree;
}

export function replaceInFile(tree: Tree, path: string, pattern: string | RegExp, replacement: string): void {
	tree.overwrite(path, readFile(tree, path).replace(pattern, replacement));
}

export function getJson(tree: any, path: string): any {
	const json = readFile(tree, path);
	return json ? JSON.parse(json.toString()) : undefined;
}

export function getAngularConfigs(tree: Tree, path: string[]): {project: string; config: any}[] {
	return getAngularProjectsWithConfigs(tree, path).filter(project => project.config);
}

export function getAngularProjectsWithConfigs(tree: Tree, path: string[]): {project: string; config: any}[] {
	const json = getJson(tree, angularJsonConfigPath);
	return Object.keys(getJsonProperty(json, 'projects')).reduce(
		(config, project) => [
			...config,
			{
				project,
				config: getJsonProperty(json, ['projects', project, ...path].join(';'))
			}
		],
		[]
	);
}

export function checkIfAngularConfigExists(tree: Tree, path: string[], config: string): boolean {
	return getAngularConfigs(tree, path).reduce((exists, conf) => exists || conf.config === config, false);
}

export function overwriteIndexFile(
	indexPath: string,
	tree: Tree,
	searchValue: RegExp | string,
	replaceValue: string = getTemplate(tree, 'default-index.html')
): void {
	if (!indexPath || !tree.exists(indexPath)) {
		indexPath = './index.html';
	}
	if (tree.exists(indexPath)) {
		tree.overwrite(indexPath, readFile(tree, indexPath).replace(searchValue, replaceValue));
	}
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
		setAngularConfig(tree, path, {
			project: project.project,
			config: config instanceof Function ? config(project.config) : config
		});
	});
	return tree;
}

export function setOrCreateAngularProjectsConfig(tree: Tree, path: string[], config: any): Tree {
	getAngularProjectsWithConfigs(tree, path).forEach(project => {
		setAngularConfig(tree, path, {
			project: project.project,
			config: config instanceof Function ? config(project.config) : config
		});
	});
	return tree;
}

export function addAngularConfigInList(tree: Tree, path: string[], value: any): Tree {
	getAngularConfigs(tree, path).forEach(project =>
		setAngularConfig(tree, path, {
			project: project.project,
			config: [...(project.config || []).filter((current: any) => current !== value), value]
		})
	);
	return tree;
}

export function removeAngularProjectsConfig(tree: Tree, path: string[]): Tree {
	getAngularConfigs(tree, path).forEach(project => removeAngularConfig(tree, path, project.project));
	return tree;
}

export function installDependencies(): Rule {
	return createSafeRule((tree: Tree, _context: SchematicContext) => {
		_context.addTask(new NodePackageInstallTask());
		_context.logger.debug('Dependencies installed');
		return tree;
	});
}

export function applyInTree(tree: Tree, toApply: (file: string) => void, pattern = '*'): Tree {
	getAngularConfigs(tree, ['sourceRoot'])
		.map(project => project.config)
		.reduce<string[]>((files, root: string) => [...files, ...glob.sync(`${root}/**/${pattern}`, {})], [])
		.forEach((file: string) => toApply(file));
	return tree;
}

export function addInterface(tree: Tree, fileName: string, name: string): void {
	const content = readFile(tree, fileName);
	if (!new RegExp(`export class\\s*\\w*\\s*implements.*${name}`, 'm').test(content)) {
		tree.overwrite(
			fileName,
			content
				.replace(
					/(?<classDef>export class\s*\w*(?:\s*extends \w*)?)(?:\s*implements\s*)?(?<implements>\w*(?:,\s*\w*)*)\s*{/,
					`$<classDef> implements $<implements>, ${name} {`
				)
				.replace('implements ,', 'implements')
		);
	}
}

export function addImport(tree: Tree, fileName: string, name: string, pkg: string): void {
	const content = readFile(tree, fileName);
	if (!hasImport(content, name, pkg)) {
		tree.overwrite(
			fileName,
			new RegExp(`import\\s*{.*}\\s*from\\s*['"]${pkg}['"]`, 'm').test(content)
				? content.replace(new RegExp(`import\\s*{(?<package>.*)}\\s*from\\s*['"]${pkg}['"]`), `import {$<package>, ${name}} from '${pkg}'`)
				: `import {${name}} from '${pkg}';\n${content}`
		);
	}
}

export function removeImport(tree: Tree, fileName: string, name: string, pkg: string): void {
	const content = readFile(tree, fileName);
	if (hasImport(content, name, pkg)) {
		tree.overwrite(
			fileName,
			new RegExp(`import\\s*{\\s*${name}\\s*}\\s*from\\s*['"]${pkg}['"]`, 'm').test(content)
				? content.replace(new RegExp(`import\\s*{\\s*${name}\\s*}\\s*from\\s*['"]${pkg}['"]\\s*;\\s*`), '')
				: content
						.replace(new RegExp(`(import\\s*{\\s*.*)${name}(?:,\\s*)?(.*\\s*}\\s*from\\s*['"]${pkg}['"]\\s*;\\s*)`, 's'), '$1$2')
						.replace(/,\s*}/, '}')
		);
	}
}

export function getIndexPaths(tree: Tree): string[] {
	const index = getDefaultAngularConfig(tree, ['architect', 'build', 'options', 'index']) as string | null;
	return index ? ([index] as string[]) : getAngularConfigs(tree, ['architect', 'build', 'options', 'index']).map(project => project.config);
}

function getDefaultAngularConfig(tree: Tree, path: string[]): string | boolean | number | null | unknown {
	const json = getJson(tree, angularJsonConfigPath);
	const defaultProjectName = getJsonProperty(json, 'defaultProject');
	return defaultProjectName ? getJsonProperty(json, ['projects', defaultProjectName, ...path].join(';')) : null;
}

export function addTsCompilerOption(content: string, option: string): string {
	if (new RegExp(`"${option}"\\s*:\\s*true`).test(content)) {
		return content;
	}
	if (new RegExp(`"${option}"\\s*:\\s*false`).test(content)) {
		return content.replace(new RegExp(`(?<="${option}"\\s*:\\s*)false`), 'true');
	}
	if (content.includes('compilerOptions')) {
		return content.replace(/(?<=compilerOptions.*)\n/, `\n    "${option}": true,\n`);
	}
	return content.replace('{', `{\n  "compilerOptions": {\n    "${option}": true\n  },`);
}

export function getPackageJsonPath(tree: Tree, project: string): string {
	const sourceRoot: string = getAngularConfigs(tree, ['sourceRoot']).find(config => config.project === project)?.config;
	const depth: string[] = sourceRoot?.match(/\//g) || [];
	return depth.reduce<string>(path => `../${path}`, '../package.json');
}

export function getFilePathPerProject(tree: Tree, property: string[]): PathPerProject[] {
	return getAngularConfigs(tree, property)
		.map(config => ({project: config.project, path: config.config}))
		.filter(config => !!config.path && tree.exists(config.path));
}

export function getRootModulePathPerProject(tree: Tree, mainTsPaths: PathPerProject[]): PathPerProject[] {
	return mainTsPaths
		.map(file => ({...file, directory: extractDirectoryFromPath(file.path)}))
		.map(file => ({...file, content: readFile(tree, file.path)}))
		.map(file => ({...file, rootModule: extractBootstrappedModule(file.content)}))
		.filter(file => !!file.rootModule)
		.map(file => ({...file, rootModulePath: extractRootModulePath(file.rootModule, file.content)}))
		.filter(file => !!file.rootModulePath)
		.map(file => ({...file, rootModulePath: addFileExtension(file.rootModulePath)}))
		.map(file => ({...file, rootModulePath: addRelativePath(file.rootModulePath, file.directory)}))
		.filter(file => tree.exists(file.rootModulePath))
		.map(file => ({project: file.project, path: file.rootModulePath}));
}

export function getProjectList(tree: Tree): string[] {
	const json = getJson(tree, angularJsonConfigPath);
	return Object.keys(getJsonProperty(json, 'projects'));
}

function extractDirectoryFromPath(filePath: string): string {
	return /(?<directory>.*\/)/.exec(filePath)?.groups?.directory ?? '';
}

function extractBootstrappedModule(fileContent: string): string {
	return /bootstrapModule\(\s*(?<rootModule>\w*)\s*\)/.exec(fileContent)?.groups?.rootModule ?? '';
}

function extractRootModulePath(moduleName: string, fileContent: string): string {
	return (
		RegExp(`import\\s*{\\s*${moduleName}\\s*}\\s*from\\s*["'](?<rootModulePath>.*)["']`).exec(fileContent)?.groups?.rootModulePath ?? ''
	);
}

function addFileExtension(filePath: string): string {
	return /.ts$/m.test(filePath) ? filePath : `${filePath}.ts`;
}

function addRelativePath(filePath: string, directory: string): string {
	return /^\./m.test(filePath) ? filePath.replace('.', directory) : filePath;
}

function hasImport(content: string, name: string, pkg: string): boolean {
	return new RegExp(`import\\s*{\\s*.*${name}.*from\\s*['"]${pkg}['"]`, 'ms').test(content);
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

function setOption(json: any, path: string[], value?: any): void {
	const option = path.shift();
	if (option) {
		if (path.length) {
			if (!json[option]) {
				json[option] = {};
			}
			setOption(json[option], path, value);
		} else if (value) {
			json[option] = value;
		} else {
			delete json[option];
		}
	}
}
