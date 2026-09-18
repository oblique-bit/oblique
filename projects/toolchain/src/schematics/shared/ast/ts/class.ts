import {type Change, InsertChange, NoopChange, RemoveChange} from '@schematics/angular/utility/change';
import {type ClassDeclaration, type SourceFile, isClassDeclaration, isPropertyDeclaration} from 'typescript';
import {findFirstNode} from './walk';

/**
 * Finds the first class declaration with the given name in a source file.
 *
 * @param sourceFile - The source file to search.
 * @param className - The name of the class to find.
 * @returns The matching {@link ClassDeclaration}, or `undefined` if not found.
 */
export function findClassDeclaration(sourceFile: SourceFile, className: string): ClassDeclaration | undefined {
	return findFirstNode(
		sourceFile,
		(node): node is ClassDeclaration => isClassDeclaration(node) && node.name?.text === className
	);
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

function getLineIndentation(sourceFile: SourceFile, position: number): string {
	const lineStart = sourceFile.getLineAndCharacterOfPosition(position).character;
	const line = sourceFile.text.slice(position - lineStart, position);
	const firstNonWhitespace = line.search(/[^\t ]/u);
	return firstNonWhitespace === -1 ? line : line.slice(0, firstNonWhitespace);
}
