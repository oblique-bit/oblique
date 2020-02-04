import { Tree, Rule, SchematicContext } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {addPackageJsonDependency, NodeDependency, NodeDependencyType, removePackageJsonDependency} from '@schematics/angular/utility/dependencies';
import { colors } from '@angular-devkit/core/src/terminal';


export const NODE_MODULES = './node_modules';

export const OB_VERSION = {
	'version-5': {
		'LATEST': '5.0.0-alpha.2',
		'5_0_1': '5.0.1'
	},
	'version-6': {
		'LATEST': '6.0.0-alpha'
	}
};
export const OB_LATEST = OB_VERSION['version-6'].LATEST;
export const OB_LAST_MAJOR_SUPPORT_VERSION = 4;
export const OB_PACKAGE = '@oblique/oblique';
export const OB_PACKAGE_JSON = NODE_MODULES + '/' + OB_PACKAGE + '/package.json';

export const PROJECT_SRC_DIR = './src';
export const PROJECT_APP_MODULE = PROJECT_SRC_DIR + '/app.module.ts';
export const PROJECT_ROUTING_MODULE = PROJECT_SRC_DIR + '/app/app-routing.module.ts';
export const PROJECT_ANGULAR_JSON = './angular.json';
export const PROJECT_PACKAGE_JSON = './package.json';

export function getCurrentObliqueVersion(tree: Tree) {
	const projectPackageJSON = JSON.parse(getFile(tree, PROJECT_PACKAGE_JSON));
	if ( !projectPackageJSON['dependencies'].hasOwnProperty(OB_PACKAGE) ) {
		throw new Error(`[ERROR] no installation found, abort migration`);
	}
	return projectPackageJSON['dependencies'][OB_PACKAGE];
}

export function getFile(tree: Tree, path: string) {
	const content = tree.read(path);
	if ( !content ) {
		throw new Error(`[ERROR] unable to read '${path}, abort migration'`);
	}
	return content.toString('utf-8');
}

export function installDependencies(): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		_context.addTask(new NodePackageInstallTask());
		_context.logger.debug('Dependencies installed');
		return tree;
	};
}

export function upsertPackageJSONDependency(name: string, version: string): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		removePackageJsonDependency(tree, name);
		const nodeDependency: NodeDependency = {
			type: NodeDependencyType.Default,
			name: name,
			version: version,
			overwrite: true
		};
		addPackageJsonDependency(tree, nodeDependency);
		_context.logger.info(colors.blue(`- ${name}@${version}`) + colors.green(` ✔`));
		return tree;
	};
}

/*
export function getSourceRoot(tree: Tree, project: string) {
	const angularJsonContent = getFileContent(tree, 'angular.json');
	const workspaceSettings = JSON.parse(angularJsonContent);
	const projectOptions = workspaceSettings.projects[project];

	return projectOptions && projectOptions.sourceRoot;
}

export function importModule(moduleName: string, src: string, options: any) {
	return (tree: Tree, _context: SchematicContext) => {

		const workspace = getWorkspace(tree);
		const project = getProjectFromWorkspace(workspace, options.defaultProject);

		if (hasNgModuleImport(tree, appModulePath, moduleName)) {
			return printModuleAlreadyImported(moduleName, _context);
		}
		addModuleImportToRootModule(tree, moduleName, src, project);
		_context.logger.info(
			green(
				'Imported' + moduleName + ' into root module'
			)
		);

		return tree;
	};
}

export function applyChanges(tree: Tree, filePath: string, changes: Change[]) {
	const records = tree.beginUpdate(filePath);

	for (const change of changes) {
		if (change instanceof InsertChange) {
			records.insertLeft(change.pos, change.toAdd);
		}
	}
	tree.commitUpdate(records);
	return tree;
}

*/
