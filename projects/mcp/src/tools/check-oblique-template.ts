/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 8 read-only Angular template public API analysis tool
 */

import type {McpServer} from '@modelcontextprotocol/server';
import {z as schema} from 'zod/v4';
import {
	type ObliqueTemplateAnalysis,
	ObliqueTemplateAnalyzer,
	type ObliqueTemplatePublicApiReader,
} from '../analyzers/oblique-template.analyzer.js';
import {type PackageMetadata, getObliqueVersion} from './get-oblique-version.js';

export const maximumObliqueTemplateCodeLength = 100_000;

export const checkObliqueTemplateSchema = schema
	.object({
		code: schema
			.string()
			.refine(code => code.trim().length > 0, 'Expected a non-empty Angular template.')
			.max(maximumObliqueTemplateCodeLength),
		bindingDiagnostics: schema.enum(['safe', 'verbose']).default('safe'),
	})
	.strict();

export const checkObliqueTemplateResultSchema = schema.object({
	obliqueVersion: schema.string(),
	valid: schema.boolean(),
	summary: schema.object({errors: schema.number(), warnings: schema.number(), info: schema.number()}),
	findings: schema.array(
		schema.object({
			rule: schema.enum([
				'OBLIQUE_DEPRECATED_TEMPLATE_API',
				'OBLIQUE_DEPRECATED_TEMPLATE_BINDING',
				'OBLIQUE_MISSING_REQUIRED_INPUT',
				'OBLIQUE_UNKNOWN_COMPONENT_SELECTOR',
				'OBLIQUE_UNRECOGNIZED_INPUT_BINDING',
				'TEMPLATE_SYNTAX_ERROR',
			]),
			severity: schema.enum(['error', 'warning', 'info']),
			message: schema.string(),
			selector: schema.string().optional(),
			symbol: schema.string().optional(),
			binding: schema.string().optional(),
			bindingKind: schema.enum(['input', 'output', 'two-way']).optional(),
			location: schema.object({line: schema.number(), column: schema.number()}),
			recommendation: schema.string(),
		})
	),
});

export interface ObliqueTemplateCheck extends ObliqueTemplateAnalysis {
	obliqueVersion: string;
}

export function registerObliqueTemplateTool(
	server: McpServer,
	publicApiReader: ObliqueTemplatePublicApiReader,
	readPackageMetadata: () => Promise<PackageMetadata>
): void {
	const analyzer = new ObliqueTemplateAnalyzer(publicApiReader);
	server.registerTool(
		'check_oblique_template',
		{
			description:
				'Parse submitted Angular template text without executing it and check public Oblique component selectors and deprecated template APIs.',
			inputSchema: checkObliqueTemplateSchema,
			outputSchema: checkObliqueTemplateResultSchema,
		},
		async ({code, bindingDiagnostics}) => {
			const result = getObliqueTemplateCheck(analyzer, {code, bindingDiagnostics}, await readPackageMetadata());
			return {content: [{type: 'text', text: JSON.stringify(result)}], structuredContent: result};
		}
	);
}

export function getObliqueTemplateCheck(
	analyzer: ObliqueTemplateAnalyzer,
	request: {code: string; bindingDiagnostics?: 'safe' | 'verbose'},
	packageMetadata: PackageMetadata
): ObliqueTemplateCheck {
	return {
		obliqueVersion: getObliqueVersion(packageMetadata).obliqueVersion,
		...analyzer.analyze(request.code, request.bindingDiagnostics),
	};
}
