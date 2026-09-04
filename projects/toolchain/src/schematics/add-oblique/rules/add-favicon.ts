import type {Rule, Tree} from '@angular-devkit/schematics';
import {getWorkspace} from '@schematics/angular/utility/workspace';
import type {ObGroupLogger} from '../../../logger';
import {rewriteFiles} from '../../shared/rewrite-files';
import {isPlainObject, isString} from '../../shared/type-guards';
import {findElement, getAttribute, setAttribute, transformDocument} from '../../shared/ast/html';

export function addFavicon(logger: ObGroupLogger): Rule {
	return async (tree: Tree) => {
		logger.step('Embed Oblique favicon');
		const indexPaths = await getIndexPaths(tree);
		return rewriteFiles(tree, path => isIndexPath(path, indexPaths), replaceFavicon);
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

/**
 * Checks whether a visited tree path corresponds to one of the configured index paths. The visited
 * path starts with a slash (`/src/index.html`) while the workspace stores it without (`src/index.html`),
 * so the leading slash is stripped before comparing.
 */
function isIndexPath(path: string, indexPaths: string[]): boolean {
	return indexPaths.includes(path.replace(/^\//u, ''));
}

function isIndexObject(entry: unknown): entry is {input: string; output: string} {
	return isPlainObject(entry) && 'input' in entry && 'output' in entry;
}

function replaceFavicon(content: string): string {
	return transformDocument(content, document => {
		const head = findElement(document, 'head');
		const favicon = findElement(head, element => element.tagName === 'link' && getAttribute(element, 'rel') === 'icon');
		if (!favicon) {
			return;
		}
		setAttribute(favicon, 'type', 'image/png');
		setAttribute(favicon, 'href', 'assets/images/favicon.png');
	});
}
