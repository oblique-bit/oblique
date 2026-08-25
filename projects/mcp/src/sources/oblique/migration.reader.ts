/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 4 official migration discovery and indexing
 */

import {basename, relative, resolve} from 'node:path';
import * as typescript from 'typescript';

const migrationIndexRelativePath = 'projects/oblique/schematics/index/ng-update/index.ts';
const migrationDirectoryRelativePath = 'projects/oblique/schematics/index/ng-update';
const upgradeFunctionPrefix = 'upgradeToV';

export interface ObliqueMigrationTask {
	name: string;
	description: string | null;
}

export type ObliqueMigrationDependencyRequirement =
	| number
	| number[]
	| {
			type: 'computed';
	  };

export interface ObliqueMigrationDependency {
	name: string;
	requirement: ObliqueMigrationDependencyRequirement;
}

export interface ObliqueMigrationStep {
	fromVersion: number;
	toVersion: number;
	source: string;
	tasks: ObliqueMigrationTask[];
	dependencies: ObliqueMigrationDependency[];
}

export interface ObliqueMigration {
	fromVersion: number;
	toVersion: number;
	migrationRequired: boolean;
	steps: ObliqueMigrationStep[];
}

export type MigrationProgramFactory = (migrationIndexPath: string) => typescript.Program;

/** An expected migration source shape could not be read safely. */
export class ObliqueMigrationSourceError extends Error {}

/** The requested versions cannot be connected by the official migration graph. */
export class ObliqueMigrationPathError extends Error {}

/**
 * Builds a read-only index from Oblique's official ng-update entry point.
 */
export class ObliqueMigrationReader {
	private readonly repositoryRoot: string;
	private readonly programFactory: MigrationProgramFactory;
	private index: ReadonlyMap<number, ObliqueMigrationStep> | undefined;

	constructor(repositoryRoot = process.cwd(), programFactory: MigrationProgramFactory = createMigrationProgram) {
		this.repositoryRoot = repositoryRoot;
		this.programFactory = programFactory;
	}

	getMigration(fromVersion: number, toVersion: number): ObliqueMigration {
		if (fromVersion > toVersion) {
			throw new ObliqueMigrationPathError(
				`Oblique migrations only support upgrades, not version ${fromVersion} to version ${toVersion}.`
			);
		}
		if (fromVersion === toVersion) {
			return {fromVersion, toVersion, migrationRequired: false, steps: []};
		}

		const steps: ObliqueMigrationStep[] = [];
		let currentVersion = fromVersion;
		while (currentVersion < toVersion) {
			const step = this.getIndex().get(currentVersion);
			if (step === undefined || step.toVersion <= currentVersion || step.toVersion > toVersion) {
				throw new ObliqueMigrationPathError(
					`No complete Oblique migration path found from version ${fromVersion} to version ${toVersion}.`
				);
			}
			steps.push(step);
			currentVersion = step.toVersion;
		}

		return {fromVersion, toVersion, migrationRequired: true, steps};
	}

	private getIndex(): ReadonlyMap<number, ObliqueMigrationStep> {
		this.index ??= this.createIndex();
		return this.index;
	}

	private createIndex(): ReadonlyMap<number, ObliqueMigrationStep> {
		const migrationIndexPath = resolve(this.repositoryRoot, migrationIndexRelativePath);
		const migrationDirectoryPath = resolve(this.repositoryRoot, migrationDirectoryRelativePath);
		const program = this.programFactory(migrationIndexPath);
		const indexSourceFile = program.getSourceFile(migrationIndexPath);
		if (indexSourceFile === undefined) {
			throw new ObliqueMigrationSourceError(`Unable to read the Oblique migration index at "${migrationIndexPath}".`);
		}

		const typeChecker = program.getTypeChecker();
		const steps = indexSourceFile.statements.flatMap(statement =>
			typescript.isFunctionDeclaration(statement)
				? createMigrationStep({migrationDirectoryPath, repositoryRoot: this.repositoryRoot, typeChecker}, statement)
				: []
		);
		return createMigrationIndex(steps);
	}
}

interface MigrationIndexContext {
	migrationDirectoryPath: string;
	repositoryRoot: string;
	typeChecker: typescript.TypeChecker;
}

function createMigrationProgram(migrationIndexPath: string): typescript.Program {
	return typescript.createProgram([migrationIndexPath], {
		module: typescript.ModuleKind.ESNext,
		moduleResolution: typescript.ModuleResolutionKind.Bundler,
		noEmit: true,
		skipLibCheck: true,
		target: typescript.ScriptTarget.ES2022,
	});
}

function createMigrationIndex(steps: readonly ObliqueMigrationStep[]): ReadonlyMap<number, ObliqueMigrationStep> {
	const index = new Map<number, ObliqueMigrationStep>();
	for (const step of steps) {
		if (index.has(step.fromVersion)) {
			throw new ObliqueMigrationSourceError(`Multiple Oblique migrations start at version ${step.fromVersion}.`);
		}
		index.set(step.fromVersion, step);
	}
	return index;
}

function createMigrationStep(
	context: MigrationIndexContext,
	upgradeFunction: typescript.FunctionDeclaration
): ObliqueMigrationStep[] {
	const upgrade = getUpgradeTarget(upgradeFunction.name);
	if (upgrade === undefined) {
		return [];
	}
	const {functionName, toVersion} = upgrade;
	const migrationClass = getMigrationClass(context.typeChecker, upgradeFunction);
	if (migrationClass === undefined) {
		throw new ObliqueMigrationSourceError(`Unable to resolve the migration class for ${functionName}.`);
	}
	assertContainedMigrationSource(migrationClass.getSourceFile().fileName, context.migrationDirectoryPath);
	const versions = getMigrationSourceVersions(migrationClass.getSourceFile().fileName);
	if (versions?.toVersion !== toVersion) {
		throw new ObliqueMigrationSourceError(
			`Unable to validate the migration source for upgrade to version ${toVersion}.`
		);
	}
	return [
		{
			fromVersion: versions.fromVersion,
			toVersion,
			source: getRepositoryRelativePath(context.repositoryRoot, migrationClass.getSourceFile().fileName),
			tasks: getMigrationTasks(migrationClass),
			dependencies: getMigrationDependencies(migrationClass),
		},
	];
}

function getUpgradeTarget(
	name: typescript.Identifier | undefined
): {functionName: string; toVersion: number} | undefined {
	if (!name?.text.startsWith(upgradeFunctionPrefix)) {
		return undefined;
	}
	const toVersion = parseMajorVersion(name.text.slice(upgradeFunctionPrefix.length));
	return toVersion === undefined ? undefined : {functionName: name.text, toVersion};
}

function getMigrationClass(
	typeChecker: typescript.TypeChecker,
	upgradeFunction: typescript.FunctionDeclaration
): typescript.ClassDeclaration | undefined {
	const newExpression = findFirstNode(upgradeFunction.body, typescript.isNewExpression);
	if (newExpression === undefined) {
		return undefined;
	}
	const symbol = typeChecker.getSymbolAtLocation(newExpression.expression);
	if (symbol === undefined) {
		return undefined;
	}
	const declaration = getDeclaration(resolveAliasedSymbol(typeChecker, symbol));
	return declaration !== undefined && typescript.isClassDeclaration(declaration) ? declaration : undefined;
}

function getMigrationTasks(migrationClass: typescript.ClassDeclaration): ObliqueMigrationTask[] {
	const applyMigrations = findClassMethod(migrationClass, 'applyMigrations');
	if (applyMigrations === undefined) {
		throw new ObliqueMigrationSourceError(
			`Migration class ${migrationClass.name?.text ?? '<anonymous>'} does not declare applyMigrations().`
		);
	}
	const chainEntries = findChainEntries(applyMigrations);
	if (chainEntries === undefined) {
		throw new ObliqueMigrationSourceError(
			`Migration class ${migrationClass.name?.text ?? '<anonymous>'} does not declare chain([...]) in applyMigrations().`
		);
	}
	return chainEntries.map(entry => createMigrationTask(migrationClass, entry));
}

function findChainEntries(method: typescript.MethodDeclaration): readonly typescript.Expression[] | undefined {
	const chainCall = findFirstNode(method.body, isChainCall);
	const firstArgument = chainCall?.arguments[0];
	return firstArgument !== undefined && typescript.isArrayLiteralExpression(firstArgument)
		? firstArgument.elements.filter(typescript.isExpression)
		: undefined;
}

function isChainCall(node: typescript.Node): node is typescript.CallExpression {
	return typescript.isCallExpression(node) && getCallExpressionName(node) === 'chain';
}

function createMigrationTask(
	migrationClass: typescript.ClassDeclaration,
	entry: typescript.Expression
): ObliqueMigrationTask {
	const method = getInvokedMigrationMethod(migrationClass, entry);
	return {
		name: getTaskName(entry),
		description: method === undefined ? null : getInfoMigrationDescription(method),
	};
}

function getInvokedMigrationMethod(
	migrationClass: typescript.ClassDeclaration,
	entry: typescript.Expression
): typescript.MethodDeclaration | undefined {
	if (
		!typescript.isCallExpression(entry) ||
		!typescript.isPropertyAccessExpression(entry.expression) ||
		entry.expression.expression.kind !== typescript.SyntaxKind.ThisKeyword
	) {
		return undefined;
	}
	return findClassMethod(migrationClass, entry.expression.name.text);
}

function getTaskName(entry: typescript.Expression): string {
	if (!typescript.isCallExpression(entry)) {
		return typescript.SyntaxKind[entry.kind];
	}
	return getCallExpressionName(entry) ?? typescript.SyntaxKind[entry.expression.kind];
}

function getCallExpressionName(expression: typescript.CallExpression): string | undefined {
	if (typescript.isIdentifier(expression.expression)) {
		return expression.expression.text;
	}
	return typescript.isPropertyAccessExpression(expression.expression) ? expression.expression.name.text : undefined;
}

function getInfoMigrationDescription(method: typescript.MethodDeclaration): string | null {
	const infoMigrationCall = findFirstNode(method.body, isInfoMigrationCall);
	const message = infoMigrationCall?.arguments[1];
	return message !== undefined &&
		(typescript.isStringLiteral(message) || typescript.isNoSubstitutionTemplateLiteral(message))
		? message.text
		: null;
}

function isInfoMigrationCall(node: typescript.Node): node is typescript.CallExpression {
	return typescript.isCallExpression(node) && getCallExpressionName(node) === 'infoMigration';
}

function getMigrationDependencies(migrationClass: typescript.ClassDeclaration): ObliqueMigrationDependency[] {
	const property = migrationClass.members.find(
		(member): member is typescript.PropertyDeclaration =>
			typescript.isPropertyDeclaration(member) && getPropertyName(member.name) === 'dependencies'
	);
	if (property?.initializer === undefined || !typescript.isObjectLiteralExpression(property.initializer)) {
		return [];
	}
	return property.initializer.properties.flatMap(propertyAssignment => {
		if (!typescript.isPropertyAssignment(propertyAssignment)) {
			return [];
		}
		const name = getPropertyName(propertyAssignment.name);
		return name === undefined ? [] : [{name, requirement: getDependencyRequirement(propertyAssignment.initializer)}];
	});
}

function getDependencyRequirement(expression: typescript.Expression): ObliqueMigrationDependencyRequirement {
	if (typescript.isNumericLiteral(expression)) {
		return Number(expression.text);
	}
	if (typescript.isArrayLiteralExpression(expression)) {
		const versions = expression.elements.map(element =>
			typescript.isNumericLiteral(element) ? Number(element.text) : undefined
		);
		if (versions.every((version): version is number => version !== undefined)) {
			return versions;
		}
	}
	return {type: 'computed'};
}

function findClassMethod(
	migrationClass: typescript.ClassDeclaration,
	name: string
): typescript.MethodDeclaration | undefined {
	return migrationClass.members.find(
		(member): member is typescript.MethodDeclaration =>
			typescript.isMethodDeclaration(member) && getPropertyName(member.name) === name
	);
}

function getPropertyName(name: typescript.PropertyName | undefined): string | undefined {
	return name !== undefined &&
		(typescript.isIdentifier(name) || typescript.isStringLiteral(name) || typescript.isNumericLiteral(name))
		? name.text
		: undefined;
}

function findFirstNode<TNode extends typescript.Node>(
	node: typescript.Node | undefined,
	predicate: (currentNode: typescript.Node) => currentNode is TNode
): TNode | undefined {
	if (node === undefined) {
		return undefined;
	}
	if (predicate(node)) {
		return node;
	}
	return typescript.forEachChild(node, child => findFirstNode(child, predicate));
}

function getMigrationSourceVersions(fileName: string): {fromVersion: number; toVersion: number} | undefined {
	const fileBaseName = basename(fileName);
	const prefix = 'update-v';
	const separator = '-to-v';
	const suffix = '.ts';
	if (!fileBaseName.startsWith(prefix) || !fileBaseName.endsWith(suffix)) {
		return undefined;
	}
	const versionText = fileBaseName.slice(prefix.length, -suffix.length);
	const separatorIndex = versionText.indexOf(separator);
	if (separatorIndex === -1) {
		return undefined;
	}
	const fromVersion = parseMajorVersion(versionText.slice(0, separatorIndex));
	const toVersion = parseMajorVersion(versionText.slice(separatorIndex + separator.length));
	return fromVersion === undefined || toVersion === undefined ? undefined : {fromVersion, toVersion};
}

function parseMajorVersion(version: string): number | undefined {
	const parsedVersion = Number(version);
	return Number.isSafeInteger(parsedVersion) && parsedVersion > 0 && `${parsedVersion}` === version
		? parsedVersion
		: undefined;
}

function assertContainedMigrationSource(sourcePath: string, migrationDirectoryPath: string): void {
	const sourceRelativePath = relative(migrationDirectoryPath, sourcePath);
	if (sourceRelativePath === '' || sourceRelativePath.startsWith('../')) {
		throw new ObliqueMigrationSourceError('Resolved a migration source outside the official ng-update directory.');
	}
}

function resolveAliasedSymbol(typeChecker: typescript.TypeChecker, symbol: typescript.Symbol): typescript.Symbol {
	return symbol.flags & typescript.SymbolFlags.Alias ? typeChecker.getAliasedSymbol(symbol) : symbol;
}

function getDeclaration(symbol: typescript.Symbol): typescript.Declaration | undefined {
	return symbol.valueDeclaration ?? symbol.declarations?.[0];
}

function getRepositoryRelativePath(repositoryRoot: string, path: string): string {
	return relative(repositoryRoot, path).split('\\').join('/');
}
