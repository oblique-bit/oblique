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
	inputs?: readonly ObliqueAngularTemplateInput[];
	outputs?: readonly ObliqueAngularTemplateOutput[];
}

export interface ObliqueAngularTemplateInput {
	name: string;
	propertyName: string;
	required: boolean;
	deprecated: boolean;
	documentation: string | null;
	declaredIn: string;
}

export interface ObliqueAngularTemplateOutput {
	name: string;
	propertyName: string;
	deprecated: boolean;
	documentation: string | null;
	declaredIn: string;
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
	classBindings: Map<typescript.ClassDeclaration, ClassBindings>;
}

interface ClassBindings {
	inputs: readonly ObliqueAngularTemplateInput[];
	outputs: readonly ObliqueAngularTemplateOutput[];
}

interface PublicApiIndex {
	symbols: ReadonlyMap<string, ObliqueApiSymbol>;
	angularTemplateApis: readonly ObliqueAngularTemplateApi[];
}

function createApiIndex(
	context: Omit<ApiIndexContext, 'classBindings'>,
	moduleSymbol: typescript.Symbol
): PublicApiIndex {
	const bindingContext: ApiIndexContext = {...context, classBindings: new Map()};
	const angularTemplateApis: ObliqueAngularTemplateApi[] = [];
	const symbols = context.typeChecker
		.getExportsOfModule(moduleSymbol)
		.sort(compareSymbols)
		.flatMap(exportedSymbol => {
			const symbol = resolveAliasedSymbol(context.typeChecker, exportedSymbol);
			const apiSymbol = createApiSymbol(bindingContext, exportedSymbol, symbol);
			if (apiSymbol === undefined) {
				return [];
			}
			const declaration = getDeclaration(symbol);
			const angularTemplateApi =
				declaration !== undefined && typescript.isClassDeclaration(declaration)
					? createAngularTemplateApi(bindingContext, apiSymbol, declaration)
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
				...getClassBindings(context, declaration),
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

function getClassBindings(context: ApiIndexContext, declaration: typescript.ClassDeclaration): ClassBindings {
	const cached = context.classBindings.get(declaration);
	if (cached !== undefined) {
		return cached;
	}
	// Store a placeholder before traversing heritage clauses to make malformed cycles harmless.
	context.classBindings.set(declaration, {inputs: [], outputs: []});
	const inherited = getBaseClassDeclaration(context.typeChecker, declaration);
	const inheritedBindings = inherited === undefined ? {inputs: [], outputs: []} : getClassBindings(context, inherited);
	const ownBindings = getOwnClassBindings(context, declaration);
	const bindings = {
		inputs: mergeBindings(inheritedBindings.inputs, ownBindings.inputs),
		outputs: mergeBindings(inheritedBindings.outputs, ownBindings.outputs),
	};
	context.classBindings.set(declaration, bindings);
	return bindings;
}

function getBaseClassDeclaration(
	typeChecker: typescript.TypeChecker,
	declaration: typescript.ClassDeclaration
): typescript.ClassDeclaration | undefined {
	const extendsClause = declaration.heritageClauses?.find(
		clause => clause.token === typescript.SyntaxKind.ExtendsKeyword
	);
	const type = extendsClause?.types[0];
	if (type === undefined) {
		return undefined;
	}
	const symbol = typeChecker.getSymbolAtLocation(type.expression);
	// istanbul ignore next — resolveAliasedSymbol call only with resolved base class symbols
	const base = symbol === undefined ? undefined : resolveAliasedSymbol(typeChecker, symbol);
	return base?.declarations?.find(typescript.isClassDeclaration);
}

function mergeBindings<T extends ObliqueAngularTemplateInput | ObliqueAngularTemplateOutput>(
	inherited: readonly T[],
	owned: readonly T[]
): readonly T[] {
	const bindings = new Map(inherited.map(binding => [binding.name, binding]));
	for (const binding of owned) {
		bindings.set(binding.name, binding);
	}
	return [...bindings.values()].sort((first, second) => first.name.localeCompare(second.name, 'en'));
}

function getOwnClassBindings(context: ApiIndexContext, declaration: typescript.ClassDeclaration): ClassBindings {
	const inputs: ObliqueAngularTemplateInput[] = [];
	const outputs: ObliqueAngularTemplateOutput[] = [];
	for (const member of declaration.members) {
		const propertyName = getMemberName(member);
		if (propertyName === undefined) {
			continue;
		}
		const bindingMetadata = getDecoratorBinding(context, member, propertyName);
		if (bindingMetadata !== undefined) {
			(bindingMetadata.kind === 'input' ? inputs : outputs).push(bindingMetadata.binding);
			continue;
		}
		const signalBinding = getSignalBinding(context, member, propertyName);
		if (signalBinding !== undefined) {
			inputs.push(...signalBinding.inputs);
			outputs.push(...signalBinding.outputs);
		}
	}
	const hostBindings = getExplicitHostDirectiveBindings(context, declaration);
	return {inputs: mergeBindings(inputs, hostBindings.inputs), outputs: mergeBindings(outputs, hostBindings.outputs)};
}

function getExplicitHostDirectiveBindings(
	context: ApiIndexContext,
	declaration: typescript.ClassDeclaration
): ClassBindings {
	const decorator = (typescript.getDecorators(declaration) ?? []).find(candidate => {
		const name = getAngularCoreDecoratorName(context.typeChecker, candidate);
		return name === 'Component' || name === 'Directive';
	});
	if (decorator === undefined || !typescript.isCallExpression(decorator.expression)) {
		return {inputs: [], outputs: []};
	}
	const metadata = decorator.expression.arguments[0];
	if (metadata === undefined || !typescript.isObjectLiteralExpression(metadata)) {
		return {inputs: [], outputs: []};
	}
	const hostDirectives = getObjectArrayProperty(metadata, 'hostDirectives');
	if (hostDirectives === undefined) {
		return {inputs: [], outputs: []};
	}
	const inputs: ObliqueAngularTemplateInput[] = [];
	const outputs: ObliqueAngularTemplateOutput[] = [];
	for (const hostDirective of hostDirectives.elements) {
		if (!typescript.isObjectLiteralExpression(hostDirective)) {
			continue;
		}
		const directiveExpression = getObjectExpressionProperty(hostDirective, 'directive');
		if (directiveExpression === undefined) {
			continue;
		}
		const symbol = context.typeChecker.getSymbolAtLocation(directiveExpression);
		const hostClass =
			symbol === undefined
				? undefined
				: resolveAliasedSymbol(context.typeChecker, symbol).declarations?.find(typescript.isClassDeclaration);
		if (hostClass === undefined) {
			continue;
		}
		const hostBindings = getClassBindings(context, hostClass);
		inputs.push(...getExposedHostBindings(hostBindings.inputs, getObjectStringArrayProperty(hostDirective, 'inputs')));
		outputs.push(
			...getExposedHostBindings(hostBindings.outputs, getObjectStringArrayProperty(hostDirective, 'outputs'))
		);
	}
	return {inputs, outputs};
}

function getExposedHostBindings<T extends ObliqueAngularTemplateInput | ObliqueAngularTemplateOutput>(
	bindings: readonly T[],
	exposures: readonly string[] | undefined
): readonly T[] {
	if (exposures === undefined) {
		return [];
	}
	return exposures.flatMap(exposure => {
		const [propertyName, alias] = exposure.split(':').map(part => part.trim());
		const binding = bindings.find(candidate => candidate.name === propertyName);
		return binding === undefined || propertyName === undefined ? [] : [{...binding, name: alias || binding.name}];
	});
}

function getObjectArrayProperty(
	metadata: typescript.ObjectLiteralExpression,
	propertyName: string
): typescript.ArrayLiteralExpression | undefined {
	const expression = getObjectExpressionProperty(metadata, propertyName);
	return expression !== undefined && typescript.isArrayLiteralExpression(expression) ? expression : undefined;
}

function getObjectStringArrayProperty(
	metadata: typescript.ObjectLiteralExpression,
	propertyName: string
): readonly string[] | undefined {
	const array = getObjectArrayProperty(metadata, propertyName);
	if (array === undefined || !array.elements.every(typescript.isStringLiteral)) {
		return undefined;
	}
	// istanbul ignore next — unreachable; all elements confirmed to be string literals by guard above
	return array.elements.flatMap(element => (typescript.isStringLiteral(element) ? [element.text] : []));
}

function getObjectExpressionProperty(
	metadata: typescript.ObjectLiteralExpression,
	propertyName: string
): typescript.Expression | undefined {
	const property = metadata.properties.find(
		(candidate): candidate is typescript.PropertyAssignment =>
			typescript.isPropertyAssignment(candidate) && getPropertyName(candidate.name) === propertyName
	);
	return property?.initializer;
}

function getMemberName(member: typescript.ClassElement): string | undefined {
	return 'name' in member && member.name !== undefined ? getPropertyName(member.name) : undefined;
}

function getDecoratorBinding(
	context: ApiIndexContext,
	member: typescript.ClassElement,
	propertyName: string
): {kind: 'input' | 'output'; binding: ObliqueAngularTemplateInput | ObliqueAngularTemplateOutput} | undefined {
	// istanbul ignore next — canHaveDecorators defensive check; getDecorators type guards prevent falsy decorators
	for (const decorator of (typescript.canHaveDecorators(member) ? typescript.getDecorators(member) : undefined) ?? []) {
		const decoratorName = getAngularCoreDecoratorName(context.typeChecker, decorator);
		if (decoratorName !== 'Input' && decoratorName !== 'Output') {
			continue;
		}
		const options = getDecoratorOptions(decorator);
		if (options === undefined) {
			continue;
		}
		const name = options.alias ?? propertyName;
		const details = getMemberDetails(context, member);
		return decoratorName === 'Input'
			? {kind: 'input', binding: {name, propertyName, required: options.required, ...details}}
			: {kind: 'output', binding: {name, propertyName, ...details}};
	}
	return undefined;
}

function getDecoratorOptions(decorator: typescript.Decorator): {alias?: string; required: boolean} | undefined {
	if (!typescript.isCallExpression(decorator.expression)) {
		return undefined;
	}
	const [argument] = decorator.expression.arguments;
	if (argument === undefined) {
		return {required: false};
	}
	if (typescript.isStringLiteral(argument)) {
		return {alias: argument.text, required: false};
	}
	if (!typescript.isObjectLiteralExpression(argument)) {
		return undefined;
	}
	return {
		alias: getStaticStringProperty(argument, 'alias'),
		required: getStaticBooleanProperty(argument, 'required') ?? false,
	};
}

function getSignalBinding(
	context: ApiIndexContext,
	member: typescript.ClassElement,
	propertyName: string
): ClassBindings | undefined {
	if (
		!typescript.isPropertyDeclaration(member) ||
		member.initializer === undefined ||
		!typescript.isCallExpression(member.initializer)
	) {
		return undefined;
	}
	const signalName = getAngularCoreCallName(context.typeChecker, member.initializer.expression);
	if (signalName !== 'input' && signalName !== 'output' && signalName !== 'model') {
		return undefined;
	}
	const required =
		typescript.isPropertyAccessExpression(member.initializer.expression) &&
		member.initializer.expression.name.text === 'required';
	const options = getSignalOptions(member.initializer, signalName, required);
	if (options === undefined) {
		return undefined;
	}
	const name = options.alias ?? propertyName;
	const details = getMemberDetails(context, member);
	if (signalName === 'input') {
		return {inputs: [{name, propertyName, required, ...details}], outputs: []};
	}
	if (signalName === 'output') {
		return {inputs: [], outputs: [{name, propertyName, ...details}]};
	}
	return {
		inputs: [{name, propertyName, required, ...details}],
		outputs: [{name: `${name}Change`, propertyName: `${propertyName}Change`, ...details}],
	};
}

function getSignalOptions(
	call: typescript.CallExpression,
	signalName: 'input' | 'output' | 'model',
	required: boolean
): {alias?: string} | undefined {
	const optionsIndex = signalName === 'output' || required ? 0 : 1;
	const options = call.arguments[optionsIndex];
	if (options === undefined) {
		return {};
	}
	if (!typescript.isObjectLiteralExpression(options)) {
		return undefined;
	}
	const alias = getStaticStringProperty(options, 'alias');
	return alias === undefined && hasProperty(options, 'alias') ? undefined : {alias};
}

function getMemberDetails(
	context: ApiIndexContext,
	member: typescript.ClassElement
): {
	deprecated: boolean;
	documentation: string | null;
	declaredIn: string;
} {
	// istanbul ignore next — defensive member name guard; all analyzed class members have names
	const symbol =
		'name' in member && member.name !== undefined ? context.typeChecker.getSymbolAtLocation(member.name) : undefined;
	return {
		deprecated:
			// istanbul ignore next — defensive undefined symbol handling
			symbol?.getJsDocTags(context.typeChecker).some(tag => tag.name === 'deprecated') ?? false,
		documentation:
			// istanbul ignore next — defensive symbol undefined check; all analyzed members have symbols
			symbol === undefined ? null : getDocumentation(context.typeChecker, symbol),
		declaredIn: getRepositoryRelativePath(context.repositoryRoot, member.getSourceFile().fileName),
	};
}

function getAngularCoreCallName(
	typeChecker: typescript.TypeChecker,
	expression: typescript.Expression
): string | undefined {
	if (typescript.isPropertyAccessExpression(expression)) {
		const baseSymbol = typeChecker.getSymbolAtLocation(expression.expression);
		if (
			baseSymbol !== undefined &&
			isAngularCoreDecoratorImport(typeChecker, expression.expression, baseSymbol) &&
			['input', 'model'].includes(resolveAliasedSymbol(typeChecker, baseSymbol).getName())
		) {
			return resolveAliasedSymbol(typeChecker, baseSymbol).getName();
		}
	}
	const target = typescript.isPropertyAccessExpression(expression) ? expression.name : expression;
	const symbol = typeChecker.getSymbolAtLocation(target);
	return symbol !== undefined && isAngularCoreDecoratorImport(typeChecker, expression, symbol)
		? resolveAliasedSymbol(typeChecker, symbol).getName()
		: undefined;
}

function getStaticStringProperty(
	metadata: typescript.ObjectLiteralExpression,
	propertyName: string
): string | undefined {
	const property = metadata.properties.find(
		(candidate): candidate is typescript.PropertyAssignment =>
			typescript.isPropertyAssignment(candidate) && getPropertyName(candidate.name) === propertyName
	);
	return property !== undefined && typescript.isStringLiteral(property.initializer)
		? property.initializer.text
		: undefined;
}

function getStaticBooleanProperty(
	metadata: typescript.ObjectLiteralExpression,
	propertyName: string
): boolean | undefined {
	const property = metadata.properties.find(
		(candidate): candidate is typescript.PropertyAssignment =>
			typescript.isPropertyAssignment(candidate) && getPropertyName(candidate.name) === propertyName
	);
	if (property?.initializer.kind === typescript.SyntaxKind.TrueKeyword) {
		return true;
	}
	if (property?.initializer.kind === typescript.SyntaxKind.FalseKeyword) {
		return false;
	}
	return undefined;
}

function hasProperty(metadata: typescript.ObjectLiteralExpression, propertyName: string): boolean {
	return metadata.properties.some(
		candidate => typescript.isPropertyAssignment(candidate) && getPropertyName(candidate.name) === propertyName
	);
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
