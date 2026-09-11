import type {Tree} from '@angular-devkit/schematics';
import {
	type Change,
	InsertChange,
	NoopChange,
	RemoveChange,
	applyToUpdateRecorder,
} from '@schematics/angular/utility/change';
import {
	type ClassDeclaration,
	type CompilerOptions,
	type Node,
	ScriptTarget,
	type SourceFile,
	type Statement,
	type TypeChecker,
	createCompilerHost,
	createProgram,
	createSourceFile,
	forEachChild,
	isClassDeclaration,
	isPropertyDeclaration,
	isStatement,
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

/**
 * Creates a TypeScript {@link SourceFile} from a file in the tree.
 *
 * @param tree - The schematics tree containing the file.
 * @param filePath - The path to the TypeScript file.
 * @returns The parsed {@link SourceFile}.
 */
export function createSrcFile(tree: Tree, filePath: string): SourceFile {
	return createSourceFile(filePath, tree.readText(filePath), ScriptTarget.Latest, true);
}

/**
 * Applies a list of {@link Change} records to a file in the tree.
 *
 * @param tree - The schematics tree to modify.
 * @param filePath - The path to the file to update.
 * @param changes - The changes to apply.
 * @returns The modified tree.
 */
export function applyChanges(tree: Tree, filePath: string, changes: Change[]): Tree {
	const records = tree.beginUpdate(filePath);
	applyToUpdateRecorder(records, changes);
	tree.commitUpdate(records);
	return tree;
}

/**
 * Finds the first class declaration with the given name in a source file.
 *
 * @param sourceFile - The source file to search.
 * @param className - The name of the class to find.
 * @returns The matching {@link ClassDeclaration}, or `undefined` if not found.
 */
export function findClassDeclaration(sourceFile: SourceFile, className: string): ClassDeclaration | undefined {
	const visit = (node: Node): ClassDeclaration | undefined => {
		if (isClassDeclaration(node) && node.name?.text === className) {
			return node;
		}
		for (const child of node.getChildren(sourceFile)) {
			const found = visit(child);
			if (found) {
				return found;
			}
		}
		return undefined;
	};
	return visit(sourceFile);
}

/**
 * Removes a property (e.g. a signal) from a class declaration.
 *
 * @param sourceFile - The source file containing the class.
 * @param className - The name of the class.
 * @param propertyName - The name of the property to remove.
 * @returns A {@link RemoveChange} that removes the property, or a {@link NoopChange} if it is not found.
 */
export function removeClassProperty(sourceFile: SourceFile, className: string, propertyName: string): Change {
	const classDeclaration = findClassDeclaration(sourceFile, className);
	if (!classDeclaration) {
		return new NoopChange();
	}
	const property = classDeclaration.members.find(
		member => isPropertyDeclaration(member) && member.name.getText(sourceFile) === propertyName
	);
	if (!property) {
		return new NoopChange();
	}
	return new RemoveChange(sourceFile.fileName, property.getStart(sourceFile), property.getText(sourceFile));
}

/**
 * Inserts a property into a class declaration.
 *
 * The property is inserted after the class opening brace, before any existing
 * members.
 *
 * @param sourceFile - The source file containing the class.
 * @param className - The name of the class.
 * @param propertyText - The text of the property to insert (without trailing newline).
 * @returns An {@link InsertChange} that inserts the property, or a {@link NoopChange} if the class is not found.
 */
export function insertClassProperty(sourceFile: SourceFile, className: string, propertyText: string): Change {
	const classDeclaration = findClassDeclaration(sourceFile, className);
	if (!classDeclaration) {
		return new NoopChange();
	}
	const firstMember = classDeclaration.members[0];
	const insertPos = firstMember ? firstMember.getStart(sourceFile) : classDeclaration.members.pos + 1;
	const indentation = firstMember ? getLineIndentation(sourceFile, firstMember.getStart(sourceFile)) : '\t';
	return new InsertChange(sourceFile.fileName, insertPos, `${indentation}${propertyText}\n`);
}

/**
 * Removes the first statement matching the given predicate from a source file.
 *
 * The search descends into nested blocks (e.g. a `describe` block), so a
 * predicate matching a nested statement (such as an `it` test) removes only
 * that statement and leaves its enclosing block intact.
 *
 * @param sourceFile - The source file to modify.
 * @param filePath - The path to the file (used for the returned change).
 * @param predicate - A predicate that identifies the statement to remove.
 * @returns A {@link RemoveChange} that removes the statement, or a {@link NoopChange} if none matches.
 */
export function removeStatement(
	sourceFile: SourceFile,
	filePath: string,
	predicate: (statement: Statement) => boolean
): Change {
	const statement = findStatement(sourceFile, predicate);
	if (!statement) {
		return new NoopChange();
	}
	return new RemoveChange(filePath, statement.getStart(sourceFile), statement.getText(sourceFile));
}

function findStatement(sourceFile: SourceFile, predicate: (statement: Statement) => boolean): Statement | undefined {
	// Depth-first, children-first traversal so the innermost matching statement
	// is found before its enclosing block (whose text also contains the match).
	const visit = (node: Node): Statement | undefined => {
		for (const child of node.getChildren(sourceFile)) {
			const found = visit(child);
			if (found) {
				return found;
			}
		}
		if (isStatement(node) && predicate(node)) {
			return node;
		}
		return undefined;
	};
	return visit(sourceFile);
}

function getLineIndentation(sourceFile: SourceFile, position: number): string {
	const lineStart = sourceFile.getLineAndCharacterOfPosition(position).character;
	const line = sourceFile.text.slice(position - lineStart, position);
	const firstNonWhitespace = line.search(/[^\t ]/u);
	return firstNonWhitespace === -1 ? line : line.slice(0, firstNonWhitespace);
}
