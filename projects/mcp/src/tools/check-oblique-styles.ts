/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 7 read-only CSS and SCSS Design System token analysis tool
 */

import type {McpServer} from '@modelcontextprotocol/server';
import {z as schema} from 'zod/v4';
import {
	type ObliqueStyleAnalysis,
	type ObliqueStyleTokenReader,
	ObliqueStylesAnalyzer,
} from '../analyzers/oblique-styles.analyzer.js';

export const maximumObliqueStyleCodeLength = 100_000;

export const checkObliqueStylesSchema = schema
	.object({
		code: schema.string().min(1).max(maximumObliqueStyleCodeLength),
		language: schema.enum(['css', 'scss']).default('scss'),
	})
	.strict();

export const checkObliqueStylesResultSchema = schema.object({
	valid: schema.boolean(),
	summary: schema.object({errors: schema.number(), warnings: schema.number(), info: schema.number()}),
	findings: schema.array(
		schema.object({
			rule: schema.enum([
				'OBLIQUE_DESIGN_TOKEN_OVERRIDE',
				'OBLIQUE_HARDCODED_TOKEN_VALUE',
				'OBLIQUE_INTERNAL_DESIGN_TOKEN',
				'OBLIQUE_UNKNOWN_DESIGN_TOKEN',
				'STYLE_SYNTAX_ERROR',
			]),
			severity: schema.enum(['error', 'warning', 'info']),
			message: schema.string(),
			token: schema.string().optional(),
			property: schema.string().optional(),
			value: schema.string().optional(),
			candidates: schema.array(schema.object({name: schema.string(), value: schema.string()})).optional(),
			location: schema.object({line: schema.number(), column: schema.number()}),
			recommendation: schema.string().optional(),
		})
	),
});

export function registerObliqueStylesTool(server: McpServer, designTokenReader: ObliqueStyleTokenReader): void {
	const analyzer = new ObliqueStylesAnalyzer(designTokenReader);
	server.registerTool(
		'check_oblique_styles',
		{
			description:
				'Parse submitted CSS or SCSS without executing it and check Oblique Design System token usage against the embedded snapshot.',
			inputSchema: checkObliqueStylesSchema,
			outputSchema: checkObliqueStylesResultSchema,
		},
		async ({code, language}) => {
			const result = await analyzer.analyze(code, language);
			return {content: [{type: 'text', text: JSON.stringify(result)}], structuredContent: result};
		}
	);
}

export async function getObliqueStyleCheck(
	analyzer: ObliqueStylesAnalyzer,
	code: string,
	language: 'css' | 'scss'
): Promise<ObliqueStyleAnalysis> {
	const result = await analyzer.analyze(code, language);
	return result;
}
