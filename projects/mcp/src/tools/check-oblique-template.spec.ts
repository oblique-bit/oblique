/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 8 Angular template public API analysis tool tests
 */

import type {McpServer} from '@modelcontextprotocol/server';
import {ObliqueTemplateAnalyzer, type ObliqueTemplatePublicApiReader} from '../analyzers/oblique-template.analyzer.js';
import {
	checkObliqueTemplateResultSchema,
	checkObliqueTemplateSchema,
	getObliqueTemplateCheck,
	maximumObliqueTemplateCodeLength,
	registerObliqueTemplateTool,
} from './check-oblique-template.js';

type RegisteredCallback = (arguments_: {code: string}) => Promise<unknown>;

const packageMetadata = {
	version: '15.4.4',
	engines: {node: '>=22.12.0'},
	dependencies: {},
	repository: {url: 'https://example.test/oblique'},
};

const publicApiReader: ObliqueTemplatePublicApiReader = {getAngularTemplateApis: () => []};

describe('check_oblique_template tool', () => {
	it('uses strict non-whitespace bounded input and structured output schemas', () => {
		expect(checkObliqueTemplateSchema.parse({code: '<div></div>'})).toEqual({code: '<div></div>'});
		expect(checkObliqueTemplateSchema.safeParse({code: ''}).success).toBe(false);
		expect(checkObliqueTemplateSchema.safeParse({code: ' \n\t '}).success).toBe(false);
		expect(checkObliqueTemplateSchema.safeParse({code: 'x'.repeat(maximumObliqueTemplateCodeLength)}).success).toBe(
			true
		);
		expect(checkObliqueTemplateSchema.safeParse({code: 'x'.repeat(maximumObliqueTemplateCodeLength + 1)}).success).toBe(
			false
		);
		expect(checkObliqueTemplateSchema.safeParse({code: '<div></div>', path: '../../template.html'}).success).toBe(
			false
		);
		expect(checkObliqueTemplateSchema.safeParse({code: '<div></div>', fileName: 'template.html'}).success).toBe(false);
		expect(
			checkObliqueTemplateResultSchema.parse({
				obliqueVersion: '15.4.4',
				valid: true,
				summary: {errors: 0, warnings: 0, info: 0},
				findings: [],
			})
		).toMatchObject({valid: true});
	});

	it('accepts the maximum input before parsing and rejects an oversized input before parser invocation', () => {
		const templateParser = jest.fn(() => ({nodes: [], errors: null}));
		const analyzer = new ObliqueTemplateAnalyzer(publicApiReader, templateParser);
		const acceptedCode = checkObliqueTemplateSchema.parse({code: 'x'.repeat(maximumObliqueTemplateCodeLength)}).code;

		analyzer.analyze(acceptedCode);
		expect(templateParser).toHaveBeenCalledTimes(1);
		expect(checkObliqueTemplateSchema.safeParse({code: 'x'.repeat(maximumObliqueTemplateCodeLength + 1)}).success).toBe(
			false
		);
		expect(templateParser).toHaveBeenCalledTimes(1);
	});

	it('registers the read-only Angular template tool and returns checked-out version metadata', async () => {
		const registerTool = jest.fn();
		const server = {registerTool} as unknown as McpServer;

		registerObliqueTemplateTool(server, publicApiReader, async () => packageMetadata);

		expect(registerTool).toHaveBeenCalledWith(
			'check_oblique_template',
			expect.objectContaining({
				inputSchema: checkObliqueTemplateSchema,
				outputSchema: checkObliqueTemplateResultSchema,
			}),
			expect.any(Function)
		);
		const callback = registerTool.mock.calls[0]?.[2] as RegisteredCallback;
		expect(await callback({code: '<ob-missing></ob-missing>'})).toMatchObject({
			structuredContent: {
				obliqueVersion: '15.4.4',
				findings: [{rule: 'OBLIQUE_UNKNOWN_COMPONENT_SELECTOR'}],
			},
		});
	});

	it('provides a synchronous direct analysis helper without filesystem metadata', () => {
		const analyzer = new ObliqueTemplateAnalyzer(publicApiReader);

		expect(getObliqueTemplateCheck(analyzer, '<div></div>', packageMetadata)).toEqual({
			obliqueVersion: '15.4.4',
			valid: true,
			summary: {errors: 0, warnings: 0, info: 0},
			findings: [],
		});
	});
});
