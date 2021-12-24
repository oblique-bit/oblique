import {Rule, SchematicContext, Tree, chain} from '@angular-devkit/schematics';
import {getTemplate} from '../ng-add-utils';
import {addAngularConfigInList, addFile, infoMigration, setAngularProjectsConfig} from '../../utils';

export function jenkins(config: string, staticBuild: boolean, jest: boolean): Rule {
	return (tree: Tree, _context: SchematicContext) =>
		chain([addDevEnv(config.includes(';')), addJenkins(config.includes(';'), jest), addCF(config, staticBuild), addStaticBuildPack(staticBuild)])(
			tree,
			_context
		);
}

function addDevEnv(dev: boolean): Rule {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	return (tree: Tree, _context: SchematicContext) =>
		!dev
			? tree
			: setAngularProjectsConfig(tree, ['architect', 'build', 'configurations'], (config: any) => {
					if (!config.dev && config.production) {
						config.dev = JSON.parse(JSON.stringify(config.production));
						if (config.dev.fileReplacements) {
							config.dev.fileReplacements[0].with = config.dev.fileReplacements[0].with.replace('prod', 'dev');
						}
						config.dev.optimization = false;
						config.dev.sourceMap = true;
					}
					return config;
			  });
}

function addJenkins(useJenkins: boolean, jest: boolean): Rule {
	return (tree: Tree, _context: SchematicContext) => {
		if (useJenkins) {
			infoMigration(_context, 'Toolchain: Adding Jenkins configuration');
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
			infoMigration(_context, 'Toolchain: Adding Cloud Foundry configuration');
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
		if (!staticBuildPack) {
			return tree;
		}
		infoMigration(_context, 'Toolchain: Adding Static build pack');
		addFile(tree, 'src/Staticfile', getTemplate(tree, 'default-Staticfile.config'));
		return addAngularConfigInList(tree, ['architect', 'build', 'options', 'assets'], 'src/Staticfile');
	};
}
