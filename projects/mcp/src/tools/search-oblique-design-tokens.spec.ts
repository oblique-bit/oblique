/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 6 Design System token search tool tests
 */

import type {McpServer} from '@modelcontextprotocol/server';
import {
	type ObliqueDesignTokenReader,
	ObliqueDesignTokenSourceError,
} from '../sources/design-system/design-token.reader.js';
import {
	defaultDesignTokenSearchLimit,
	designTokenSearchResultSchema,
	designTokenSearchSchema,
	getDesignTokenSearchResponse,
	maximumDesignTokenQueryLength,
	registerDesignTokenSearchTool,
} from './search-oblique-design-tokens.js';

const tokenSearchResult = {
	query: 'color',
	scope: 'project' as const,
	total: 1,
	results: [
		{
			name: '--ob-s-color-example',
			tier: 'semantic' as const,
			usableByProjects: true,
			value: '#fff',
			references: [],
			overrides: [],
			source: 'projects/design-system/src/lib/css/layers/tokens.css' as const,
		},
	],
};

type RegisteredCallback = (arguments_: {query: string; scope: 'project' | 'all'; limit: number}) => Promise<unknown>;

describe('search_oblique_design_tokens tool', () => {
	it('uses strict bounded input and deterministic structured output schemas', () => {
		expect(designTokenSearchSchema.parse({query: ' color '})).toEqual({
			query: 'color',
			scope: 'project',
			limit: defaultDesignTokenSearchLimit,
		});
		expect(designTokenSearchSchema.safeParse({query: ''}).success).toBe(false);
		expect(designTokenSearchSchema.safeParse({query: 'x'.repeat(maximumDesignTokenQueryLength + 1)}).success).toBe(
			false
		);
		expect(designTokenSearchSchema.safeParse({query: 'color', limit: 101}).success).toBe(false);
		expect(designTokenSearchSchema.safeParse({query: 'color', path: '../../tokens.css'}).success).toBe(false);
		expect(designTokenSearchResultSchema.parse(tokenSearchResult)).toEqual(tokenSearchResult);
	});

	it('returns source failures as clean MCP errors and rethrows unexpected failures', async () => {
		const sourceReader = {
			search: jest.fn().mockRejectedValue(new ObliqueDesignTokenSourceError('Malformed Design System token source.')),
		} as unknown as ObliqueDesignTokenReader;
		const reader = {
			search: jest.fn().mockRejectedValue(new Error('unexpected')),
		} as unknown as ObliqueDesignTokenReader;

		await expect(getDesignTokenSearchResponse(sourceReader, 'color', 'project', 20)).resolves.toEqual({
			content: [{type: 'text', text: 'Malformed Design System token source.'}],
			isError: true,
		});
		await expect(getDesignTokenSearchResponse(reader, 'color', 'project', 20)).rejects.toThrow('unexpected');
	});

	it('registers the read-only token search tool and serializes reader results', async () => {
		const search = jest.fn().mockResolvedValue(tokenSearchResult);
		const reader = {search} as unknown as ObliqueDesignTokenReader;
		const registerTool = jest.fn();
		const server = {registerTool} as unknown as McpServer;

		registerDesignTokenSearchTool(server, reader);

		expect(registerTool).toHaveBeenCalledWith(
			'search_oblique_design_tokens',
			expect.objectContaining({inputSchema: designTokenSearchSchema, outputSchema: designTokenSearchResultSchema}),
			expect.any(Function)
		);
		const callback = registerTool.mock.calls[0]?.[2] as RegisteredCallback;
		expect(await callback({query: 'color', scope: 'project', limit: 20})).toEqual({
			content: [{type: 'text', text: JSON.stringify(tokenSearchResult)}],
			structuredContent: tokenSearchResult,
		});
		expect(search).toHaveBeenCalledWith('color', 'project', 20);
	});

	it('can create its reader without an injected dependency', () => {
		const registerTool = jest.fn();

		registerDesignTokenSearchTool({registerTool} as unknown as McpServer);

		expect(registerTool).toHaveBeenCalledWith('search_oblique_design_tokens', expect.any(Object), expect.any(Function));
	});
});
