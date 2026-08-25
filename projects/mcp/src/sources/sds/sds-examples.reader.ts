/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 2 search and examples
 */

import {readFile} from 'node:fs/promises';
import {dirname, extname, isAbsolute, relative, resolve} from 'node:path';
import * as typescript from 'typescript';

const codeExamplesRelativePath = 'projects/sds/src/app/code-examples';
const mapperFileName = 'code-examples.mapper.ts';

export interface ObliqueExampleSnippet {
	language: string;
	title: string;
	path: string;
	content: string;
}

export interface ObliqueExample {
	id: string;
	title: string;
	snippets: ObliqueExampleSnippet[];
}

export interface ObliqueExamples {
	component: string;
	examples: ObliqueExample[];
}

export class SdsExamplesReader {
	private readonly repositoryRoot: string;
	private readonly readSourceFile: (path: string) => Promise<string>;

	constructor(
		repositoryRoot = process.cwd(),
		readSourceFile: (path: string) => Promise<string> = defaultReadSourceFile
	) {
		this.repositoryRoot = repositoryRoot;
		this.readSourceFile = readSourceFile;
	}

	async getExamples(component: string): Promise<ObliqueExamples | undefined> {
		const normalizedComponent = normalizeComponent(component);
		if (normalizedComponent === undefined) {
			return undefined;
		}
		const componentSourcePath = await this.getComponentSourcePath(normalizedComponent);
		if (componentSourcePath === undefined) {
			return undefined;
		}
		const componentSource = await this.readSourceFile(componentSourcePath);
		return {
			component: normalizedComponent,
			examples: await Promise.all(parseExamples(componentSource).map(example => this.readExample(example))),
		};
	}

	private async getComponentSourcePath(component: string): Promise<string | undefined> {
		const mapperPath = this.getCodeExamplesPath(mapperFileName);
		const mapperSource = parseSourceFile(mapperPath, await this.readSourceFile(mapperPath));
		const componentClass = findComponentClass(mapperSource, component);
		return componentClass === undefined ? undefined : findComponentImportPath(mapperSource, componentClass, mapperPath);
	}

	private async readExample(example: ParsedExample): Promise<ObliqueExample> {
		return {
			id: example.id,
			title: example.title,
			snippets: await Promise.all(example.snippets.map(snippet => this.readSnippet(snippet))),
		};
	}

	private async readSnippet(snippet: ParsedSnippet): Promise<ObliqueExampleSnippet> {
		const sourcePath = this.getSourcePath(snippet);
		const source = await this.readSourceFile(sourcePath);
		const content =
			snippet.kind === 'json'
				? JSON.stringify(JSON.parse(source), null, 2)
				: normalizeSource(extname(sourcePath), source);
		return {
			language: getLanguage(sourcePath),
			title: snippet.title,
			path: relative(this.repositoryRoot, sourcePath),
			content,
		};
	}

	private getSourcePath(snippet: ParsedSnippet): string {
		return snippet.kind === 'json'
			? this.getJsonSourcePath(snippet.directory, snippet.filePath)
			: this.getSnippetSourcePath(snippet.directory, snippet.filePath);
	}

	private getSnippetSourcePath(directory: string, filePath: string): string {
		const basePath =
			directory === 'code-examples'
				? this.getCodeExamplesPath()
				: assertPathInside(
						this.getCodeExamplesPath('code-examples'),
						this.getCodeExamplesPath('code-examples', directory, 'previews')
					);
		return assertPathInside(basePath, resolve(basePath, filePath));
	}

	private getJsonSourcePath(directory: string, filePath: string): string {
		const basePath =
			directory === 'i18n'
				? resolve(this.repositoryRoot, 'projects/sds/src/assets/i18n')
				: assertPathInside(
						resolve(this.repositoryRoot, 'projects'),
						resolve(this.repositoryRoot, 'projects', directory)
					);
		return assertPathInside(basePath, resolve(basePath, filePath));
	}

	private getCodeExamplesPath(...paths: string[]): string {
		return resolve(this.repositoryRoot, codeExamplesRelativePath, ...paths);
	}
}

interface ParsedExample {
	id: string;
	title: string;
	snippets: ParsedSnippet[];
}

interface ParsedSnippet {
	kind: 'json' | 'source';
	directory: string;
	filePath: string;
	title: string;
}

function normalizeComponent(component: string): string | undefined {
	const normalizedComponent = component.trim().toLocaleLowerCase().replace(/-\d+$/u, '');
	return /^[a-z0-9-]+$/u.test(normalizedComponent) ? normalizedComponent : undefined;
}

function parseSourceFile(fileName: string, source: string): typescript.SourceFile {
	return typescript.createSourceFile(fileName, source, typescript.ScriptTarget.Latest, true);
}

function findComponentClass(sourceFile: typescript.SourceFile, component: string): string | undefined {
	const mapping = findCodeExamplesMapping(sourceFile);
	const mappedComponent = mapping.get(component) ?? mapping.get(component.replace(/-\d+$/u, ''));
	return mappedComponent === undefined || !typescript.isIdentifier(mappedComponent) ? undefined : mappedComponent.text;
}

function findCodeExamplesMapping(sourceFile: typescript.SourceFile): Map<string, typescript.Expression> {
	for (const statement of sourceFile.statements) {
		if (typescript.isVariableStatement(statement)) {
			for (const declaration of statement.declarationList.declarations) {
				if (
					typescript.isIdentifier(declaration.name) &&
					declaration.name.text === 'codeExamples' &&
					declaration.initializer !== undefined &&
					typescript.isObjectLiteralExpression(declaration.initializer)
				) {
					return new Map(
						declaration.initializer.properties.flatMap(property => {
							if (!typescript.isPropertyAssignment(property)) {
								return [];
							}
							const name = getPropertyName(property.name);
							return name === undefined ? [] : [[name, property.initializer]];
						})
					);
				}
			}
		}
	}
	return new Map();
}

function findComponentImportPath(
	sourceFile: typescript.SourceFile,
	componentClass: string,
	mapperPath: string
): string | undefined {
	for (const statement of sourceFile.statements) {
		if (typescript.isImportDeclaration(statement) && typescript.isStringLiteral(statement.moduleSpecifier)) {
			const imports = statement.importClause?.namedBindings;
			if (
				imports !== undefined &&
				typescript.isNamedImports(imports) &&
				imports.elements.some(imported => imported.name.text === componentClass)
			) {
				const importPath = statement.moduleSpecifier.text;
				const sourcePath = importPath.endsWith('.ts') ? importPath : `${importPath}.ts`;
				return assertPathInside(dirname(mapperPath), resolve(dirname(mapperPath), sourcePath));
			}
		}
	}
	return undefined;
}

function parseExamples(componentSource: string): ParsedExample[] {
	const sourceFile = parseSourceFile('code-examples.component.ts', componentSource);
	const componentDirectory = getStringProperty(sourceFile, 'directory');
	const previews = getArrayProperty(sourceFile, 'previews');
	return (
		previews?.elements.flatMap(element =>
			typescript.isObjectLiteralExpression(element) ? [parseExample(element, componentDirectory)] : []
		) ?? []
	);
}

function parseExample(
	example: typescript.ObjectLiteralExpression,
	componentDirectory: string | undefined
): ParsedExample {
	const idParts = getArrayProperty(example, 'idParts')?.elements.flatMap(getStringValue) ?? [];
	const title = getStringProperty(example, 'title') ?? idParts.join(' ');
	const snippets =
		getArrayProperty(example, 'snippets')?.elements.flatMap(snippet => parseSnippet(snippet, componentDirectory)) ?? [];
	return {id: idParts.join('-'), title, snippets};
}

function parseSnippet(expression: typescript.Expression, componentDirectory: string | undefined): ParsedSnippet[] {
	if (!typescript.isCallExpression(expression) || !typescript.isPropertyAccessExpression(expression.expression)) {
		return [];
	}
	const method = expression.expression;
	if (
		method.expression.kind !== typescript.SyntaxKind.ThisKeyword ||
		(method.name.text !== 'getSnippet' && method.name.text !== 'getJsonSnippet')
	) {
		return [];
	}
	if (expression.arguments.length !== 3) {
		return [];
	}
	const [directoryExpression, filePathExpression, titleExpression] = expression.arguments;
	/* istanbul ignore next -- TypeScript AST NodeArrays do not contain undefined entries. */
	if (directoryExpression === undefined || filePathExpression === undefined || titleExpression === undefined) {
		return [];
	}
	const directory =
		getStringValue(directoryExpression) ??
		(method.name.text === 'getSnippet' && isThisDirectory(directoryExpression)
			? (componentDirectory ?? '')
			: undefined);
	const filePath = getStringValue(filePathExpression);
	const title = getStringValue(titleExpression);
	if (directory === undefined || filePath === undefined || title === undefined) {
		return [];
	}
	return [
		{
			kind: method.name.text === 'getJsonSnippet' ? 'json' : 'source',
			directory,
			filePath,
			title,
		},
	];
}

function isThisDirectory(expression: typescript.Expression): boolean {
	return (
		typescript.isPropertyAccessExpression(expression) &&
		expression.expression.kind === typescript.SyntaxKind.ThisKeyword &&
		expression.name.text === 'directory'
	);
}

function getArrayProperty(node: typescript.Node, name: string): typescript.ArrayLiteralExpression | undefined {
	const property = getProperty(node, name);
	return property?.initializer !== undefined && typescript.isArrayLiteralExpression(property.initializer)
		? property.initializer
		: undefined;
}

function getStringProperty(node: typescript.Node, name: string): string | undefined {
	const property = getProperty(node, name);
	return property?.initializer === undefined ? undefined : getStringValue(property.initializer);
}

function getProperty(
	node: typescript.Node,
	name: string
): typescript.PropertyAssignment | typescript.PropertyDeclaration | undefined {
	if (
		(typescript.isPropertyAssignment(node) || typescript.isPropertyDeclaration(node)) &&
		getPropertyName(node.name) === name &&
		node.initializer !== undefined
	) {
		return node;
	}
	return typescript.forEachChild(node, candidate => getProperty(candidate, name));
}

function getPropertyName(name: typescript.PropertyName): string | undefined {
	return typescript.isIdentifier(name) || typescript.isStringLiteral(name) ? name.text : undefined;
}

function getStringValue(expression: typescript.Expression): string | undefined {
	return typescript.isStringLiteral(expression) || typescript.isNoSubstitutionTemplateLiteral(expression)
		? expression.text
		: undefined;
}

function assertPathInside(basePath: string, targetPath: string): string {
	const relativePath = relative(basePath, targetPath);
	if (isAbsolute(relativePath) || relativePath.startsWith('../') || relativePath === '..') {
		throw new Error('SDS example source path escapes the code examples directory.');
	}
	return targetPath;
}

function normalizeSource(extension: string, source: string): string {
	switch (extension) {
		case '.scss':
			return source.replace(/@oblique\/oblique\/src\/styles\/scss\/core/gu, '@oblique/oblique/styles/scss/core');
		case '.ts':
			return source.replace(/(?:\.\.\/)+/gu, './');
		default:
			return source;
	}
}

function getLanguage(sourcePath: string): string {
	const extension = extname(sourcePath).replace('.', '');
	return extension === 'ts' ? 'typescript' : extension;
}

async function defaultReadSourceFile(path: string): Promise<string> {
	return readFile(path, 'utf8');
}
