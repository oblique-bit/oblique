import {
	type CompilerOptions,
	type Node,
	ScriptTarget,
	type SourceFile,
	type TypeChecker,
	createCompilerHost,
	createProgram,
	createSourceFile,
	forEachChild,
} from 'typescript';
import type {Edit, TransformSourceConfig, TransformVisitor, TransformVisitorWithTypeChecker} from './types';

const defaultFileName = 'untitled.ts';
const defaultLibs = ['lib.es5.d.ts'] as const;

function createSourceFileFromText(source: string): SourceFile {
	return createSourceFile(defaultFileName, source, ScriptTarget.Latest, true);
}

/**
 * Builds a type checker for a single in-memory source file, as if it were the only file of a
 * project. The checker can be used to resolve types of expressions within the source file. Only the
 * given standard library declarations are loaded, so the checker knows exactly as much as the
 * caller needs and program creation stays fast (the full default lib, including the huge DOM
 * declarations, is slow to parse).
 *
 * @param sourceFile - The source file to type-check.
 * @param additionalLibs - Extra standard library declaration files to load on top of the default
 *   `lib.es5.d.ts`, which is always loaded.
 * @returns The type checker for the given source file.
 */
function createTypeChecker(sourceFile: SourceFile, additionalLibs: readonly string[] = []): TypeChecker {
	const options: CompilerOptions = {
		lib: [...defaultLibs, ...additionalLibs],
		skipLibCheck: true,
		target: ScriptTarget.Latest,
	};
	const host = createCompilerHost(options);
	// The program pulls every file from the host through `getSourceFile`. The default host reads
	// from disk, but our source file only exists in memory, so it must be handed to the program
	// explicitly. It is returned only for its own name: everything else is delegated to the default
	// host so the standard library declarations (e.g. `Promise`) are still loaded and types resolve.
	const originalGetSourceFile = host.getSourceFile.bind(host);
	host.getSourceFile = (name, languageVersion) =>
		name === sourceFile.fileName ? sourceFile : originalGetSourceFile(name, languageVersion);
	const program = createProgram([sourceFile.fileName], options, host);
	return program.getTypeChecker();
}

/**
 * Visits every node of the given kind and collects the edits reported by the visitor. The visitor
 * is only invoked for nodes matching `kind` and receives the node already typed as `N`, so it does
 * not need to check the node kind itself.
 *
 * @param source - The TypeScript source text to inspect.
 * @param kind - The {@link SyntaxKind} of the nodes to visit.
 * @param visitor - A callback that returns the edits to apply for a matching node, or nothing.
 * @returns The collected edits, in no particular order.
 */
export function transformSourceFile<N extends Node>(
	source: string,
	kind: N['kind'],
	visitor: TransformVisitor<N>
): Edit[] {
	const sourceFile = createSourceFileFromText(source);
	return transformSource({sourceFile, kind, visitor});
}

/**
 * Like {@link transformSourceFile}, but builds a type checker for the source so the visitor can
 * resolve types of nodes. The source is type-checked in isolation under a fixed file name, so only
 * the source text and the requested standard library declarations are available.
 *
 * @param fileOrSource - Either the TypeScript source text to inspect, or an object with the `source`
 *   text and the `additionalLibs` to load for the type checker.
 * @param kind - The {@link SyntaxKind} of the nodes to visit.
 * @param visitor - A callback that returns the edits to apply for a matching node, or nothing. It
 *   receives the node, its source file and the type checker.
 * @returns The collected edits, in no particular order.
 */
export function transformSourceFileWithTypeCheck<N extends Node>(
	fileOrSource: {source: string; additionalLibs: readonly string[]} | string,
	kind: N['kind'],
	visitor: TransformVisitorWithTypeChecker<N>
): Edit[] {
	const source = typeof fileOrSource === 'string' ? fileOrSource : fileOrSource.source;
	const additionalLibs = typeof fileOrSource === 'string' ? [] : fileOrSource.additionalLibs;
	const sourceFile = createSourceFileFromText(source);
	const typeChecker = createTypeChecker(sourceFile, additionalLibs);
	return transformSource({sourceFile, kind, visitor, typeChecker});
}

function transformSource<N extends Node>({sourceFile, kind, visitor, typeChecker}: TransformSourceConfig<N>): Edit[] {
	const edits: Edit[] = [];
	forEachChild(sourceFile, function visit(node) {
		if (node.kind === kind) {
			// eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- the kind check guarantees the node is of type N
			const typedNode = node as N;
			const nodeEdits = typeChecker ? visitor(typedNode, sourceFile, typeChecker) : visitor(typedNode, sourceFile);
			if (nodeEdits) {
				edits.push(...nodeEdits);
			}
		}
		node.forEachChild(visit);
	});
	return edits;
}

/**
 * Applies a list of edits to the source text, from the highest position to the lowest so that
 * earlier positions stay valid.
 *
 * @param source - The TypeScript source text to transform.
 * @param edits - The edits to apply.
 * @returns The transformed source text, unchanged if there are no edits.
 */
export function applyEdits(source: string, edits: readonly Edit[]): string {
	// apply edits from the end to avoid messing up with the indexes
	return [...edits]
		.sort((left, right) => right.start - left.start)
		.reduce((result, edit) => result.slice(0, edit.start) + edit.text + result.slice(edit.end), source);
}
