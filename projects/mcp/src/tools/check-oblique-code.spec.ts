/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 5 TypeScript static-analysis tool tests
 */

import type {McpServer} from '@modelcontextprotocol/server';
import {ObliqueCodeAnalyzer, type ObliqueCodePublicApiReader} from '../analyzers/oblique-code.analyzer.js';
import type {PackageMetadata} from './get-oblique-version.js';
import {
	checkObliqueCodeResultSchema,
	checkObliqueCodeSchema,
	getObliqueCodeCheck,
	maximumObliqueCodeLength,
	registerObliqueCodeTool,
} from './check-oblique-code.js';

const packageMetadata: PackageMetadata = {
	version: '15.4.4',
	engines: {node: '>=22.12.0'},
	dependencies: {'@angular/core': '^21.0.0'},
	repository: {url: 'https://github.com/oblique-bit/oblique.git'},
};

const publicApiReader: ObliqueCodePublicApiReader = {
	getApi: symbol =>
		symbol === 'ObNotificationService'
			? {
					symbol,
					kind: 'service',
					public: true,
					packageImport: '@oblique/oblique',
					exportedFrom: 'projects/oblique/src/public_api.ts',
					declaredIn: 'projects/oblique/src/lib/notification/notification.service.ts',
					signature: 'class ObNotificationService',
					documentation: null,
					deprecated: false,
				}
			: undefined,
};

type CodeToolCallback = (arguments_: {code: string}) => Promise<{
	content: {type: 'text'; text: string}[];
	structuredContent: unknown;
}>;

describe('check_oblique_code tool', () => {
	it('returns the checked-out Oblique version with analyzer findings', () => {
		const result = getObliqueCodeCheck(
			new ObliqueCodeAnalyzer(publicApiReader),
			"import {ObNotificationService} from '@oblique/oblique';",
			packageMetadata
		);

		expect(result).toEqual({
			obliqueVersion: '15.4.4',
			valid: true,
			summary: {errors: 0, warnings: 0, info: 0},
			findings: [],
		});
		expect(checkObliqueCodeResultSchema.parse(result)).toEqual(result);
	});

	it('uses a strict bounded code input schema', () => {
		expect(checkObliqueCodeSchema.safeParse({code: 'const value = 1;'}).success).toBe(true);
		expect(checkObliqueCodeSchema.safeParse({code: ''}).success).toBe(false);
		expect(checkObliqueCodeSchema.safeParse({code: 'x'.repeat(maximumObliqueCodeLength)}).success).toBe(true);
		expect(checkObliqueCodeSchema.safeParse({code: 'x'.repeat(maximumObliqueCodeLength + 1)}).success).toBe(false);
		expect(checkObliqueCodeSchema.safeParse({code: 'const value = 1;', fileName: '../../package.json'}).success).toBe(
			false
		);
		expect(checkObliqueCodeSchema.safeParse({code: 'const value = 1;', unknown: true}).success).toBe(false);
	});

	it('registers a read-only MCP tool and serializes its result', async () => {
		const registerTool = jest.fn();
		const server = {registerTool} as unknown as McpServer;
		registerObliqueCodeTool(server, publicApiReader, async () => packageMetadata);

		expect(registerTool).toHaveBeenCalledWith(
			'check_oblique_code',
			expect.objectContaining({inputSchema: checkObliqueCodeSchema, outputSchema: checkObliqueCodeResultSchema}),
			expect.any(Function)
		);
		const callback = registerTool.mock.calls[0]?.[2] as CodeToolCallback;
		const response = await callback({code: "import {ObNotificationService} from '@oblique/oblique';"});

		expect(response).toEqual({
			content: [
				{
					type: 'text',
					text: JSON.stringify({
						obliqueVersion: '15.4.4',
						valid: true,
						summary: {errors: 0, warnings: 0, info: 0},
						findings: [],
					}),
				},
			],
			structuredContent: {
				obliqueVersion: '15.4.4',
				valid: true,
				summary: {errors: 0, warnings: 0, info: 0},
				findings: [],
			},
		});
	});
});
