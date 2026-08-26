/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 6 Design System token search tool
 */

import type {McpServer} from '@modelcontextprotocol/server';
import {z as schema} from 'zod/v4';
import {
	ObliqueDesignTokenReader,
	type ObliqueDesignTokenSearch,
	ObliqueDesignTokenSourceError,
} from '../sources/design-system/design-token.reader.js';

export const defaultDesignTokenSearchLimit = 20;
export const maximumDesignTokenSearchLimit = 100;
export const maximumDesignTokenQueryLength = 200;

export const designTokenSearchSchema = schema
	.object({
		query: schema.string().trim().min(1).max(maximumDesignTokenQueryLength),
		limit: schema.number().int().min(1).max(maximumDesignTokenSearchLimit).default(defaultDesignTokenSearchLimit),
		scope: schema.enum(['project', 'all']).default('project'),
	})
	.strict();

export const designTokenSearchResultSchema = schema.object({
	query: schema.string(),
	scope: schema.enum(['project', 'all']),
	total: schema.number(),
	results: schema.array(
		schema.object({
			name: schema.string(),
			tier: schema.enum(['semantic', 'html', 'component', 'unknown']),
			usableByProjects: schema.boolean(),
			value: schema.string(),
			references: schema.array(schema.string()),
			overrides: schema.array(
				schema.object({selector: schema.string(), value: schema.string(), references: schema.array(schema.string())})
			),
			source: schema.string(),
		})
	),
});

export function registerDesignTokenSearchTool(
	server: McpServer,
	designTokenReader = new ObliqueDesignTokenReader()
): void {
	server.registerTool(
		'search_oblique_design_tokens',
		{
			description:
				'Search checked-out Oblique Design System CSS tokens. Project scope returns only supported semantic tokens.',
			inputSchema: designTokenSearchSchema,
			outputSchema: designTokenSearchResultSchema,
		},
		async ({query, limit, scope}) => getDesignTokenSearchResponse(designTokenReader, query, scope, limit)
	);
}

export async function getDesignTokenSearchResponse(
	designTokenReader: ObliqueDesignTokenReader,
	query: string,
	scope: 'project' | 'all',
	limit: number
): Promise<{
	content: {type: 'text'; text: string}[];
	structuredContent?: ObliqueDesignTokenSearch;
	isError?: true;
}> {
	try {
		const result = await designTokenReader.search(query, scope, limit);
		return {content: [{type: 'text', text: JSON.stringify(result)}], structuredContent: result};
	} catch (error) {
		if (error instanceof ObliqueDesignTokenSourceError) {
			return {content: [{type: 'text', text: error.message}], isError: true};
		}
		throw error;
	}
}
