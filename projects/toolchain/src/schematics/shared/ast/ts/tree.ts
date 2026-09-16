import type {Tree} from '@angular-devkit/schematics';
import {type Change, applyToUpdateRecorder} from '@schematics/angular/utility/change';
import {ScriptTarget, type SourceFile, createSourceFile} from 'typescript';

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
