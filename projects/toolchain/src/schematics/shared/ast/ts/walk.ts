import type {Node, SourceFile} from 'typescript';

export type TraversalOrder = 'parent-first' | 'children-first';

/**
 * Finds the first node matching the given predicate in a source file.
 *
 * The traversal descends into nested nodes (e.g. a `describe` block), so a node nested inside
 * other statements is found as well. The order controls which match wins when a node and its
 * descendants both match:
 * - `parent-first` returns the outermost matching node (the node itself is checked before its
 *   children).
 * - `children-first` returns the innermost matching node (children are checked before the node).
 *
 * @param sourceFile - The source file to search.
 * @param predicate - A type predicate that identifies the node to find.
 * @param order - Whether to prefer the outermost (`parent-first`) or innermost (`children-first`)
 *   matching node. Defaults to `parent-first`.
 * @returns The matching node, or `undefined` if none matches.
 */
export function findFirstNode<T extends Node>(
	sourceFile: SourceFile,
	predicate: (node: Node) => node is T,
	order: TraversalOrder = 'parent-first'
): T | undefined {
	const visit = (node: Node): T | undefined => {
		if (order === 'parent-first' && predicate(node)) {
			return node;
		}
		for (const child of node.getChildren(sourceFile)) {
			const found = visit(child);
			if (found) {
				return found;
			}
		}
		if (order === 'children-first' && predicate(node)) {
			return node;
		}
		return undefined;
	};
	return visit(sourceFile);
}
