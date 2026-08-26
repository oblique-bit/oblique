/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 7 CSS and SCSS Design System token analysis tool tests
 */

import type {McpServer} from '@modelcontextprotocol/server';
import {type ObliqueStyleTokenReader, ObliqueStylesAnalyzer} from '../analyzers/oblique-styles.analyzer.js';
import {
	checkObliqueStylesResultSchema,
	checkObliqueStylesSchema,
	getObliqueStyleCheck,
	maximumObliqueStyleCodeLength,
	registerObliqueStylesTool,
} from './check-oblique-styles.js';

type RegisteredCallback = (arguments_: {code: string; language: 'css' | 'scss'}) => Promise<unknown>;

const reader: ObliqueStyleTokenReader = {
	getToken: async () => undefined,
	findProjectTokensByValue: async () => [],
};

describe('check_oblique_styles tool', () => {
	it('uses strict bounded input and structured output schemas', () => {
		expect(checkObliqueStylesSchema.parse({code: '.card {}'})).toEqual({code: '.card {}', language: 'scss'});
		expect(checkObliqueStylesSchema.safeParse({code: ''}).success).toBe(false);
		expect(checkObliqueStylesSchema.safeParse({code: 'x'.repeat(maximumObliqueStyleCodeLength)}).success).toBe(true);
		expect(checkObliqueStylesSchema.safeParse({code: 'x'.repeat(maximumObliqueStyleCodeLength + 1)}).success).toBe(
			false
		);
		expect(checkObliqueStylesSchema.safeParse({code: '.card {}', path: '../../tokens.css'}).success).toBe(false);
		expect(
			checkObliqueStylesResultSchema.parse({valid: true, summary: {errors: 0, warnings: 0, info: 0}, findings: []})
		).toEqual({valid: true, summary: {errors: 0, warnings: 0, info: 0}, findings: []});
	});

	it('registers the read-only parser tool and serializes its analysis', async () => {
		const registerTool = jest.fn();
		const server = {registerTool} as unknown as McpServer;

		registerObliqueStylesTool(server, reader);

		expect(registerTool).toHaveBeenCalledWith(
			'check_oblique_styles',
			expect.objectContaining({inputSchema: checkObliqueStylesSchema, outputSchema: checkObliqueStylesResultSchema}),
			expect.any(Function)
		);
		const callback = registerTool.mock.calls[0]?.[2] as RegisteredCallback;
		expect(await callback({code: '.card { color: var(--ob-s-unknown); }', language: 'css'})).toMatchObject({
			structuredContent: {valid: false, findings: [{rule: 'OBLIQUE_UNKNOWN_DESIGN_TOKEN'}]},
		});
	});

	it('provides an awaitable direct analysis helper without file input', async () => {
		const analyzer = new ObliqueStylesAnalyzer(reader);

		await expect(getObliqueStyleCheck(analyzer, '.card {}', 'scss')).resolves.toEqual({
			valid: true,
			summary: {errors: 0, warnings: 0, info: 0},
			findings: [],
		});
	});
});
