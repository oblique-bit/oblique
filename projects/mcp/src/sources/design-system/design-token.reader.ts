/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 6 read-only Design System CSS token discovery
 */

import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';

const tokenSourceRelativePath = 'projects/design-system/src/lib/css/layers/tokens.css';

export type ObliqueDesignTokenTier = 'semantic' | 'html' | 'component' | 'unknown';
export type ObliqueDesignTokenScope = 'project' | 'all';

export interface ObliqueDesignTokenOverride {
	selector: string;
	value: string;
	references: string[];
}

export interface ObliqueDesignToken {
	name: string;
	tier: ObliqueDesignTokenTier;
	usableByProjects: boolean;
	value: string;
	references: string[];
	overrides: ObliqueDesignTokenOverride[];
	source: typeof tokenSourceRelativePath;
}

export interface ObliqueDesignTokenSearch {
	query: string;
	scope: ObliqueDesignTokenScope;
	/** Number of matching tokens before the requested result limit is applied. */
	total: number;
	results: ObliqueDesignToken[];
}

export interface ObliqueDesignTokenStatistics {
	total: number;
	semantic: number;
	html: number;
	component: number;
	unknown: number;
}

export type DesignTokenSourceReader = (path: string) => Promise<string>;

/** The generated Design System CSS could not be read or parsed safely. */
export class ObliqueDesignTokenSourceError extends Error {}

/**
 * Lazily reads the checked-out generated token stylesheet and indexes its CSS custom properties.
 */
export class ObliqueDesignTokenReader {
	private readonly repositoryRoot: string;
	private readonly readTokenSource: DesignTokenSourceReader;
	private index: Promise<readonly ObliqueDesignToken[]> | undefined;

	constructor(repositoryRoot = process.cwd(), readTokenSource: DesignTokenSourceReader = defaultReadTokenSource) {
		this.repositoryRoot = repositoryRoot;
		this.readTokenSource = readTokenSource;
	}

	async search(query: string, scope: ObliqueDesignTokenScope, limit: number): Promise<ObliqueDesignTokenSearch> {
		const trimmedQuery = query.trim();
		const queryTerms = normalizeQuery(trimmedQuery);
		const matches = (await this.getIndex())
			.filter(token => scope === 'all' || token.usableByProjects)
			.flatMap(token => {
				const rank = getSearchRank(token.name, trimmedQuery, queryTerms);
				return rank === undefined ? [] : [{token, rank}];
			})
			.sort(compareSearchResults);
		return {
			query: trimmedQuery,
			scope,
			total: matches.length,
			results: matches.slice(0, limit).map(match => match.token),
		};
	}

	async getStatistics(): Promise<ObliqueDesignTokenStatistics> {
		const index = await this.getIndex();
		return index.reduce((statistics, token) => ({...statistics, [token.tier]: statistics[token.tier] + 1}), {
			total: index.length,
			semantic: 0,
			html: 0,
			component: 0,
			unknown: 0,
		});
	}

	private getIndex(): Promise<readonly ObliqueDesignToken[]> {
		this.index ??= this.createIndex();
		return this.index;
	}

	private async createIndex(): Promise<readonly ObliqueDesignToken[]> {
		const sourcePath = resolve(this.repositoryRoot, tokenSourceRelativePath);
		try {
			return createTokenIndex(await this.readTokenSource(sourcePath));
		} catch (error) {
			if (error instanceof ObliqueDesignTokenSourceError) {
				throw error;
			}
			throw new ObliqueDesignTokenSourceError('Unable to read the generated Oblique Design System token source.');
		}
	}
}

interface ParsedCssDeclaration {
	name: string;
	selector: string;
	value: string;
}

interface RankedDesignToken {
	rank: number;
	token: ObliqueDesignToken;
}

function defaultReadTokenSource(path: string): Promise<string> {
	return readFile(path, 'utf8');
}

function createTokenIndex(source: string): readonly ObliqueDesignToken[] {
	const declarationsByName = new Map<string, ParsedCssDeclaration[]>();
	for (const declaration of parseCssDeclarations(source)) {
		const declarations = declarationsByName.get(declaration.name) ?? [];
		declarations.push(declaration);
		declarationsByName.set(declaration.name, declarations);
	}
	return [...declarationsByName.entries()]
		.map(([name, declarations]) => createDesignToken(name, declarations))
		.sort((first, second) => first.name.localeCompare(second.name, 'en'));
}

function createDesignToken(name: string, declarations: readonly ParsedCssDeclaration[]): ObliqueDesignToken {
	const baseDeclaration = declarations.find(declaration => declaration.selector === ':root') ?? declarations[0];
	const tier = getTokenTier(name);
	return {
		name,
		tier,
		usableByProjects: tier === 'semantic',
		value: baseDeclaration.value,
		references: getTokenReferences(baseDeclaration.value),
		overrides: declarations
			.filter(declaration => declaration !== baseDeclaration)
			.map(declaration => ({
				selector: declaration.selector,
				value: declaration.value,
				references: getTokenReferences(declaration.value),
			})),
		source: tokenSourceRelativePath,
	};
}

function getTokenTier(name: string): ObliqueDesignTokenTier {
	if (name.startsWith('--ob-s')) {
		return 'semantic';
	}
	if (name.startsWith('--ob-h-')) {
		return 'html';
	}
	if (name.startsWith('--ob-c-')) {
		return 'component';
	}
	return 'unknown';
}

function normalizeQuery(query: string): string[] {
	return query
		.trim()
		.toLocaleLowerCase()
		.split(/[\s_-]+/u)
		.filter(Boolean);
}

function getSearchRank(name: string, query: string, queryTerms: readonly string[]): number | undefined {
	const lowerCaseName = name.toLocaleLowerCase();
	const normalizedName = lowerCaseName.split(/[_-]+/u).filter(Boolean).join(' ');
	const normalizedQuery = queryTerms.join(' ');
	if (lowerCaseName === query.toLocaleLowerCase()) {
		return 0;
	}
	if (normalizedName === normalizedQuery) {
		return 1;
	}
	if (queryTerms.every(term => normalizedName.includes(term))) {
		return 2;
	}
	return queryTerms.some(term => normalizedName.includes(term)) ? 3 : undefined;
}

function compareSearchResults(first: RankedDesignToken, second: RankedDesignToken): number {
	return first.rank - second.rank || first.token.name.localeCompare(second.token.name, 'en');
}

function parseCssDeclarations(source: string): ParsedCssDeclaration[] {
	return new CssDeclarationScanner(stripCssComments(source)).parse();
}

function stripCssComments(source: string): string {
	let result = '';
	let quote: string | undefined;
	for (let index = 0; index < source.length; index += 1) {
		const character = source[index];
		if (quote !== undefined) {
			result += character;
			if (character === '\\') {
				if (index + 1 < source.length) {
					result += source[index + 1];
				}
				index += 1;
			} else if (character === quote) {
				quote = undefined;
			}
			continue;
		}
		if (character === '"' || character === "'") {
			quote = character;
			result += character;
			continue;
		}
		if (character === '/' && source[index + 1] === '*') {
			const endIndex = source.indexOf('*/', index + 2);
			if (endIndex === -1) {
				throw new ObliqueDesignTokenSourceError(
					'The generated Design System token source contains an unterminated comment.'
				);
			}
			result += maskCssComment(source.slice(index, endIndex + 2));
			index = endIndex + 1;
			continue;
		}
		result += character;
	}
	if (quote !== undefined) {
		throw new ObliqueDesignTokenSourceError(
			'The generated Design System token source contains an unterminated string.'
		);
	}
	return result;
}

function maskCssComment(comment: string): string {
	return [...comment].map(character => (character === '\n' ? '\n' : ' ')).join('');
}

class CssDeclarationScanner {
	private readonly source: string;
	private readonly declarations: ParsedCssDeclaration[] = [];

	constructor(source: string) {
		this.source = source;
	}

	parse(): ParsedCssDeclaration[] {
		this.parseScope(0, '', false);
		return this.declarations;
	}

	private parseScope(startIndex: number, selector: string, expectClosingBrace: boolean): number {
		let index = startIndex;
		let segmentStart = startIndex;
		let parenthesisDepth = 0;
		let quote: string | undefined;
		while (index < this.source.length) {
			const character = this.source[index];
			if (quote !== undefined) {
				if (character === '\\') {
					index += 2;
					continue;
				}
				if (character === quote) {
					quote = undefined;
				}
				index += 1;
				continue;
			}
			if (character === '"' || character === "'") {
				quote = character;
				index += 1;
				continue;
			}
			if (character === '(') {
				parenthesisDepth += 1;
				index += 1;
				continue;
			}
			if (character === ')') {
				parenthesisDepth -= 1;
				if (parenthesisDepth < 0) {
					throw new ObliqueDesignTokenSourceError(
						'The generated Design System token source contains an unexpected closing parenthesis.'
					);
				}
				index += 1;
				continue;
			}
			if (parenthesisDepth === 0 && character === '{') {
				const childSelector = this.source.slice(segmentStart, index).trim();
				if (!childSelector) {
					throw new ObliqueDesignTokenSourceError(
						'The generated Design System token source contains a selectorless block.'
					);
				}
				index = this.parseScope(index + 1, joinSelectors(selector, childSelector), true);
				segmentStart = index;
				continue;
			}
			if (parenthesisDepth === 0 && character === ';') {
				this.addDeclaration(this.source.slice(segmentStart, index), selector);
				index += 1;
				segmentStart = index;
				continue;
			}
			if (parenthesisDepth === 0 && character === '}') {
				if (!expectClosingBrace) {
					throw new ObliqueDesignTokenSourceError(
						'The generated Design System token source contains an unexpected closing brace.'
					);
				}
				this.addDeclaration(this.source.slice(segmentStart, index), selector);
				return index + 1;
			}
			index += 1;
		}
		if (parenthesisDepth !== 0 || expectClosingBrace) {
			throw new ObliqueDesignTokenSourceError(
				'The generated Design System token source contains an unterminated block or value.'
			);
		}
		this.addDeclaration(this.source.slice(segmentStart), selector);
		return index;
	}

	private addDeclaration(segment: string, selector: string): void {
		const trimmedSegment = segment.trim();
		if (!trimmedSegment || !trimmedSegment.startsWith('--')) {
			return;
		}
		const colonIndex = getTopLevelColonIndex(trimmedSegment);
		if (colonIndex === -1) {
			throw new ObliqueDesignTokenSourceError(
				'The generated Design System token source contains a malformed custom property.'
			);
		}
		const name = trimmedSegment.slice(0, colonIndex).trim();
		const value = trimmedSegment.slice(colonIndex + 1).trim();
		if (!name || !value || !selector) {
			throw new ObliqueDesignTokenSourceError(
				'The generated Design System token source contains an incomplete custom property.'
			);
		}
		this.declarations.push({name, selector, value});
	}
}

function joinSelectors(parentSelector: string, selector: string): string {
	return parentSelector ? `${parentSelector} ${selector}` : selector;
}

function getTopLevelColonIndex(value: string): number {
	return value.indexOf(':');
}

function getTokenReferences(value: string): string[] {
	const references = new Set<string>();
	for (let index = 0; index < value.length; index += 1) {
		if (value.slice(index, index + 4).toLocaleLowerCase() !== 'var(') {
			continue;
		}
		let referenceStart = index + 4;
		while (referenceStart < value.length && /\s/u.test(value[referenceStart])) {
			referenceStart += 1;
		}
		if (!value.startsWith('--', referenceStart)) {
			continue;
		}
		let referenceEnd = referenceStart + 2;
		while (referenceEnd < value.length && /[A-Za-z0-9_-]/u.test(value[referenceEnd])) {
			referenceEnd += 1;
		}
		references.add(value.slice(referenceStart, referenceEnd));
	}
	return [...references].sort((first, second) => first.localeCompare(second, 'en'));
}
