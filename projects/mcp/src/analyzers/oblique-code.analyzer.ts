/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 5 read-only TypeScript public API analysis
 */

import * as typescript from 'typescript';
import type {ObliqueApiSymbol} from '../sources/oblique/public-api.reader.js';

const obliquePackageImport = '@oblique/oblique';
const publicStylesheetPathPrefix = 'styles/css/';
const severityOrder: Record<ObliqueCodeFindingSeverity, number> = {error: 0, warning: 1, info: 2};

export type ObliqueCodeFindingRule =
	| 'OBLIQUE_DEFAULT_IMPORT'
	| 'OBLIQUE_DEPRECATED_PUBLIC_SYMBOL'
	| 'OBLIQUE_INTERNAL_IMPORT'
	| 'OBLIQUE_UNKNOWN_PUBLIC_SYMBOL'
	| 'TYPESCRIPT_SYNTAX_ERROR';

export type ObliqueCodeFindingSeverity = 'error' | 'warning' | 'info';

export interface ObliqueCodeFinding {
	rule: ObliqueCodeFindingRule;
	severity: ObliqueCodeFindingSeverity;
	message: string;
	symbol?: string;
	module?: string;
	location: ObliqueCodeLocation;
	recommendation: string;
}

export interface ObliqueCodeLocation {
	line: number;
	column: number;
}

export interface ObliqueCodeSummary {
	errors: number;
	warnings: number;
	info: number;
}

export interface ObliqueCodeAnalysis {
	valid: boolean;
	summary: ObliqueCodeSummary;
	findings: ObliqueCodeFinding[];
}

export interface ObliqueCodePublicApiReader {
	getApi: (symbol: string) => ObliqueApiSymbol | undefined;
}

export type ObliqueSyntaxDiagnosticsReader = (
	code: string,
	fileName: string
) => readonly typescript.Diagnostic[] | undefined;

interface PositionedFinding extends ObliqueCodeFinding {
	position: number;
}

/**
 * Parses submitted TypeScript text without resolving or executing its imports.
 */
export class ObliqueCodeAnalyzer {
	private readonly publicApiReader: ObliqueCodePublicApiReader;
	private readonly syntaxDiagnosticsReader: ObliqueSyntaxDiagnosticsReader;

	constructor(
		publicApiReader: ObliqueCodePublicApiReader,
		syntaxDiagnosticsReader: ObliqueSyntaxDiagnosticsReader = getSyntaxDiagnostics
	) {
		this.publicApiReader = publicApiReader;
		this.syntaxDiagnosticsReader = syntaxDiagnosticsReader;
	}

	analyze(code: string): ObliqueCodeAnalysis {
		const sourceFile = typescript.createSourceFile(
			'submitted.ts',
			code,
			typescript.ScriptTarget.Latest,
			true,
			typescript.ScriptKind.TS
		);
		const syntaxFindings = getSyntaxFindings(sourceFile, this.syntaxDiagnosticsReader(code, sourceFile.fileName));
		const findings =
			syntaxFindings.length === 0 ? getObliqueFindings(sourceFile, this.publicApiReader) : syntaxFindings;
		const sortedFindings = findings.sort(compareFindings);
		const summary = getSummary(sortedFindings);

		return {
			valid: summary.errors === 0,
			summary,
			findings: sortedFindings.map(toObliqueCodeFinding),
		};
	}
}

function getSyntaxDiagnostics(code: string, fileName: string): readonly typescript.Diagnostic[] | undefined {
	return typescript.transpileModule(code, {
		compilerOptions: {target: typescript.ScriptTarget.Latest},
		fileName,
		reportDiagnostics: true,
	}).diagnostics;
}

function getSyntaxFindings(
	sourceFile: typescript.SourceFile,
	diagnostics: readonly typescript.Diagnostic[] | undefined
): PositionedFinding[] {
	if (diagnostics === undefined) {
		return [];
	}
	const diagnosticKeys = new Set<string>();
	return diagnostics.flatMap(diagnostic => {
		const diagnosticKey = getDiagnosticKey(diagnostic);
		if (diagnosticKeys.has(diagnosticKey)) {
			return [];
		}
		diagnosticKeys.add(diagnosticKey);
		const position = diagnostic.start ?? 0;
		return [
			createFinding(sourceFile, position, {
				rule: 'TYPESCRIPT_SYNTAX_ERROR',
				severity: 'error',
				message: typescript.flattenDiagnosticMessageText(diagnostic.messageText, ' '),
				recommendation: 'Correct the TypeScript syntax before checking Oblique API usage.',
			}),
		];
	});
}

function getDiagnosticKey(diagnostic: typescript.Diagnostic): string {
	return [
		diagnostic.code,
		diagnostic.start ?? 0,
		diagnostic.length ?? 0,
		typescript.flattenDiagnosticMessageText(diagnostic.messageText, ' '),
	].join('\u0000');
}

function getObliqueFindings(
	sourceFile: typescript.SourceFile,
	publicApiReader: ObliqueCodePublicApiReader
): PositionedFinding[] {
	const findings: PositionedFinding[] = [];
	const namespaceImports = new Set<string>();

	for (const statement of sourceFile.statements) {
		if (typescript.isImportDeclaration(statement)) {
			analyzeImportDeclaration(sourceFile, statement, publicApiReader, namespaceImports, findings);
		}
		if (typescript.isExportDeclaration(statement)) {
			analyzeExportDeclaration(sourceFile, statement, publicApiReader, findings);
		}
	}

	collectNamespaceFindings(sourceFile, publicApiReader, namespaceImports, findings);
	return findings;
}

function analyzeImportDeclaration(
	sourceFile: typescript.SourceFile,
	declaration: typescript.ImportDeclaration,
	publicApiReader: ObliqueCodePublicApiReader,
	namespaceImports: Set<string>,
	findings: PositionedFinding[]
): void {
	const moduleSpecifier = getModuleSpecifier(declaration);
	if (isUnsupportedObliqueSubpath(moduleSpecifier)) {
		findings.push(createInternalImportFinding(sourceFile, declaration.moduleSpecifier, moduleSpecifier));
		return;
	}
	if (moduleSpecifier !== obliquePackageImport) {
		return;
	}

	const importClause = declaration.importClause;
	if (importClause?.name !== undefined && publicApiReader.getApi('default') === undefined) {
		findings.push(createDefaultImportFinding(sourceFile, importClause.name));
	}
	if (importClause?.namedBindings !== undefined) {
		if (typescript.isNamedImports(importClause.namedBindings)) {
			for (const element of importClause.namedBindings.elements) {
				findings.push(...getPublicSymbolFindings(sourceFile, element, publicApiReader));
			}
		} else {
			namespaceImports.add(importClause.namedBindings.name.text);
		}
	}
}

function analyzeExportDeclaration(
	sourceFile: typescript.SourceFile,
	declaration: typescript.ExportDeclaration,
	publicApiReader: ObliqueCodePublicApiReader,
	findings: PositionedFinding[]
): void {
	const moduleSpecifierNode = declaration.moduleSpecifier;
	if (moduleSpecifierNode === undefined || !typescript.isStringLiteral(moduleSpecifierNode)) {
		return;
	}
	const moduleSpecifier = moduleSpecifierNode.text;
	if (isUnsupportedObliqueSubpath(moduleSpecifier)) {
		findings.push(createInternalImportFinding(sourceFile, moduleSpecifierNode, moduleSpecifier));
		return;
	}
	const exportClause = declaration.exportClause;
	if (
		moduleSpecifier !== obliquePackageImport ||
		exportClause === undefined ||
		!typescript.isNamedExports(exportClause)
	) {
		return;
	}
	for (const element of exportClause.elements) {
		findings.push(...getPublicSymbolFindings(sourceFile, element, publicApiReader));
	}
}

function getModuleSpecifier(declaration: typescript.ImportDeclaration): string {
	/* istanbul ignore next -- TypeScript ImportDeclarations always use string literal module specifiers. */
	if (!typescript.isStringLiteral(declaration.moduleSpecifier)) {
		return '';
	}
	return declaration.moduleSpecifier.text;
}

function isUnsupportedObliqueSubpath(moduleSpecifier: string): boolean {
	return isObliqueSubpath(moduleSpecifier) && !isPublishedObliqueStylesheet(moduleSpecifier);
}

function isObliqueSubpath(moduleSpecifier: string): boolean {
	return moduleSpecifier.startsWith(`${obliquePackageImport}/`);
}

function isPublishedObliqueStylesheet(moduleSpecifier: string): boolean {
	const stylesheetPath = moduleSpecifier.slice(obliquePackageImport.length + 1);
	const stylesheetFileName = stylesheetPath.slice(publicStylesheetPathPrefix.length);
	return (
		stylesheetPath.startsWith(publicStylesheetPathPrefix) &&
		stylesheetFileName.endsWith('.css') &&
		!stylesheetFileName.includes('/') &&
		!stylesheetFileName.includes('\\')
	);
}

function getPublicSymbolFindings(
	sourceFile: typescript.SourceFile,
	element: typescript.ImportSpecifier | typescript.ExportSpecifier,
	publicApiReader: ObliqueCodePublicApiReader
): PositionedFinding[] {
	const exportedName = element.propertyName ?? element.name;
	return getSymbolFindings(sourceFile, exportedName, publicApiReader);
}

function collectNamespaceFindings(
	sourceFile: typescript.SourceFile,
	publicApiReader: ObliqueCodePublicApiReader,
	namespaceImports: ReadonlySet<string>,
	findings: PositionedFinding[]
): void {
	const visit = (node: typescript.Node, shadowedNamespaces: ReadonlySet<string>): void => {
		if (isNamespacePropertyAccess(node, namespaceImports, shadowedNamespaces)) {
			findings.push(...getSymbolFindings(sourceFile, node.name, publicApiReader));
		}
		if (isNamespaceQualifiedName(node, namespaceImports, shadowedNamespaces)) {
			findings.push(...getSymbolFindings(sourceFile, node.right, publicApiReader));
		}
		if (isNamespaceStringElementAccess(node, namespaceImports, shadowedNamespaces)) {
			findings.push(...getSymbolFindings(sourceFile, node.argumentExpression, publicApiReader));
		}
		const childShadowedNamespaces = getChildShadowedNamespaces(node, shadowedNamespaces, namespaceImports);
		typescript.forEachChild(node, child => visit(child, childShadowedNamespaces));
	};
	typescript.forEachChild(sourceFile, child => visit(child, new Set<string>()));
}

function isNamespacePropertyAccess(
	node: typescript.Node,
	namespaceImports: ReadonlySet<string>,
	shadowedNamespaces: ReadonlySet<string>
): node is typescript.PropertyAccessExpression & {name: typescript.Identifier} {
	return (
		typescript.isPropertyAccessExpression(node) &&
		typescript.isIdentifier(node.expression) &&
		typescript.isIdentifier(node.name) &&
		namespaceImports.has(node.expression.text) &&
		!shadowedNamespaces.has(node.expression.text)
	);
}

function isNamespaceQualifiedName(
	node: typescript.Node,
	namespaceImports: ReadonlySet<string>,
	shadowedNamespaces: ReadonlySet<string>
): node is typescript.QualifiedName {
	return (
		typescript.isQualifiedName(node) &&
		typescript.isIdentifier(node.left) &&
		namespaceImports.has(node.left.text) &&
		!shadowedNamespaces.has(node.left.text)
	);
}

function isNamespaceStringElementAccess(
	node: typescript.Node,
	namespaceImports: ReadonlySet<string>,
	shadowedNamespaces: ReadonlySet<string>
): node is typescript.ElementAccessExpression & {argumentExpression: typescript.StringLiteral} {
	return (
		typescript.isElementAccessExpression(node) &&
		typescript.isIdentifier(node.expression) &&
		typescript.isStringLiteral(node.argumentExpression) &&
		namespaceImports.has(node.expression.text) &&
		!shadowedNamespaces.has(node.expression.text)
	);
}

function getChildShadowedNamespaces(
	node: typescript.Node,
	shadowedNamespaces: ReadonlySet<string>,
	namespaceImports: ReadonlySet<string>
): ReadonlySet<string> {
	const boundNames = getBoundNamesInScope(node);
	const newShadowedNamespaces = [...boundNames].filter(name => namespaceImports.has(name));
	return newShadowedNamespaces.length === 0
		? shadowedNamespaces
		: new Set([...shadowedNamespaces, ...newShadowedNamespaces]);
}

function getBoundNamesInScope(node: typescript.Node): Set<string> {
	if (typescript.isBlock(node)) {
		return new Set(node.statements.flatMap(getStatementBoundNames));
	}
	if (typescript.isFunctionLike(node)) {
		return new Set(node.parameters.flatMap(parameter => getBindingNames(parameter.name)));
	}
	if (typescript.isCatchClause(node) && node.variableDeclaration !== undefined) {
		return new Set(getBindingNames(node.variableDeclaration.name));
	}
	if (typescript.isForStatement(node)) {
		return getVariableDeclarationListBoundNames(node.initializer);
	}
	if (typescript.isForInStatement(node) || typescript.isForOfStatement(node)) {
		return getVariableDeclarationListBoundNames(node.initializer);
	}
	return new Set<string>();
}

function getVariableDeclarationListBoundNames(initializer: typescript.ForInitializer | undefined): Set<string> {
	if (initializer === undefined || !typescript.isVariableDeclarationList(initializer)) {
		return new Set<string>();
	}
	return new Set(initializer.declarations.flatMap(declaration => getBindingNames(declaration.name)));
}

function getStatementBoundNames(statement: typescript.Statement): string[] {
	if (typescript.isVariableStatement(statement)) {
		return statement.declarationList.declarations.flatMap(declaration => getBindingNames(declaration.name));
	}
	if (
		(typescript.isFunctionDeclaration(statement) ||
			typescript.isClassDeclaration(statement) ||
			typescript.isEnumDeclaration(statement)) &&
		statement.name !== undefined
	) {
		return [statement.name.text];
	}
	return [];
}

function getBindingNames(bindingName: typescript.BindingName): string[] {
	if (typescript.isIdentifier(bindingName)) {
		return [bindingName.text];
	}
	return bindingName.elements.flatMap(element =>
		typescript.isBindingElement(element) ? getBindingNames(element.name) : []
	);
}

function getSymbolFindings(
	sourceFile: typescript.SourceFile,
	symbolNode: typescript.ModuleExportName,
	publicApiReader: ObliqueCodePublicApiReader
): PositionedFinding[] {
	const symbol = symbolNode.text;
	const publicApi = publicApiReader.getApi(symbol);
	if (publicApi === undefined) {
		return [createUnknownPublicSymbolFinding(sourceFile, symbolNode, symbol)];
	}
	return publicApi.deprecated ? [createDeprecatedPublicSymbolFinding(sourceFile, symbolNode, publicApi)] : [];
}

function createUnknownPublicSymbolFinding(
	sourceFile: typescript.SourceFile,
	node: typescript.ModuleExportName,
	symbol: string
): PositionedFinding {
	return createFinding(sourceFile, node.getStart(sourceFile), {
		rule: 'OBLIQUE_UNKNOWN_PUBLIC_SYMBOL',
		severity: 'error',
		message: `"${symbol}" is not a public export of @oblique/oblique in the checked-out Oblique version.`,
		symbol,
		module: obliquePackageImport,
		recommendation: 'Import only symbols exported from "@oblique/oblique".',
	});
}

function createDeprecatedPublicSymbolFinding(
	sourceFile: typescript.SourceFile,
	node: typescript.ModuleExportName,
	publicApi: ObliqueApiSymbol
): PositionedFinding {
	const documentation = publicApi.documentation === null ? '' : ` ${publicApi.documentation}`;
	return createFinding(sourceFile, node.getStart(sourceFile), {
		rule: 'OBLIQUE_DEPRECATED_PUBLIC_SYMBOL',
		severity: 'warning',
		message: `"${publicApi.symbol}" is deprecated in @oblique/oblique.${documentation}`,
		symbol: publicApi.symbol,
		module: obliquePackageImport,
		recommendation: `Review the deprecation documentation before replacing "${publicApi.symbol}".`,
	});
}

function createDefaultImportFinding(sourceFile: typescript.SourceFile, node: typescript.Identifier): PositionedFinding {
	return createFinding(sourceFile, node.getStart(sourceFile), {
		rule: 'OBLIQUE_DEFAULT_IMPORT',
		severity: 'error',
		message: '@oblique/oblique does not provide a public default export.',
		module: obliquePackageImport,
		recommendation: 'Use named imports from "@oblique/oblique".',
	});
}

function createInternalImportFinding(
	sourceFile: typescript.SourceFile,
	node: typescript.Expression,
	moduleSpecifier: string
): PositionedFinding {
	return createFinding(sourceFile, node.getStart(sourceFile), {
		rule: 'OBLIQUE_INTERNAL_IMPORT',
		severity: 'error',
		message: `"${moduleSpecifier}" bypasses the supported @oblique/oblique TypeScript public API.`,
		module: moduleSpecifier,
		recommendation: 'Import public symbols from "@oblique/oblique".',
	});
}

function createFinding(
	sourceFile: typescript.SourceFile,
	position: number,
	finding: Omit<ObliqueCodeFinding, 'location'>
): PositionedFinding {
	const lineAndCharacter = sourceFile.getLineAndCharacterOfPosition(position);
	return {
		...finding,
		location: {line: lineAndCharacter.line + 1, column: lineAndCharacter.character + 1},
		position,
	};
}

function toObliqueCodeFinding(finding: PositionedFinding): ObliqueCodeFinding {
	return {
		rule: finding.rule,
		severity: finding.severity,
		message: finding.message,
		symbol: finding.symbol,
		module: finding.module,
		location: finding.location,
		recommendation: finding.recommendation,
	};
}

function compareFindings(first: PositionedFinding, second: PositionedFinding): number {
	return getFindingSortKey(first).localeCompare(getFindingSortKey(second), 'en');
}

function getFindingSortKey(finding: PositionedFinding): string {
	return `${finding.position.toString().padStart(12, '0')}\u0000${severityOrder[finding.severity]}\u0000${finding.rule}`;
}

function getSummary(findings: readonly PositionedFinding[]): ObliqueCodeSummary {
	return {
		errors: findings.filter(finding => finding.severity === 'error').length,
		warnings: findings.filter(finding => finding.severity === 'warning').length,
		info: findings.filter(finding => finding.severity === 'info').length,
	};
}
