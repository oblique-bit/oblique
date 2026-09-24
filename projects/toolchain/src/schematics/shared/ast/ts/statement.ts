import {type Change, NoopChange, RemoveChange} from '@schematics/angular/utility/change';
import {type SourceFile, type Statement, isStatement} from 'typescript';
import {findFirstNode} from './walk';

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
	// Children-first traversal so the innermost matching statement is found before its
	// enclosing block (whose text also contains the match).
	return findFirstNode(sourceFile, (node): node is Statement => isStatement(node) && predicate(node), 'children-first');
}
