/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 7 read-only CSS and SCSS Design System token analysis
 */

import postcss, {type Declaration, type Root} from 'postcss';
import {parse as parseScss} from 'postcss-scss';
import type {ObliqueDesignToken} from '../sources/design-system/design-token.reader.js';

const obliqueTokenPrefix = '--ob-';
const supportedValueProperties = new Set([
	'background-color',
	'border-color',
	'border-radius',
	'border-width',
	'caret-color',
	'color',
	'column-gap',
	'fill',
	'font-size',
	'gap',
	'letter-spacing',
	'line-height',
	'margin',
	'margin-bottom',
	'margin-left',
	'margin-right',
	'margin-top',
	'outline-color',
	'padding',
	'padding-bottom',
	'padding-left',
	'padding-right',
	'padding-top',
	'row-gap',
	'stroke',
	'text-shadow',
	'box-shadow',
]);

export type ObliqueStyleLanguage = 'css' | 'scss';
export type ObliqueStyleFindingRule =
	| 'OBLIQUE_DESIGN_TOKEN_OVERRIDE'
	| 'OBLIQUE_HARDCODED_TOKEN_VALUE'
	| 'OBLIQUE_INTERNAL_DESIGN_TOKEN'
	| 'OBLIQUE_UNKNOWN_DESIGN_TOKEN'
	| 'STYLE_SYNTAX_ERROR';
export type ObliqueStyleFindingSeverity = 'error' | 'warning';

export interface ObliqueStyleLocation {
	line: number;
	column: number;
}

export interface ObliqueStyleTokenCandidate {
	name: string;
	value: string;
}

export interface ObliqueStyleFinding {
	rule: ObliqueStyleFindingRule;
	severity: ObliqueStyleFindingSeverity;
	message: string;
	location: ObliqueStyleLocation;
	token?: string;
	property?: string;
	value?: string;
	candidates?: ObliqueStyleTokenCandidate[];
	recommendation?: string;
}

export interface ObliqueStyleSummary {
	errors: number;
	warnings: number;
	info: number;
}

export interface ObliqueStyleAnalysis {
	valid: boolean;
	summary: ObliqueStyleSummary;
	findings: ObliqueStyleFinding[];
}

export interface ObliqueStyleTokenReader {
	getToken: (name: string) => Promise<ObliqueDesignToken | undefined>;
	findProjectTokensByValue: (value: string) => Promise<readonly ObliqueDesignToken[]>;
}

interface PositionedFinding extends ObliqueStyleFinding {
	position: number;
}

interface TokenReference {
	name: string;
	offset: number;
}

/** Parses submitted styles in memory without compiling Sass, resolving imports, or executing source. */
export class ObliqueStylesAnalyzer {
	private readonly designTokenReader: ObliqueStyleTokenReader;

	constructor(designTokenReader: ObliqueStyleTokenReader) {
		this.designTokenReader = designTokenReader;
	}

	async analyze(code: string, language: ObliqueStyleLanguage): Promise<ObliqueStyleAnalysis> {
		let root: Root;
		try {
			root = parseStyles(code, language);
		} catch (error) {
			return createSyntaxErrorAnalysis(code, error);
		}

		const findings = await getStyleFindings(root, code, this.designTokenReader);
		const sortedFindings = findings.sort(compareFindings);
		const summary = getSummary(sortedFindings);
		return {valid: summary.errors === 0, summary, findings: sortedFindings.map(toFinding)};
	}
}

function parseStyles(code: string, language: ObliqueStyleLanguage): Root {
	return language === 'scss' ? parseScss(code, {from: undefined}) : postcss.parse(code, {from: undefined});
}

async function getStyleFindings(
	root: Root,
	code: string,
	designTokenReader: ObliqueStyleTokenReader
): Promise<PositionedFinding[]> {
	const findings: PositionedFinding[] = [];
	for (const declaration of getDeclarations(root)) {
		if (declaration.prop.startsWith(obliqueTokenPrefix)) {
			findings.push(createOverrideFinding(code, declaration));
			continue;
		}
		for (const reference of getTokenReferences(declaration.value)) {
			if (reference.name.startsWith(obliqueTokenPrefix)) {
				findings.push(...(await getTokenReferenceFindings(code, declaration, reference, designTokenReader)));
			}
		}
		const hardcodedFinding = await getHardcodedValueFinding(code, declaration, designTokenReader);
		if (hardcodedFinding !== undefined) {
			findings.push(hardcodedFinding);
		}
	}
	return findings;
}

function getDeclarations(root: Root): Declaration[] {
	const declarations: Declaration[] = [];
	root.walkDecls(declaration => {
		declarations.push(declaration);
	});
	return declarations;
}

async function getTokenReferenceFindings(
	code: string,
	declaration: Declaration,
	reference: TokenReference,
	designTokenReader: ObliqueStyleTokenReader
): Promise<PositionedFinding[]> {
	const token = await designTokenReader.getToken(reference.name);
	const position = getValuePosition(code, declaration, reference.offset);
	if (token === undefined || token.tier === 'unknown') {
		return [
			createFinding(code, position, {
				rule: 'OBLIQUE_UNKNOWN_DESIGN_TOKEN',
				severity: 'error',
				message: `"${reference.name}" is not a supported Oblique Design System token.`,
				token: reference.name,
				property: declaration.prop,
				recommendation: 'Use a checked-out Oblique semantic token or an application-owned custom property.',
			}),
		];
	}
	if (!token.usableByProjects && (token.tier === 'html' || token.tier === 'component')) {
		return [
			createFinding(code, position, {
				rule: 'OBLIQUE_INTERNAL_DESIGN_TOKEN',
				severity: 'error',
				message: `"${reference.name}" is an internal Oblique ${token.tier} token and is not supported for project use.`,
				token: reference.name,
				property: declaration.prop,
				recommendation: 'Use a project-usable Oblique semantic token instead.',
			}),
		];
	}
	return [];
}

async function getHardcodedValueFinding(
	code: string,
	declaration: Declaration,
	designTokenReader: ObliqueStyleTokenReader
): Promise<PositionedFinding | undefined> {
	if (!supportedValueProperties.has(declaration.prop) || !isSimpleHardcodedValue(declaration.value)) {
		return undefined;
	}
	const candidates = await designTokenReader.findProjectTokensByValue(declaration.value);
	if (candidates.length === 0) {
		return undefined;
	}
	return createFinding(code, getValuePosition(code, declaration, 0), {
		rule: 'OBLIQUE_HARDCODED_TOKEN_VALUE',
		severity: 'warning',
		message:
			'This value exactly matches one or more project-usable Oblique semantic token values; candidates are not guaranteed semantic replacements.',
		property: declaration.prop,
		value: declaration.value.trim(),
		candidates: candidates.map(toCandidate),
		recommendation:
			'Consider the matching semantic-token candidates only after confirming their intended semantic meaning.',
	});
}

function createOverrideFinding(code: string, declaration: Declaration): PositionedFinding {
	return createFinding(code, getDeclarationPosition(declaration), {
		rule: 'OBLIQUE_DESIGN_TOKEN_OVERRIDE',
		severity: 'warning',
		message: `"${declaration.prop}" is in the Oblique-owned CSS custom-property namespace and should not be overridden or defined by projects.`,
		token: declaration.prop,
		property: declaration.prop,
		recommendation: 'Define application custom properties outside the "--ob-" namespace.',
	});
}

function getTokenReferences(value: string): TokenReference[] {
	const references: TokenReference[] = [];
	for (let index = 0; index < value.length; index += 1) {
		if (value[index] === '"' || value[index] === "'") {
			index = skipQuotedValue(value, index);
			continue;
		}
		if (!isVarFunctionAt(value, index)) {
			continue;
		}
		const argumentStart = skipWhitespace(value, index + 4);
		const argumentEnd = getVarArgumentEnd(value, argumentStart);
		const name = value.slice(argumentStart, argumentEnd);
		if (isStaticCustomPropertyName(name)) {
			references.push({name, offset: argumentStart});
		}
	}
	return references;
}

function isVarFunctionAt(value: string, index: number): boolean {
	return value.slice(index, index + 4).toLocaleLowerCase() === 'var(';
}

function skipQuotedValue(value: string, start: number): number {
	const quote = value[start];
	let index = start + 1;
	while (index < value.length) {
		if (value[index] === '\\') {
			index += 2;
			continue;
		}
		if (value[index] === quote) {
			return index;
		}
		index += 1;
	}
	/* istanbul ignore next -- PostCSS rejects unterminated declaration strings before value scanning. */
	return value.length;
}

function skipWhitespace(value: string, start: number): number {
	let index = start;
	while (index < value.length && /\s/u.test(value[index])) {
		index += 1;
	}
	return index;
}

function getVarArgumentEnd(value: string, start: number): number {
	let index = start;
	while (index < value.length && value[index] !== ',' && value[index] !== ')') {
		index += 1;
	}
	return index;
}

function isStaticCustomPropertyName(name: string): boolean {
	return /^--[A-Za-z_][A-Za-z\d_-]*$/u.test(name) && !name.includes('#{');
}

function isSimpleHardcodedValue(value: string): boolean {
	const trimmedValue = value.trim();
	return (
		Boolean(trimmedValue) &&
		!/[\s,"']/u.test(trimmedValue) &&
		!/[()$]/u.test(trimmedValue) &&
		!trimmedValue.includes('#{')
	);
}

function toCandidate(token: ObliqueDesignToken): ObliqueStyleTokenCandidate {
	return {name: token.name, value: token.value};
}

function getDeclarationPosition(declaration: Declaration): number {
	return declaration.source!.start!.offset;
}

function getValuePosition(code: string, declaration: Declaration, valueOffset: number): number {
	const declarationPosition = getDeclarationPosition(declaration);
	const valuePosition = code.indexOf(declaration.value, declarationPosition);
	/* istanbul ignore next -- PostCSS declaration values originate from the submitted source text. */
	return valuePosition === -1 ? declarationPosition : valuePosition + valueOffset;
}

function createSyntaxErrorAnalysis(code: string, error: unknown): ObliqueStyleAnalysis {
	const syntaxError = getSyntaxError(error);
	const position = getPositionFromLineAndColumn(code, syntaxError.line, syntaxError.column);
	const finding = createFinding(code, position, {
		rule: 'STYLE_SYNTAX_ERROR',
		severity: 'error',
		message: syntaxError.message,
		recommendation: 'Correct the CSS or SCSS syntax before checking Oblique Design System token usage.',
	});
	return {valid: false, summary: {errors: 1, warnings: 0, info: 0}, findings: [toFinding(finding)]};
}

function getSyntaxError(error: unknown): {message: string; line: number; column: number} {
	/* istanbul ignore else -- PostCSS parsers throw CssSyntaxError instances for parse failures. */
	if (error instanceof postcss.CssSyntaxError) {
		return {message: error.reason, line: error.line!, column: error.column!};
	}
	/* istanbul ignore next -- Defensive fallback for a non-PostCSS parser failure. */
	return {
		message: error instanceof Error ? error.message : 'Unable to parse the submitted CSS or SCSS.',
		line: 1,
		column: 1,
	};
}

function createFinding(
	code: string,
	position: number,
	finding: Omit<ObliqueStyleFinding, 'location'>
): PositionedFinding {
	return {...finding, location: getLocation(code, position), position};
}

function getPositionFromLineAndColumn(code: string, line: number, column: number): number {
	let currentLine = 1;
	let position = 0;
	while (currentLine < line && position < code.length) {
		if (code[position] === '\n') {
			currentLine += 1;
		}
		position += 1;
	}
	return position + column - 1;
}

function getLocation(code: string, position: number): ObliqueStyleLocation {
	const boundedPosition = Math.max(0, Math.min(position, code.length));
	const beforePosition = code.slice(0, boundedPosition);
	const line = beforePosition.split('\n').length;
	const lastNewline = beforePosition.lastIndexOf('\n');
	return {line, column: boundedPosition - lastNewline};
}

function compareFindings(first: PositionedFinding, second: PositionedFinding): number {
	return first.position - second.position;
}

function getSummary(findings: readonly PositionedFinding[]): ObliqueStyleSummary {
	return findings.reduce(
		(summary, finding) => {
			if (finding.severity === 'error') {
				summary.errors += 1;
			} else {
				summary.warnings += 1;
			}
			return summary;
		},
		{errors: 0, warnings: 0, info: 0}
	);
}

function toFinding({position, ...finding}: PositionedFinding): ObliqueStyleFinding {
	void position;
	return finding;
}
