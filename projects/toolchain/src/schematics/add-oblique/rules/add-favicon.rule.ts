import type {Rule, Tree} from '@angular-devkit/schematics';
import type {ObGroupLogger} from '../../../logger';

const angularJsonPath = 'angular.json';
const defaultIndexPath = 'src/index.html';
const sourceFavicon = '<link rel="icon" type="image/x-icon" href="favicon.ico">';
const targetFavicon = '<link href="assets/images/favicon.png" rel="shortcut icon"/>';

interface AngularConfig {
	defaultProject?: string;
	projects?: Record<string, unknown>;
}

export function addFavicon(logger: ObGroupLogger): Rule {
	return (tree: Tree) => {
		logger.step('Embed Oblique favicon');
		getIndexPaths(tree).forEach(indexPath => {
			if (!tree.exists(indexPath)) {
				return;
			}
			const content = tree.read(indexPath)?.toString();
			if (!content) {
				return;
			}
			tree.overwrite(indexPath, content.replace(sourceFavicon, targetFavicon));
		});
		return tree;
	};
}

function getIndexPaths(tree: Tree): string[] {
	if (!tree.exists(angularJsonPath)) {
		return [defaultIndexPath];
	}

	const content = tree.read(angularJsonPath)?.toString() ?? '{}';
	const angularConfig = getAngularConfig(JSON.parse(content) as unknown);
	const projects = angularConfig.projects || {};
	const projectNames = angularConfig.defaultProject ? [angularConfig.defaultProject] : Object.keys(projects);
	const indexPaths = projectNames
		.map(project => getProjectIndex(projects[project]))
		.filter((path): path is string => Boolean(path));

	return indexPaths.length > 0 ? indexPaths : [defaultIndexPath];
}

function getAngularConfig(value: unknown): AngularConfig {
	if (!isRecord(value)) {
		return {};
	}
	const defaultProject = value['defaultProject'];
	const projects = value['projects'];
	return {
		defaultProject: typeof defaultProject === 'string' ? defaultProject : undefined,
		projects: isRecord(projects) ? projects : undefined,
	};
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

function getProjectIndex(project: unknown): string | undefined {
	if (!isRecord(project)) {
		return undefined;
	}
	const architect = project['architect'];
	if (!isRecord(architect)) {
		return undefined;
	}
	const build = architect['build'];
	if (!isRecord(build)) {
		return undefined;
	}
	const options = build['options'];
	if (!isRecord(options)) {
		return undefined;
	}
	return getIndexPath(options['index']);
}

function getIndexPath(index: unknown): string | undefined {
	if (typeof index === 'string') {
		return index;
	}
	if (isRecord(index) && typeof index['input'] === 'string') {
		return index['input'];
	}
	return undefined;
}
