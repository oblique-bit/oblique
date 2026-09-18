import type {Node, SourceFile, TypeChecker} from 'typescript';

/**
 * A single textual edit to apply to a TypeScript source text, identified by a character range.
 * `start` is included in the range, while `end` is excluded. An insertion is expressed by `end`
 * equal to `start`.
 */
export interface Edit {
	start: number;
	end: number;
	text: string;
}

/**
 * A visitor invoked for every matching node during a transform. It receives the node and its source
 * file, without a type checker.
 */
export type TransformVisitor<N extends Node> = (node: N, sourceFile: SourceFile) => readonly Edit[] | undefined;

/**
 * A visitor invoked for every matching node during a transform that resolves types. It receives the
 * node, its source file and the type checker.
 */
export type TransformVisitorWithTypeChecker<N extends Node> = (
	node: N,
	sourceFile: SourceFile,
	typeChecker: TypeChecker
) => readonly Edit[] | undefined;

/**
 * The configuration of a transform. Either no type checker is provided (and the visitor signature
 * lacks it), or a type checker is provided (and the visitor signature includes it).
 */
export type TransformSourceConfig<N extends Node> = {
	sourceFile: SourceFile;
	kind: N['kind'];
} & (
	| {typeChecker?: never; visitor: TransformVisitor<N>}
	| {typeChecker: TypeChecker; visitor: TransformVisitorWithTypeChecker<N>}
);
