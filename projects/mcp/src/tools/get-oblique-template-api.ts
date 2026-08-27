/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 10 public Angular template API metadata tool
 */

import type {McpServer} from '@modelcontextprotocol/server';
import {z as schema} from 'zod/v4';
import {
	type ObliqueAngularTemplateApi,
	type ObliqueAngularTemplateInput,
	type ObliqueAngularTemplateOutput,
	type ObliqueApiSymbol,
	isTypeScriptIdentifier,
} from '../sources/oblique/public-api.reader.js';
import {type PackageMetadata, getObliqueVersion} from './get-oblique-version.js';

const obliquePackageImport = '@oblique/oblique';
const maximumSelectorLength = 500;

export interface ObliqueTemplateApiPublicReader {
	getApi: (symbol: string) => ObliqueApiSymbol | undefined;
	getAngularTemplateApis: () => readonly ObliqueAngularTemplateApi[];
}

export interface ObliqueTemplateApiInput {
	name: string;
	propertyName: string;
	required: boolean;
	deprecated: boolean;
	documentation: string | null;
	declaredIn: string;
}

export interface ObliqueTemplateApiOutput {
	name: string;
	propertyName: string;
	deprecated: boolean;
	documentation: string | null;
	declaredIn: string;
}

export interface ObliqueTemplateApiMatch {
	symbol: string;
	kind: 'component' | 'directive';
	selector: string;
	public: true;
	packageImport: typeof obliquePackageImport;
	declaredIn: string;
	deprecated: boolean;
	documentation: string | null;
	inputs: readonly ObliqueTemplateApiInput[];
	outputs: readonly ObliqueTemplateApiOutput[];
}

export interface ObliqueTemplateApiResult {
	obliqueVersion: string;
	matches: readonly ObliqueTemplateApiMatch[];
}

interface ObliqueTemplateApiLookupFailure {
	error: string;
}

export type ObliqueTemplateApiLookup = {symbol: string} | {selector: string};

export const getObliqueTemplateApiSchema = schema.union([
	schema
		.object({
			symbol: schema.string().trim().min(1).refine(isTypeScriptIdentifier, 'Expected a TypeScript symbol name.'),
		})
		.strict(),
	schema.object({selector: schema.string().trim().min(1).max(maximumSelectorLength)}).strict(),
]);

const templateApiInputSchema = schema.object({
	name: schema.string(),
	propertyName: schema.string(),
	required: schema.boolean(),
	deprecated: schema.boolean(),
	documentation: schema.string().nullable(),
	declaredIn: schema.string(),
});

const templateApiOutputSchema = schema.object({
	name: schema.string(),
	propertyName: schema.string(),
	deprecated: schema.boolean(),
	documentation: schema.string().nullable(),
	declaredIn: schema.string(),
});

export const getObliqueTemplateApiResultSchema = schema.object({
	obliqueVersion: schema.string(),
	matches: schema.array(
		schema.object({
			symbol: schema.string(),
			kind: schema.enum(['component', 'directive']),
			selector: schema.string(),
			public: schema.literal(true),
			packageImport: schema.literal(obliquePackageImport),
			declaredIn: schema.string(),
			deprecated: schema.boolean(),
			documentation: schema.string().nullable(),
			inputs: schema.array(templateApiInputSchema),
			outputs: schema.array(templateApiOutputSchema),
		})
	),
});

export function registerObliqueTemplateApiTool(
	server: McpServer,
	publicApiReader: ObliqueTemplateApiPublicReader,
	readPackageMetadata: () => Promise<PackageMetadata>
): void {
	server.registerTool(
		'get_oblique_template_api',
		{
			description:
				'Get the effective public Angular template inputs and outputs of an embedded Oblique component or directive.',
			inputSchema: getObliqueTemplateApiSchema,
			outputSchema: getObliqueTemplateApiResultSchema,
		},
		async lookup => {
			const result = getObliqueTemplateApi(publicApiReader, lookup, await readPackageMetadata());
			return 'error' in result
				? {content: [{type: 'text' as const, text: result.error}], isError: true as const}
				: {content: [{type: 'text' as const, text: JSON.stringify(result)}], structuredContent: result};
		}
	);
}

export function getObliqueTemplateApi(
	publicApiReader: ObliqueTemplateApiPublicReader,
	lookup: ObliqueTemplateApiLookup,
	packageMetadata: PackageMetadata
): ObliqueTemplateApiResult | ObliqueTemplateApiLookupFailure {
	if ('symbol' in lookup) {
		const symbol = publicApiReader.getApi(lookup.symbol);
		if (symbol === undefined) {
			return {error: `No public Oblique API symbol found for "${lookup.symbol}".`};
		}
		const matches = publicApiReader.getAngularTemplateApis().filter(api => api.symbol === lookup.symbol);
		if (matches.length === 0) {
			return {
				error:
					symbol.kind === 'component' || symbol.kind === 'directive'
						? `"${lookup.symbol}" is a public Oblique ${symbol.kind} but has no statically known template selector.`
						: `"${lookup.symbol}" is a public Oblique API symbol but not a directly addressable Angular template API.`,
			};
		}
		return createResult(matches, packageMetadata);
	}

	const matches = publicApiReader.getAngularTemplateApis().filter(api => api.selector === lookup.selector);
	return matches.length === 0
		? {error: `No public Oblique template API found for selector "${lookup.selector}".`}
		: createResult(matches, packageMetadata);
}

function createResult(
	matches: readonly ObliqueAngularTemplateApi[],
	packageMetadata: PackageMetadata
): ObliqueTemplateApiResult {
	return {
		obliqueVersion: getObliqueVersion(packageMetadata).obliqueVersion,
		matches: matches.map(createMatch).sort(compareMatches),
	};
}

function createMatch(api: ObliqueAngularTemplateApi): ObliqueTemplateApiMatch {
	return {
		symbol: api.symbol,
		kind: api.kind,
		selector: api.selector,
		public: true,
		packageImport: obliquePackageImport,
		declaredIn: api.declaredIn,
		deprecated: api.deprecated,
		documentation: api.documentation,
		inputs: [...(api.inputs ?? [])].map(createInput).sort(compareBindings),
		outputs: [...(api.outputs ?? [])].map(createOutput).sort(compareBindings),
	};
}

function createInput(input: ObliqueAngularTemplateInput): ObliqueTemplateApiInput {
	return {...input};
}

function createOutput(output: ObliqueAngularTemplateOutput): ObliqueTemplateApiOutput {
	return {...output};
}

function compareMatches(first: ObliqueTemplateApiMatch, second: ObliqueTemplateApiMatch): number {
	return (
		Number(first.deprecated) - Number(second.deprecated) ||
		Number(first.kind === 'directive') - Number(second.kind === 'directive') ||
		first.symbol.localeCompare(second.symbol, 'en')
	);
}

function compareBindings(
	first: ObliqueTemplateApiInput | ObliqueTemplateApiOutput,
	second: ObliqueTemplateApiInput | ObliqueTemplateApiOutput
): number {
	return first.name.localeCompare(second.name, 'en') || first.propertyName.localeCompare(second.propertyName, 'en');
}
