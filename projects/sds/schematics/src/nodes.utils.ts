import {Rule, SchematicContext, SchematicsException, chain, noop} from '@angular-devkit/schematics';
import {findNodes, getSourceNodes} from '@schematics/angular/utility/ast-utils';
import {Node, SourceFile, SyntaxKind} from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import {changeInsertLeft, changeInsertRight, replaceUpdate, showAlreadyExistsMessage} from './sds.utils';
import {InsertChange, ReplaceChange} from '@schematics/angular/utility/change';

export function checkPropertyLiteralExists(
	nodes: Node[],
	toFindConfig: {identifierName: string; propertyName: string; className: string}
): boolean {
	const syntaxList = findNodes(
		findIdentifierNode(nodes, toFindConfig.identifierName).parent,
		SyntaxKind.PropertyAssignment,
		undefined,
		true
	).filter(node => {
		const nodeText = node.getText().split(':')[0].trim();
		return nodeText === toFindConfig.propertyName || nodeText === toFindConfig.className;
	});
	return syntaxList.length > 0;
}

export function findIdentifierNode(nodes: Node[], identifierName: string): Node {
	const foundNode = nodes.find(node => node.kind === SyntaxKind.Identifier && node.getText() === identifierName);
	if (!foundNode?.parent) {
		throw new SchematicsException(`Error: Expected variable ${identifierName} not found in ${nodes.pop().parent.getText()}.`);
	}
	return foundNode;
}

export function addNodeToSyntaxList(
	sourceFile: SourceFile,
	identifierName: string,
	toAdd: {
		kind: SyntaxKind.ArrayLiteralExpression | SyntaxKind.ObjectLiteralExpression;
		text: string;
		insert?: 'ascending' | 'left' | 'right';
	}
): Rule {
	return (treeTree, context: SchematicContext) => {
		const nodes = getSourceNodes(sourceFile);
		if (findByTextAndKind(nodes, {kind: SyntaxKind.PropertyAssignment, text: toAdd.text})) {
			showAlreadyExistsMessage(context, {
				elementDescription: 'element',
				symbol: `${toAdd.text}`,
				existsIn: `in the list ${identifierName} within the file ${sourceFile.fileName}`
			});
			return chain([]);
		}
		const syntaxList = findSyntaxList(nodes, identifierName, toAdd.kind);
		const indexToAdd = syntaxList.getEnd();
		switch (toAdd.insert) {
			case 'left': {
				return changeInsertLeft(
					[new InsertChange(sourceFile.fileName, indexToAdd, getTextToAddWithComma(syntaxList, toAdd.text))],
					sourceFile.fileName
				);
			}
			case 'right': {
				return changeInsertRight(
					[new InsertChange(sourceFile.fileName, indexToAdd, getTextToAddWithComma(syntaxList, toAdd.text))],
					sourceFile.fileName
				);
			}
			case 'ascending': {
				if (syntaxList.getChildCount() === 0) {
					// if the syntax list empty
					return changeInsertLeft(
						[new InsertChange(sourceFile.fileName, indexToAdd, getTextToAddWithComma(syntaxList, toAdd.text))],
						sourceFile.fileName
					);
				}
				return replaceUpdate(
					[new ReplaceChange(sourceFile.fileName, indexToAdd, syntaxList.getText(), getSortedText(syntaxList, toAdd.kind, toAdd.text))],
					sourceFile.fileName,
					syntaxList.getFirstToken().getStart()
				);
			}
			default: {
				return noop();
			}
		}
	};
}

function getSortedText(syntaxList: Node, kind: SyntaxKind, toAddText: string): string {
	const listText = syntaxList
		.getChildren()
		.filter(node => node.kind !== SyntaxKind.CommaToken)
		.map(node => node.getText());
	listText.push(toAddText);
	return listText
		.sort((textA, textB) => {
			const upperCaseA = textA.toUpperCase().replace("'", '');
			const toUpperCaseB = textB.toUpperCase().replace("'", '');
			if (upperCaseA < toUpperCaseB) {
				return -1;
			}
			if (upperCaseA > toUpperCaseB) {
				return 1;
			}
			return 0;
		})
		.join(',\n\t\t');
}

function findSyntaxList(
	nodes: Node[],
	identifierName: string,
	kind: SyntaxKind.ArrayLiteralExpression | SyntaxKind.ObjectLiteralExpression
): Node {
	const identifier: Node = findByTextAndKind(nodes, {kind: SyntaxKind.Identifier, text: identifierName});
	const siblings = identifier.parent.getChildren().filter(node => node.getText() !== identifier.getText());
	const toAddNode = siblings.find(node => node.kind === kind);
	return findNodeBySyntaxKind(toAddNode, SyntaxKind.SyntaxList);
}

function getTextToAddWithComma(syntaxList: Node, textToAdd: string): string {
	const lastSign = syntaxList.getText().at(-1);
	const hasComma = lastSign === ',' || textToAdd.at(0) === ',';
	return hasComma || lastSign === undefined ? `\n\t\t${textToAdd},\n` : `,\n\t\t${textToAdd},\n`;
}

function findByTextAndKind(nodes: Node[], toFind: {kind: SyntaxKind; text: string}, childIndex = 0): Node {
	return nodes.find(node => {
		if (node.kind === toFind.kind && node.getText().includes(toFind.text)) {
			return node;
		}
		if (node.getText() && node.getChildAt(childIndex)?.getChildCount() > 0) {
			findByTextAndKind(node.getChildAt(childIndex).getChildren(), toFind, childIndex++);
		}
		return false;
	});
}

function findNodeBySyntaxKind(nodes: Node, kind: SyntaxKind, errorMessage?: string): Node {
	const foundNode: Node = nodes.getChildren().find(node => node.kind === kind);
	if (!foundNode) {
		if (errorMessage) {
			throw new SchematicsException(errorMessage);
		} else {
			throw new SchematicsException(
				`Error: The node ${nodes.getChildAt(0).parent.getText()} doesn't contain an element of type ${SyntaxKind[kind]}`
			);
		}
	}
	return foundNode;
}
