import type {Rule, Tree} from '@angular-devkit/schematics';
import {getWorkspace} from '@schematics/angular/utility/workspace';
import type {ObGroupLogger} from '../../../logger';
import {isPlainObject, isString} from '../../shared/type-guards';

const sourceFavicon = '<link rel="icon" type="image/x-icon" href="favicon.ico">';
const targetFavicon = '<link href="assets/images/favicon.png" rel="shortcut icon"/>';

export function addFavicon(logger: ObGroupLogger): Rule {
	return async (tree: Tree) => {
		logger.step('Embed Oblique favicon');
		(await getIndexPaths(tree)).forEach(indexPath => {
			const content = tree.readText(indexPath);
			tree.overwrite(indexPath, content.replace(sourceFavicon, targetFavicon));
		});
		return tree;
	};
}

async function getIndexPaths(tree: Tree): Promise<string[]> {
	try {
		const workspace = await getWorkspace(tree);
		const indexes = Array.from(workspace.projects)
			.map(([, project]) => project.targets.get('build')?.options?.['index'])
			.map(index => (isIndexObject(index) ? index.input : index))
			.filter(index => isString(index))
			.filter(index => tree.exists(index));
		return indexes.length ? indexes : getDefaultIndex(tree);
	} catch {
		return getDefaultIndex(tree);
	}
}

function getDefaultIndex(tree: Tree): string[] {
	return tree.exists('src/index.html') ? ['src/index.html'] : [];
}

function isIndexObject(entry: unknown): entry is {input: string; output: string} {
	return isPlainObject(entry) && 'input' in entry && 'output' in entry;
}
