import {type Rule, type Tree, chain, noop, template} from '@angular-devkit/schematics';
import {getWorkspace} from '@schematics/angular/utility/workspace';
import type {ObGroupLogger} from '../../../logger';
import {createFromTemplate} from '../../shared/template/template';
import {addPropertyToJsonFile} from '../../shared/json';

const proxyFile = 'proxy.conf.json';

function logProxyCreation(logger: ObGroupLogger): Rule {
	return (tree: Tree) => {
		if (!tree.exists(proxyFile)) {
			logger.step(`Create ${proxyFile} file at project root`);
		}
		return tree;
	};
}

function createProxyFile(port: string): Rule {
	return (tree: Tree) => {
		if (tree.exists(proxyFile)) {
			return noop();
		}
		return createFromTemplate('./templates/add-proxy', [template({port})]);
	};
}

async function updateAngularJson(tree: Tree, logger: ObGroupLogger): Promise<Tree> {
	if (!tree.exists('angular.json')) {
		return tree;
	}

	logger.step('Update angular.json to use proxy configuration');
	const workspace = await getWorkspace(tree);
	const projects = Array.from(workspace.projects.keys());
	for (const projectName of projects) {
		const proxyConfigPath = `projects.${projectName}.architect.serve.options.proxyConfig`;
		addPropertyToJsonFile(tree, 'angular.json', {key: proxyConfigPath, value: proxyFile});
	}

	return tree;
}

function addProxy(logger: ObGroupLogger, port?: string): Rule {
	if (!port) {
		return chain([]);
	}
	let proxyExisted = false;
	return chain([
		(tree: Tree) => {
			proxyExisted = tree.exists(proxyFile);
			return tree;
		},
		logProxyCreation(logger),
		createProxyFile(port),
		(tree: Tree) => (proxyExisted ? tree : updateAngularJson(tree, logger)),
	]);
}

export default addProxy;
