/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 5 TypeScript static-analysis tool
 */

import type {McpServer} from '@modelcontextprotocol/server';
import {z as schema} from 'zod/v4';
import {
	type ObliqueCodeAnalysis,
	ObliqueCodeAnalyzer,
	type ObliqueCodePublicApiReader,
} from '../analyzers/oblique-code.analyzer.js';
import {type PackageMetadata, getObliqueVersion} from './get-oblique-version.js';

export const maximumObliqueCodeLength = 100_000;

export const checkObliqueCodeSchema = schema
	.object({
		code: schema.string().min(1).max(maximumObliqueCodeLength),
	})
	.strict();

export const checkObliqueCodeResultSchema = schema.object({
	obliqueVersion: schema.string(),
	valid: schema.boolean(),
	summary: schema.object({errors: schema.number(), warnings: schema.number(), info: schema.number()}),
	findings: schema.array(
		schema.object({
			rule: schema.enum([
				'OBLIQUE_DEFAULT_IMPORT',
				'OBLIQUE_DEPRECATED_PUBLIC_SYMBOL',
				'OBLIQUE_INTERNAL_IMPORT',
				'OBLIQUE_UNKNOWN_PUBLIC_SYMBOL',
				'TYPESCRIPT_SYNTAX_ERROR',
			]),
			severity: schema.enum(['error', 'warning', 'info']),
			message: schema.string(),
			symbol: schema.string().optional(),
			module: schema.string().optional(),
			location: schema.object({line: schema.number(), column: schema.number()}),
			recommendation: schema.string(),
		})
	),
});

export interface ObliqueCodeCheck extends ObliqueCodeAnalysis {
	obliqueVersion: string;
}

export function registerObliqueCodeTool(
	server: McpServer,
	publicApiReader: ObliqueCodePublicApiReader,
	readPackageMetadata: () => Promise<PackageMetadata>
): void {
	const analyzer = new ObliqueCodeAnalyzer(publicApiReader);
	server.registerTool(
		'check_oblique_code',
		{
			description:
				'Parse submitted TypeScript without executing it and check Oblique public API imports against the embedded snapshot.',
			inputSchema: checkObliqueCodeSchema,
			outputSchema: checkObliqueCodeResultSchema,
		},
		async ({code}) => {
			const result = getObliqueCodeCheck(analyzer, code, await readPackageMetadata());
			return {content: [{type: 'text', text: JSON.stringify(result)}], structuredContent: result};
		}
	);
}

export function getObliqueCodeCheck(
	analyzer: ObliqueCodeAnalyzer,
	code: string,
	packageMetadata: PackageMetadata
): ObliqueCodeCheck {
	return {
		obliqueVersion: getObliqueVersion(packageMetadata).obliqueVersion,
		...analyzer.analyze(code),
	};
}
