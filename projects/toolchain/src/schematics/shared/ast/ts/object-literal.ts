import {type Change, InsertChange, NoopChange} from '@schematics/angular/utility/change';
import {
	type ArrayLiteralExpression,
	type CallExpression,
	type ObjectLiteralExpression,
	type PropertyAssignment,
	type SourceFile,
	isArrayLiteralExpression,
	isCallExpression,
	isPropertyAssignment,
} from 'typescript';
import {findFirstNode} from './walk';

/**
 * Finds the first call expression with the given text in a source file.
 *
 * The search descends into nested nodes (e.g. a `describe` block), so a call
 * nested inside other statements is found as well.
 *
 * @param sourceFile - The source file to search.
 * @param expressionText - The text of the call expression to find (e.g. `TestBed.configureTestingModule`).
 * @returns The matching {@link CallExpression}, or `undefined` if not found.
 */
export function findCallExpression(sourceFile: SourceFile, expressionText: string): CallExpression | undefined {
	return findFirstNode(
		sourceFile,
		(node): node is CallExpression => isCallExpression(node) && node.expression.getText(sourceFile) === expressionText
	);
}

/**
 * Inserts a value into an array property of an object literal, leniently.
 *
 * - If the property exists and is an array, the value is appended after the last element (or
 *   becomes the only element of an empty array).
 * - If the property is missing, it is created as a single-element array after the last existing
 *   property.
 * - If the property exists but is not an array, nothing is changed.
 *
 * @param sourceFile - The source file containing the object literal.
 * @param objectLiteral - The object literal to modify.
 * @param insertion - The property name and the text of the value to insert.
 * @returns An {@link InsertChange} that inserts the value, or a {@link NoopChange} if the property
 *   exists but is not an array.
 */
export function insertIntoObjectLiteralArray(
	sourceFile: SourceFile,
	objectLiteral: ObjectLiteralExpression,
	insertion: {propertyName: string; value: string}
): Change {
	const {propertyName, value} = insertion;
	const property = objectLiteral.properties.find(
		(prop): prop is PropertyAssignment => isPropertyAssignment(prop) && prop.name.getText(sourceFile) === propertyName
	);
	if (!property) {
		return insertNewArrayProperty(sourceFile, objectLiteral, insertion);
	}
	if (!isArrayLiteralExpression(property.initializer)) {
		return new NoopChange();
	}
	return insertIntoArrayProperty(sourceFile, property.initializer, value);
}

function insertIntoArrayProperty(sourceFile: SourceFile, array: ArrayLiteralExpression, value: string): Change {
	if (array.elements.length === 0) {
		return new InsertChange(sourceFile.fileName, array.getStart(sourceFile) + 1, value);
	}
	const lastElement = array.elements[array.elements.length - 1];
	return new InsertChange(sourceFile.fileName, lastElement.getEnd(), `, ${value}`);
}

function insertNewArrayProperty(
	sourceFile: SourceFile,
	objectLiteral: ObjectLiteralExpression,
	insertion: {propertyName: string; value: string}
): Change {
	const {propertyName, value} = insertion;
	const lastProperty = objectLiteral.properties[objectLiteral.properties.length - 1];
	const insertPos = lastProperty ? lastProperty.getEnd() : objectLiteral.getStart() + 1;
	const separator = objectLiteral.properties.length > 0 ? ',' : '';
	return new InsertChange(sourceFile.fileName, insertPos, `${separator}\n\t\t${propertyName}: [${value}]`);
}
