/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 2 search and examples
 */

import {type SdsExamplesClient, getObliqueExamples} from './get-oblique-examples.js';

describe('getObliqueExamples', () => {
	it('delegates component lookups to the SDS examples reader', async () => {
		const client: jest.Mocked<SdsExamplesClient> = {
			getExamples: jest.fn().mockResolvedValue({component: 'button', examples: []}),
		};

		await expect(getObliqueExamples(client, 'button')).resolves.toEqual({component: 'button', examples: []});
		expect(client.getExamples).toHaveBeenCalledWith('button');
	});
});
