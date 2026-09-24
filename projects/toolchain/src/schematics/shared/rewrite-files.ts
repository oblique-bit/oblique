import type {Tree} from '@angular-devkit/schematics';

/**
 * Walks the tree and rewrites every file selected by the predicate whose source changes after the
 * transform. Files under `node_modules` are always skipped, as they must never be modified by a
 * schematic. Changed files are reported by the schematics run itself.
 *
 * @param tree - The tree to rewrite.
 * @param predicate - Selects which files to consider for rewriting.
 * @param transform - Transforms the source text of a selected file.
 * @returns The tree, with the rewritten files.
 */
export function rewriteFiles(
	tree: Tree,
	predicate: (path: string) => boolean,
	transform: (source: string) => string
): Tree {
	tree.visit(path => {
		if (isInNodeModules(path) || !predicate(path)) {
			return;
		}
		const source = tree.readText(path);
		const rewritten = transform(source);
		if (rewritten !== source) {
			tree.overwrite(path, rewritten);
		}
	});
	return tree;
}

function isInNodeModules(path: string): boolean {
	return path.split('/').includes('node_modules');
}
