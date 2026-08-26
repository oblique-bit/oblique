/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 7 CSS and SCSS Design System token analysis tests
 */

import type {ObliqueDesignToken} from '../sources/design-system/design-token.reader.js';
import {type ObliqueStyleTokenReader, ObliqueStylesAnalyzer} from './oblique-styles.analyzer.js';

const tokenSource = 'projects/design-system/src/lib/css/layers/tokens.css' as const;

function createToken(name: string, tier: ObliqueDesignToken['tier'], value: string): ObliqueDesignToken {
	return {
		name,
		tier,
		usableByProjects: tier === 'semantic',
		value,
		references: [],
		overrides: [],
		source: tokenSource,
	};
}

const tokens = [
	createToken('--ob-s-known', 'semantic', '#ffffff'),
	createToken('--ob-s-spacing-a', 'semantic', '1rem'),
	createToken('--ob-s-spacing-b', 'semantic', '1rem'),
	createToken('--ob-h-button-example', 'html', '#ffffff'),
	createToken('--ob-c-button-example', 'component', '1rem'),
	createToken('--ob-unknown-example', 'unknown', '2px'),
];

function createAnalyzer(tokenIndex: readonly ObliqueDesignToken[] = tokens): ObliqueStylesAnalyzer {
	const reader: ObliqueStyleTokenReader = {
		getToken: async name => tokenIndex.find(token => token.name === name),
		findProjectTokensByValue: async value =>
			tokenIndex
				.filter(token => token.usableByProjects && normalizeValue(token.value) === normalizeValue(value))
				.sort((first, second) => first.name.localeCompare(second.name, 'en')),
	};
	return new ObliqueStylesAnalyzer(reader);
}

function normalizeValue(value: string): string {
	const trimmedValue = value.trim();
	return /^#[\dA-F]{3,8}$/iu.test(trimmedValue) ? trimmedValue.toLocaleLowerCase() : trimmedValue;
}

describe('ObliqueStylesAnalyzer', () => {
	it('accepts semantic tokens and application custom properties that reference them', async () => {
		await expect(
			createAnalyzer().analyze(
				`.card {
					--app-card-color: var(--ob-s-known);
					color: var(--app-card-color);
				}`,
				'css'
			)
		).resolves.toEqual({valid: true, summary: {errors: 0, warnings: 0, info: 0}, findings: []});
	});

	it('reports unknown, unknown-tier, HTML and component Oblique tokens without duplicate findings', async () => {
		const result = await createAnalyzer().analyze(
			`.card {
				color: var(--ob-s-does-not-exist);
				background: linear-gradient(var(--ob-h-button-example), var(--ob-c-button-example));
				border-color: var(--ob-unknown-example);
			}`,
			'css'
		);

		expect(result).toMatchObject({
			valid: false,
			summary: {errors: 4, warnings: 0, info: 0},
			findings: [
				{rule: 'OBLIQUE_UNKNOWN_DESIGN_TOKEN', token: '--ob-s-does-not-exist'},
				{rule: 'OBLIQUE_INTERNAL_DESIGN_TOKEN', token: '--ob-h-button-example'},
				{rule: 'OBLIQUE_INTERNAL_DESIGN_TOKEN', token: '--ob-c-button-example'},
				{rule: 'OBLIQUE_UNKNOWN_DESIGN_TOKEN', token: '--ob-unknown-example'},
			],
		});
	});

	it('warns on Oblique namespace overrides without adding a hardcoded-value finding', async () => {
		const result = await createAnalyzer().analyze(
			`:root { --ob-s-known: #fff; }
			.component { --ob-project-custom: 1rem; }`,
			'css'
		);

		expect(result).toMatchObject({
			valid: true,
			summary: {errors: 0, warnings: 2, info: 0},
			findings: [
				{rule: 'OBLIQUE_DESIGN_TOKEN_OVERRIDE', token: '--ob-s-known'},
				{rule: 'OBLIQUE_DESIGN_TOKEN_OVERRIDE', token: '--ob-project-custom'},
			],
		});
	});

	it('returns all deterministic semantic candidates for exact simple hardcoded values only', async () => {
		const result = await createAnalyzer().analyze(
			`.card {
				gap: 1rem;
				color: #FFFFFF;
				padding: 0.99rem;
				margin: 0 1rem;
				padding-top: calc(1rem + 2px);
				background: linear-gradient(#ffffff, #000000);
			}`,
			'css'
		);

		expect(result).toMatchObject({
			valid: true,
			summary: {errors: 0, warnings: 2, info: 0},
			findings: [
				{
					rule: 'OBLIQUE_HARDCODED_TOKEN_VALUE',
					property: 'gap',
					candidates: [
						{name: '--ob-s-spacing-a', value: '1rem'},
						{name: '--ob-s-spacing-b', value: '1rem'},
					],
				},
				{
					rule: 'OBLIQUE_HARDCODED_TOKEN_VALUE',
					property: 'color',
					candidates: [{name: '--ob-s-known', value: '#ffffff'}],
				},
			],
		});
	});

	it('does not evaluate CSS variable fallbacks, strings, comments, dynamic interpolation or Sass variables', async () => {
		const result = await createAnalyzer().analyze(
			`// var(--ob-h-button-example)
			$gap: 1rem;
			.card {
				color: var(--ob-s-known, #ffffff);
				content: "var(--ob-h-button-example)";
				padding: $gap;
				border-color: var(--ob-s-#{$name});
			}`,
			'scss'
		);

		expect(result).toEqual({valid: true, summary: {errors: 0, warnings: 0, info: 0}, findings: []});
	});

	it('ignores escaped string content and accepts whitespace in static var arguments', async () => {
		await expect(
			createAnalyzer().analyze(
				`.card {
					content: "escaped \\"var(--ob-h-button-example)\\"";
					color: var( --ob-s-known );
				}`,
				'css'
			)
		).resolves.toEqual({valid: true, summary: {errors: 0, warnings: 0, info: 0}, findings: []});
	});

	it('parses nested SCSS rules and mixins without compiling Sass', async () => {
		await expect(
			createAnalyzer().analyze(
				`$gap: 1rem;
				@mixin example($value) { padding: $value; }
				.card {
					@include example(1rem);
					&:hover { color: var(--ob-s-known); }
				}`,
				'scss'
			)
		).resolves.toEqual({valid: true, summary: {errors: 0, warnings: 0, info: 0}, findings: []});
	});

	it.each([
		['css', '.card {\n color: var(--ob-s-known);'],
		['scss', '.card {\n color: var(--ob-s-known);'],
	] as const)('returns only a syntax finding for malformed %s source', async (language, code) => {
		const result = await createAnalyzer().analyze(code, language);

		expect(result.valid).toBe(false);
		expect(result.summary).toEqual({errors: 1, warnings: 0, info: 0});
		expect(result.findings[0]?.rule).toBe('STYLE_SYNTAX_ERROR');
		expect(result.findings[0]?.severity).toBe('error');
		expect(result.findings[0]?.location.line).toBe(1);
		expect(result.findings[0]?.location.column).toBeGreaterThan(0);
	});

	it('keeps parser-provided multiline syntax locations', async () => {
		const result = await createAnalyzer().analyze('.card {}\n}', 'css');

		expect(result).toMatchObject({
			valid: false,
			findings: [{rule: 'STYLE_SYNTAX_ERROR', location: {line: 2, column: 1}}],
		});
	});

	it('keeps findings in source order with precise token locations', async () => {
		const result = await createAnalyzer().analyze(
			`.card {
				color: var(--ob-s-does-not-exist);
				--ob-project-custom: 1rem;
				background: var(--ob-h-button-example);
			}`,
			'css'
		);

		expect(result.findings.map(finding => finding.rule)).toEqual([
			'OBLIQUE_UNKNOWN_DESIGN_TOKEN',
			'OBLIQUE_DESIGN_TOKEN_OVERRIDE',
			'OBLIQUE_INTERNAL_DESIGN_TOKEN',
		]);
		expect(result.findings[0]?.location).toEqual({line: 2, column: 16});
	});
});
