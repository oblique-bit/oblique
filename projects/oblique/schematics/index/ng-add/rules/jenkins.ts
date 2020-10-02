import {chain, Rule, SchematicContext, Tree} from '@angular-devkit/schematics';
import {addFile, angularJsonConfigPath, getJson, getJsonProperty, getTemplate} from '../../ng-add-utils';

export function jenkins(config: string, staticBuild: boolean, jest: boolean): Rule {
	return (tree: Tree, _context: SchematicContext) =>
		chain([addDevEnv(config.includes(';')), addJenkins(config.includes(';'), jest), addCF(config, staticBuild), addStaticBuildPack(staticBuild)])(
			tree,
			_context
		);
}

function addDevEnv(dev: boolean): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (dev) {
			const json = getJson(tree, angularJsonConfigPath);
			const defaultProjectName = getJsonProperty(json, 'defaultProject');
			const devConfig = JSON.parse(JSON.stringify(json.projects[defaultProjectName].architect.build.configurations.production));
			devConfig.fileReplacements[0].with = devConfig.fileReplacements[0].with.replace('prod', 'dev');
			devConfig.optimization = false;
			devConfig.sourceMap = true;

			json.projects[defaultProjectName].architect.build.configurations.dev = devConfig;
			tree.overwrite(angularJsonConfigPath, JSON.stringify(json, null, 2));
		}
		return tree;
	};
}

function addJenkins(useJenkins: boolean, jest: boolean): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (useJenkins) {
			let jenkinsFile = getTemplate(tree, 'default-Jenkinsfile.config');
			if (!jest) {
				jenkinsFile = jenkinsFile.replace("\n\ttestEngine = 'jest'", '');
			}
			addFile(tree, 'Jenkinsfile', jenkinsFile);
		}
		return tree;
	};
}

function addCF(config: string, staticBuild: boolean): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (config.includes(';')) {
			const [orgName, appName] = config.split(';');
			let manifestDev = getTemplate(tree, 'default-manifest-dev.yml.config')
				.replace('ORG_NAME', orgName)
				.replace(/APP_NAME/g, appName);
			if (!staticBuild) {
				manifestDev = manifestDev.replace('\n  buildpack: staticfile_buildpack', '');
			}
			addFile(tree, 'manifest-dev.yml', manifestDev);
		}
		return tree;
	};
}

function addStaticBuildPack(staticBuildPack: boolean): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (staticBuildPack) {
			const staticFile = getTemplate(tree, 'default-Staticfile.config');
			addFile(tree, 'src/Staticfile', staticFile);
			const json = getJson(tree, angularJsonConfigPath);
			const defaultProjectName = getJsonProperty(json, 'defaultProject');
			json.projects[defaultProjectName].architect.build.options.assets.push('src/Staticfile');
			tree.overwrite(angularJsonConfigPath, JSON.stringify(json, null, 2));
		}
		return tree;
	};
}
