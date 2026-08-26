/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 10 public Angular template API metadata tool tests
 */

import type {McpServer} from '@modelcontextprotocol/server';
import {resolve} from 'node:path';
import {
	type ObliqueAngularTemplateApi,
	type ObliqueApiSymbol,
	ObliquePublicApiReader,
} from '../sources/oblique/public-api.reader.js';
import {
	type ObliqueTemplateApiMatch,
	type ObliqueTemplateApiPublicReader,
	getObliqueTemplateApi,
	getObliqueTemplateApiResultSchema,
	getObliqueTemplateApiSchema,
	registerObliqueTemplateApiTool,
} from './get-oblique-template-api.js';

type RegisteredCallback = (lookup: {symbol: string} | {selector: string}) => Promise<unknown>;

const packageMetadata = {
	version: '15.4.4',
	engines: {node: '>=22.12.0'},
	dependencies: {},
	repository: {url: 'https://example.test/oblique'},
};
const repositoryRoot = resolve(__dirname, '../../../..');

function createApiSymbol(symbol: string, kind: ObliqueApiSymbol['kind']): ObliqueApiSymbol {
	return {
		symbol,
		kind,
		public: true,
		packageImport: '@oblique/oblique',
		exportedFrom: 'projects/oblique/src/public_api.ts',
		declaredIn: `projects/oblique/src/lib/${symbol}.ts`,
		signature: `class ${symbol}`,
		documentation: null,
		deprecated: false,
	};
}

function createTemplateApi({
	symbol,
	kind,
	selector,
	deprecated = false,
}: {
	symbol: string;
	kind: ObliqueAngularTemplateApi['kind'];
	selector: string;
	deprecated?: boolean;
}): ObliqueAngularTemplateApi {
	return {
		symbol,
		kind,
		selector,
		deprecated,
		documentation: deprecated ? 'Deprecated public API.' : null,
		declaredIn: `projects/oblique/src/lib/${symbol}.ts`,
		public: true,
		inputs: [
			{
				name: 'zInput',
				propertyName: 'zInputProperty',
				required: false,
				deprecated: false,
				documentation: null,
				declaredIn: 'projects/oblique/src/lib/base.ts',
			},
			{
				name: 'aInput',
				propertyName: 'aInputProperty',
				required: true,
				deprecated: true,
				documentation: 'Deprecated input.',
				declaredIn: 'projects/oblique/src/lib/component.ts',
			},
		],
		outputs: [
			{
				name: 'zOutput',
				propertyName: 'zOutputProperty',
				deprecated: false,
				documentation: null,
				declaredIn: 'projects/oblique/src/lib/base.ts',
			},
			{
				name: 'aOutput',
				propertyName: 'aOutputProperty',
				deprecated: true,
				documentation: 'Deprecated output.',
				declaredIn: 'projects/oblique/src/lib/component.ts',
			},
		],
	};
}

function createReader(): ObliqueTemplateApiPublicReader {
	const unboundTemplateApi: ObliqueAngularTemplateApi = {
		symbol: 'UnboundComponent',
		kind: 'component',
		selector: 'ob-unbound',
		deprecated: false,
		documentation: null,
		declaredIn: 'projects/oblique/src/lib/UnboundComponent.ts',
		public: true,
	};
	const tiedBindingsTemplateApi: ObliqueAngularTemplateApi = {
		...createTemplateApi({symbol: 'TiedBindingsComponent', kind: 'component', selector: 'ob-tied-bindings'}),
		inputs: [
			{
				name: 'sameName',
				propertyName: 'zProperty',
				required: false,
				deprecated: false,
				documentation: null,
				declaredIn: 'projects/oblique/src/lib/TiedBindingsComponent.ts',
			},
			{
				name: 'sameName',
				propertyName: 'aProperty',
				required: false,
				deprecated: false,
				documentation: null,
				declaredIn: 'projects/oblique/src/lib/TiedBindingsComponent.ts',
			},
		],
		outputs: [
			{
				name: 'sameName',
				propertyName: 'zProperty',
				deprecated: false,
				documentation: null,
				declaredIn: 'projects/oblique/src/lib/TiedBindingsComponent.ts',
			},
			{
				name: 'sameName',
				propertyName: 'aProperty',
				deprecated: false,
				documentation: null,
				declaredIn: 'projects/oblique/src/lib/TiedBindingsComponent.ts',
			},
		],
	};
	const templateApis = [
		createTemplateApi({symbol: 'DeprecatedDirective', kind: 'directive', selector: 'ob-shared', deprecated: true}),
		createTemplateApi({symbol: 'PublicDirective', kind: 'directive', selector: 'ob-shared'}),
		createTemplateApi({symbol: 'DeprecatedComponent', kind: 'component', selector: 'ob-shared', deprecated: true}),
		createTemplateApi({symbol: 'PublicComponent', kind: 'component', selector: 'ob-shared'}),
		createTemplateApi({symbol: 'AlphaComponent', kind: 'component', selector: 'ob-shared'}),
		createTemplateApi({symbol: 'DateComponent', kind: 'component', selector: 'ob-date'}),
		unboundTemplateApi,
		tiedBindingsTemplateApi,
	];
	const symbols = new Map([
		...templateApis.map(api => [api.symbol, createApiSymbol(api.symbol, api.kind)] as const),
		['NotificationService', createApiSymbol('NotificationService', 'service')],
		['IconButtonDirective', createApiSymbol('IconButtonDirective', 'directive')],
	]);
	return {
		getApi: symbol => symbols.get(symbol),
		getAngularTemplateApis: () => templateApis,
	};
}

function getMatch(
	result: ReturnType<typeof getObliqueTemplateApi>,
	symbol: string
): ObliqueTemplateApiMatch | undefined {
	return 'matches' in result ? result.matches.find(match => match.symbol === symbol) : undefined;
}

describe('get_oblique_template_api tool', () => {
	it('uses a strict XOR input schema and validates its structured result', () => {
		expect(getObliqueTemplateApiSchema.parse({symbol: '  DateComponent  '})).toEqual({symbol: 'DateComponent'});
		expect(getObliqueTemplateApiSchema.parse({selector: ' [obInputClear] '})).toEqual({selector: '[obInputClear]'});
		expect(getObliqueTemplateApiSchema.safeParse({}).success).toBe(false);
		expect(getObliqueTemplateApiSchema.safeParse({symbol: 'DateComponent', selector: 'ob-date'}).success).toBe(false);
		expect(getObliqueTemplateApiSchema.safeParse({symbol: '../DateComponent'}).success).toBe(false);
		expect(getObliqueTemplateApiSchema.safeParse({selector: ''}).success).toBe(false);
		expect(getObliqueTemplateApiSchema.safeParse({selector: 'x'.repeat(501)}).success).toBe(false);
		expect(getObliqueTemplateApiSchema.safeParse({selector: 'ob-date', path: '../../template.html'}).success).toBe(
			false
		);
		expect(
			getObliqueTemplateApiResultSchema.parse({
				obliqueVersion: '15.4.4',
				matches: [],
			})
		).toMatchObject({obliqueVersion: '15.4.4'});
	});

	it('returns a symbol match with effective, consumer-visible bindings in deterministic order', () => {
		const result = getObliqueTemplateApi(createReader(), {symbol: 'DateComponent'}, packageMetadata);

		expect(result).toEqual({
			obliqueVersion: '15.4.4',
			matches: [
				expect.objectContaining({
					symbol: 'DateComponent',
					kind: 'component',
					selector: 'ob-date',
					public: true,
					packageImport: '@oblique/oblique',
					inputs: [expect.objectContaining({name: 'aInput'}), expect.objectContaining({name: 'zInput'})],
					outputs: [expect.objectContaining({name: 'aOutput'}), expect.objectContaining({name: 'zOutput'})],
				}),
			],
		});
	});

	it('returns all exact selector matches in stable public-template order', () => {
		const result = getObliqueTemplateApi(createReader(), {selector: 'ob-shared'}, packageMetadata);

		expect('matches' in result && result.matches.map(match => match.symbol)).toEqual([
			'AlphaComponent',
			'PublicComponent',
			'PublicDirective',
			'DeprecatedComponent',
			'DeprecatedDirective',
		]);
	});

	it('returns empty binding collections when metadata has none and orders binding property-name ties', () => {
		const reader = createReader();

		expect(
			getMatch(getObliqueTemplateApi(reader, {symbol: 'UnboundComponent'}, packageMetadata), 'UnboundComponent')?.inputs
		).toEqual([]);
		expect(
			getMatch(getObliqueTemplateApi(reader, {symbol: 'UnboundComponent'}, packageMetadata), 'UnboundComponent')
				?.outputs
		).toEqual([]);
		expect(
			getMatch(
				getObliqueTemplateApi(reader, {symbol: 'TiedBindingsComponent'}, packageMetadata),
				'TiedBindingsComponent'
			)?.inputs.map(input => input.propertyName)
		).toEqual(['aProperty', 'zProperty']);
		expect(
			getMatch(
				getObliqueTemplateApi(reader, {symbol: 'TiedBindingsComponent'}, packageMetadata),
				'TiedBindingsComponent'
			)?.outputs.map(output => output.propertyName)
		).toEqual(['aProperty', 'zProperty']);
	});

	it('returns clear errors for unknown, non-template and selectorless public symbols plus unknown selectors', () => {
		const reader = createReader();

		expect(getObliqueTemplateApi(reader, {symbol: 'Unknown'}, packageMetadata)).toEqual({
			error: 'No public Oblique API symbol found for "Unknown".',
		});
		expect(getObliqueTemplateApi(reader, {symbol: 'NotificationService'}, packageMetadata)).toEqual({
			error:
				'"NotificationService" is a public Oblique API symbol but not a directly addressable Angular template API.',
		});
		expect(getObliqueTemplateApi(reader, {symbol: 'IconButtonDirective'}, packageMetadata)).toEqual({
			error: '"IconButtonDirective" is a public Oblique directive but has no statically known template selector.',
		});
		expect(getObliqueTemplateApi(reader, {selector: 'ob-missing'}, packageMetadata)).toEqual({
			error: 'No public Oblique template API found for selector "ob-missing".',
		});
	});

	it('registers the shared-reader tool and returns structured success or clean expected errors', async () => {
		const registerTool = jest.fn();
		const server = {registerTool} as unknown as McpServer;

		registerObliqueTemplateApiTool(server, createReader(), async () => packageMetadata);

		expect(registerTool).toHaveBeenCalledWith(
			'get_oblique_template_api',
			expect.objectContaining({
				inputSchema: getObliqueTemplateApiSchema,
				outputSchema: getObliqueTemplateApiResultSchema,
			}),
			expect.any(Function)
		);
		const callback = registerTool.mock.calls[0]?.[2] as RegisteredCallback;
		expect(await callback({selector: 'ob-date'})).toMatchObject({
			structuredContent: {obliqueVersion: '15.4.4', matches: [expect.objectContaining({symbol: 'DateComponent'})]},
		});
		expect(await callback({symbol: 'Unknown'})).toEqual({
			content: [{type: 'text', text: 'No public Oblique API symbol found for "Unknown".'}],
			isError: true,
		});
	});

	it('returns checked-out public template metadata without exposing non-template or selectorless APIs', () => {
		const reader = new ObliquePublicApiReader(repositoryRoot);
		const dateResult = getObliqueTemplateApi(reader, {symbol: 'ObDateComponent'}, packageMetadata);
		const breadcrumbResult = getObliqueTemplateApi(reader, {symbol: 'ObBreadcrumbComponent'}, packageMetadata);
		const inputClearResult = getObliqueTemplateApi(reader, {selector: '[obInputClear]'}, packageMetadata);
		const masterLayoutResult = getObliqueTemplateApi(reader, {selector: 'ob-master-layout'}, packageMetadata);

		expect(dateResult).toMatchObject({
			matches: [
				{
					symbol: 'ObDateComponent',
					kind: 'component',
					selector: 'ob-date',
					inputs: [
						expect.objectContaining({name: 'date', propertyName: 'date', required: true}),
						expect.objectContaining({name: 'format', propertyName: 'format', required: false}),
					],
				},
			],
		});
		expect(getMatch(breadcrumbResult, 'ObBreadcrumbComponent')?.inputs).toEqual(
			expect.arrayContaining([
				expect.objectContaining({name: 'maxWidth', propertyName: 'maxWidthInput'}),
				expect.objectContaining({name: 'parameterSeparator', propertyName: 'separatorInput'}),
				expect.objectContaining({name: 'beautifyUrls', propertyName: 'beautifyUrlsInput'}),
			])
		);
		expect(getMatch(inputClearResult, 'ObInputClearDirective')?.inputs.map(input => input.name)).toEqual([
			'datePickerRef',
			'focusOnClear',
			'obInputClear',
		]);
		expect(getMatch(inputClearResult, 'ObInputClearDirective')?.outputs.map(output => output.name)).toEqual([
			'onClear',
		]);
		expect('matches' in masterLayoutResult && masterLayoutResult.matches.map(match => match.symbol)).toEqual(
			expect.arrayContaining(['ObMasterLayoutComponent', 'ObOutlineDirective'])
		);
		expect(getObliqueTemplateApi(reader, {symbol: 'ObNotificationService'}, packageMetadata)).toEqual({
			error:
				'"ObNotificationService" is a public Oblique API symbol but not a directly addressable Angular template API.',
		});
		expect(getObliqueTemplateApi(reader, {symbol: 'ObIconButtonDirective'}, packageMetadata)).toEqual({
			error: '"ObIconButtonDirective" is a public Oblique directive but has no statically known template selector.',
		});
	});
});
