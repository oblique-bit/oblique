/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 3 public API discovery and indexing
 */

import {relative, resolve} from 'node:path';
import * as typescript from 'typescript';

const publicApiRelativePath = 'projects/oblique/src/public_api.ts';
const obliquePackageImport = '@oblique/oblique';
const angularCoreModuleSpecifier = '@angular/core';
const angularRouterModuleSpecifier = '@angular/router';
const angularClassKinds = new Map<
	string,
	Extract<ObliqueApiSymbolKind, 'component' | 'directive' | 'service' | 'module' | 'pipe'>
>([
	['Component', 'component'],
	['Directive', 'directive'],
	['Injectable', 'service'],
	['NgModule', 'module'],
	['Pipe', 'pipe'],
]);
const angularRouterGuardTypeNames = new Set([
	'CanActivate',
	'CanActivateChild',
	'CanDeactivate',
	'CanLoad',
	'CanMatch',
]);

export type ObliqueApiSymbolKind =
	| 'class'
	| 'interface'
	| 'type'
	| 'enum'
	| 'function'
	| 'const'
	| 'directive'
	| 'component'
	| 'service'
	| 'module'
	| 'pipe'
	| 'guard'
	| 'other';

export interface ObliqueApiSymbol {
	symbol: string;
	kind: ObliqueApiSymbolKind;
	public: true;
	packageImport: typeof obliquePackageImport;
	exportedFrom: string;
	declaredIn: string;
	signature: string;
	documentation: string | null;
	deprecated: boolean;
}

export interface ObliqueAngularTemplateApi {
	symbol: string;
	kind: Extract<ObliqueApiSymbolKind, 'component' | 'directive'>;
	selector: string;
	deprecated: boolean;
	documentation: string | null;
	declaredIn: string;
	public: true;
}

export type PublicApiProgramFactory = (publicApiPath: string) => typescript.Program;

export function isTypeScriptIdentifier(symbol: string): boolean {
	const scanner = typescript.createScanner(
		typescript.ScriptTarget.Latest,
		false,
		typescript.LanguageVariant.Standard,
		symbol
	);
	return scanner.scan() === typescript.SyntaxKind.Identifier && scanner.scan() === typescript.SyntaxKind.EndOfFileToken;
}

/**
 * Builds a read-only index of the symbols reachable from Oblique's public API entry point.
 */
export class ObliquePublicApiReader {
	private readonly repositoryRoot: string;
	private readonly programFactory: PublicApiProgramFactory;
	private index: PublicApiIndex | undefined;

	constructor(repositoryRoot = process.cwd(), programFactory: PublicApiProgramFactory = createPublicApiProgram) {
		this.repositoryRoot = repositoryRoot;
		this.programFactory = programFactory;
	}

	getApi(symbol: string): ObliqueApiSymbol | undefined {
		return this.getIndex().symbols.get(symbol);
	}

	/** Gets statically-known selectors belonging to public Oblique components and directives only. */
	getAngularTemplateApis(): readonly ObliqueAngularTemplateApi[] {
		return this.getIndex().angularTemplateApis;
	}

	private getIndex(): PublicApiIndex {
		this.index ??= this.createIndex();
		return this.index;
	}

	private createIndex(): PublicApiIndex {
		const publicApiPath = resolve(this.repositoryRoot, publicApiRelativePath);
		const program = this.programFactory(publicApiPath);
		const publicApiSourceFile = program.getSourceFile(publicApiPath);
		if (publicApiSourceFile === undefined) {
			throw new Error(`Unable to read the Oblique public API entry point at "${publicApiPath}".`);
		}
		const typeChecker = program.getTypeChecker();
		const moduleSymbol = typeChecker.getSymbolAtLocation(publicApiSourceFile);
		if (moduleSymbol === undefined) {
			throw new Error(`Unable to resolve exports from the Oblique public API entry point at "${publicApiPath}".`);
		}
		return createApiIndex({typeChecker, repositoryRoot: this.repositoryRoot, publicApiPath}, moduleSymbol);
	}
}

interface ApiIndexContext {
	typeChecker: typescript.TypeChecker;
	repositoryRoot: string;
	publicApiPath: string;
}

interface PublicApiIndex {
	symbols: ReadonlyMap<string, ObliqueApiSymbol>;
	angularTemplateApis: readonly ObliqueAngularTemplateApi[];
}

function createApiIndex(context: ApiIndexContext, moduleSymbol: typescript.Symbol): PublicApiIndex {
	const angularTemplateApis: ObliqueAngularTemplateApi[] = [];
	const symbols = context.typeChecker
		.getExportsOfModule(moduleSymbol)
		.sort(compareSymbols)
		.flatMap(exportedSymbol => {
			const symbol = resolveAliasedSymbol(context.typeChecker, exportedSymbol);
			const apiSymbol = createApiSymbol(context, exportedSymbol, symbol);
			if (apiSymbol === undefined) {
				return [];
			}
			const declaration = getDeclaration(symbol);
			const angularTemplateApi =
				declaration !== undefined && typescript.isClassDeclaration(declaration)
					? createAngularTemplateApi(context, apiSymbol, declaration)
					: undefined;
			if (angularTemplateApi !== undefined) {
				angularTemplateApis.push(angularTemplateApi);
			}
			return [[exportedSymbol.getName(), apiSymbol] as const];
		});
	return {
		symbols: new Map(symbols),
		angularTemplateApis: angularTemplateApis.sort(compareAngularTemplateApis),
	};
}

function compareAngularTemplateApis(first: ObliqueAngularTemplateApi, second: ObliqueAngularTemplateApi): number {
	return first.selector.localeCompare(second.selector, 'en') || first.symbol.localeCompare(second.symbol, 'en');
}

function createPublicApiProgram(publicApiPath: string): typescript.Program {
	return typescript.createProgram([publicApiPath], {
		experimentalDecorators: true,
		module: typescript.ModuleKind.ESNext,
		moduleResolution: typescript.ModuleResolutionKind.Bundler,
		noEmit: true,
		skipLibCheck: true,
		target: typescript.ScriptTarget.ES2022,
	});
}

function compareSymbols(first: typescript.Symbol, second: typescript.Symbol): number {
	return first.getName().localeCompare(second.getName(), 'en');
}

function resolveAliasedSymbol(typeChecker: typescript.TypeChecker, symbol: typescript.Symbol): typescript.Symbol {
	return symbol.flags & typescript.SymbolFlags.Alias ? typeChecker.getAliasedSymbol(symbol) : symbol;
}

function getDeclaration(symbol: typescript.Symbol): typescript.Declaration | undefined {
	return symbol.valueDeclaration ?? symbol.declarations?.[0];
}

function createApiSymbol(
	context: ApiIndexContext,
	exportedSymbol: typescript.Symbol,
	symbol: typescript.Symbol
): ObliqueApiSymbol | undefined {
	const declaration = getDeclaration(symbol);
	if (declaration === undefined) {
		return undefined;
	}
	const symbolName = exportedSymbol.getName();
	return {
		symbol: symbolName,
		kind: getSymbolKind(context.typeChecker, declaration),
		public: true,
		packageImport: obliquePackageImport,
		exportedFrom: getRepositoryRelativePath(context.repositoryRoot, context.publicApiPath),
		declaredIn: getRepositoryRelativePath(context.repositoryRoot, declaration.getSourceFile().fileName),
		signature: getSignature(context.typeChecker, symbolName, declaration),
		documentation: getDocumentation(context.typeChecker, symbol),
		deprecated: symbol.getJsDocTags(context.typeChecker).some(tag => tag.name === 'deprecated'),
	};
}

function createAngularTemplateApi(
	context: ApiIndexContext,
	apiSymbol: ObliqueApiSymbol,
	declaration: typescript.ClassDeclaration
): ObliqueAngularTemplateApi | undefined {
	if (apiSymbol.kind !== 'component' && apiSymbol.kind !== 'directive') {
		return undefined;
	}
	const selector = getAngularSelector(context.typeChecker, declaration, apiSymbol.kind);
	return selector === undefined
		? undefined
		: {
				symbol: apiSymbol.symbol,
				kind: apiSymbol.kind,
				selector,
				deprecated: apiSymbol.deprecated,
				documentation: apiSymbol.documentation,
				declaredIn: apiSymbol.declaredIn,
				public: true,
			};
}

function getSymbolKind(typeChecker: typescript.TypeChecker, declaration: typescript.Declaration): ObliqueApiSymbolKind {
	if (typescript.isClassDeclaration(declaration)) {
		return getGuardKind(typeChecker, declaration) ?? getAngularClassKind(typeChecker, declaration) ?? 'class';
	}
	if (typescript.isInterfaceDeclaration(declaration)) {
		return 'interface';
	}
	if (typescript.isTypeAliasDeclaration(declaration)) {
		return 'type';
	}
	if (typescript.isEnumDeclaration(declaration)) {
		return 'enum';
	}
	if (typescript.isFunctionDeclaration(declaration)) {
		return 'function';
	}
	if (typescript.isVariableDeclaration(declaration) && isConstDeclaration(declaration)) {
		return 'const';
	}
	return 'other';
}

function getAngularClassKind(
	typeChecker: typescript.TypeChecker,
	declaration: typescript.ClassDeclaration
): Extract<ObliqueApiSymbolKind, 'component' | 'directive' | 'service' | 'module' | 'pipe'> | undefined {
	const decorators = typescript.getDecorators(declaration) ?? [];
	for (const decorator of decorators) {
		const decoratorName = getAngularCoreDecoratorName(typeChecker, decorator);
		if (decoratorName !== undefined) {
			const angularClassKind = angularClassKinds.get(decoratorName);
			if (angularClassKind !== undefined) {
				return angularClassKind;
			}
		}
	}
	return undefined;
}

function getAngularSelector(
	typeChecker: typescript.TypeChecker,
	declaration: typescript.ClassDeclaration,
	kind: Extract<ObliqueApiSymbolKind, 'component' | 'directive'>
): string | undefined {
	const expectedDecoratorName = kind === 'component' ? 'Component' : 'Directive';
	const decorators = typescript.getDecorators(declaration);
	/* istanbul ignore next -- `kind` was derived from this same decorator list. */
	if (decorators === undefined) {
		return undefined;
	}
	const decorator = decorators.find(
		candidate => getAngularCoreDecoratorName(typeChecker, candidate) === expectedDecoratorName
	);
	/* istanbul ignore next -- `kind` was derived from this same decorator list. */
	if (decorator === undefined) {
		return undefined;
	}
	if (!typescript.isCallExpression(decorator.expression)) {
		return undefined;
	}
	const [metadata] = decorator.expression.arguments;
	if (metadata === undefined || !typescript.isObjectLiteralExpression(metadata)) {
		return undefined;
	}
	return getStaticSelectorProperty(metadata);
}

function getStaticSelectorProperty(metadata: typescript.ObjectLiteralExpression): string | undefined {
	for (const property of metadata.properties) {
		if (
			typescript.isPropertyAssignment(property) &&
			getPropertyName(property.name) === 'selector' &&
			isStaticSelectorValue(property.initializer)
		) {
			return property.initializer.text.trim() || undefined;
		}
	}
	return undefined;
}

function getPropertyName(name: typescript.PropertyName): string | undefined {
	return typescript.isIdentifier(name) || typescript.isStringLiteral(name) ? name.text : undefined;
}

function isStaticSelectorValue(expression: typescript.Expression): expression is typescript.StringLiteral {
	return typescript.isStringLiteral(expression);
}

function getAngularCoreDecoratorName(
	typeChecker: typescript.TypeChecker,
	decorator: typescript.Decorator
): string | undefined {
	const expression = typescript.isCallExpression(decorator.expression)
		? decorator.expression.expression
		: decorator.expression;
	const name = typescript.isPropertyAccessExpression(expression) ? expression.name : expression;
	const symbol = typeChecker.getSymbolAtLocation(name);
	if (symbol === undefined || !isAngularCoreDecoratorImport(typeChecker, expression, symbol)) {
		return undefined;
	}
	return resolveAliasedSymbol(typeChecker, symbol).getName();
}

function isAngularCoreDecoratorImport(
	typeChecker: typescript.TypeChecker,
	expression: typescript.Expression,
	symbol: typescript.Symbol
): boolean {
	if (isSymbolImportedFrom(symbol, angularCoreModuleSpecifier)) {
		return true;
	}
	return (
		typescript.isPropertyAccessExpression(expression) &&
		isNamespaceImportedFromAngularCore(typeChecker, expression.expression)
	);
}

function isNamespaceImportedFromAngularCore(
	typeChecker: typescript.TypeChecker,
	expression: typescript.Expression
): boolean {
	const namespaceSymbol = typeChecker.getSymbolAtLocation(expression);
	return namespaceSymbol !== undefined && isSymbolImportedFrom(namespaceSymbol, angularCoreModuleSpecifier);
}

function getGuardKind(
	typeChecker: typescript.TypeChecker,
	declaration: typescript.ClassDeclaration
): 'guard' | undefined {
	const heritageClauses = declaration.heritageClauses ?? [];
	const implementsClause = heritageClauses.find(clause => clause.token === typescript.SyntaxKind.ImplementsKeyword);
	if (implementsClause === undefined) {
		return undefined;
	}
	return implementsClause.types.some(type => isAngularRouterGuardType(typeChecker, type)) ? 'guard' : undefined;
}

function isAngularRouterGuardType(
	typeChecker: typescript.TypeChecker,
	type: typescript.ExpressionWithTypeArguments
): boolean {
	const importedSymbol = typeChecker.getSymbolAtLocation(type.expression);
	if (importedSymbol === undefined || !isSymbolImportedFrom(importedSymbol, angularRouterModuleSpecifier)) {
		return false;
	}
	return angularRouterGuardTypeNames.has(resolveAliasedSymbol(typeChecker, importedSymbol).getName());
}

function isSymbolImportedFrom(symbol: typescript.Symbol, moduleSpecifier: string): boolean {
	return (
		symbol.declarations?.some(declaration => {
			const importDeclaration = getContainingImportDeclaration(declaration);
			return (
				importDeclaration !== undefined &&
				typescript.isStringLiteral(importDeclaration.moduleSpecifier) &&
				importDeclaration.moduleSpecifier.text === moduleSpecifier
			);
		}) ?? false
	);
}

function getContainingImportDeclaration(declaration: typescript.Declaration): typescript.ImportDeclaration | undefined {
	let currentNode: typescript.Node | undefined = declaration;
	while (currentNode !== undefined) {
		if (typescript.isImportDeclaration(currentNode)) {
			return currentNode;
		}
		currentNode = currentNode.parent;
	}
	return undefined;
}

function isConstDeclaration(declaration: typescript.VariableDeclaration): boolean {
	const variableStatement = findVariableStatement(declaration);
	return (
		variableStatement !== undefined && (variableStatement.declarationList.flags & typescript.NodeFlags.Const) !== 0
	);
}

function findVariableStatement(declaration: typescript.VariableDeclaration): typescript.VariableStatement | undefined {
	let currentNode: typescript.Node | undefined = declaration;
	while (currentNode !== undefined && !typescript.isVariableStatement(currentNode)) {
		currentNode = currentNode.parent;
	}
	return currentNode;
}

function getSignature(
	typeChecker: typescript.TypeChecker,
	symbolName: string,
	declaration: typescript.Declaration
): string {
	if (typescript.isClassDeclaration(declaration)) {
		return `class ${symbolName}${getTypeParameters(declaration)}${getHeritage(declaration)}`;
	}
	if (typescript.isInterfaceDeclaration(declaration)) {
		return `interface ${symbolName}${getTypeParameters(declaration)}${getHeritage(declaration)}`;
	}
	if (typescript.isTypeAliasDeclaration(declaration)) {
		return `type ${symbolName}${getTypeParameters(declaration)} = ${declaration.type.getText()}`;
	}
	if (typescript.isEnumDeclaration(declaration)) {
		return `enum ${symbolName}`;
	}
	if (typescript.isFunctionDeclaration(declaration)) {
		const signature = typeChecker.getSignatureFromDeclaration(declaration);
		return signature === undefined
			? `function ${symbolName}`
			: `function ${symbolName}${typeChecker.signatureToString(signature, declaration, typescript.TypeFormatFlags.NoTruncation)}`;
	}
	if (typescript.isVariableDeclaration(declaration)) {
		const declarationKind = isConstDeclaration(declaration) ? 'const' : 'let';
		return `${declarationKind} ${symbolName}: ${typeChecker.typeToString(typeChecker.getTypeAtLocation(declaration))}`;
	}
	return symbolName;
}

function getTypeParameters(
	declaration: typescript.ClassDeclaration | typescript.InterfaceDeclaration | typescript.TypeAliasDeclaration
): string {
	return declaration.typeParameters === undefined
		? ''
		: `<${declaration.typeParameters.map(parameter => parameter.getText()).join(', ')}>`;
}

function getHeritage(declaration: typescript.ClassDeclaration | typescript.InterfaceDeclaration): string {
	return declaration.heritageClauses === undefined
		? ''
		: ` ${declaration.heritageClauses.map(clause => clause.getText()).join(' ')}`;
}

function getDocumentation(typeChecker: typescript.TypeChecker, symbol: typescript.Symbol): string | null {
	const documentation = typescript.displayPartsToString(symbol.getDocumentationComment(typeChecker)).trim();
	return documentation === '' ? null : documentation;
}

function getRepositoryRelativePath(repositoryRoot: string, path: string): string {
	return relative(repositoryRoot, path).split('\\').join('/');
}
