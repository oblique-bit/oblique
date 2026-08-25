/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 2 search and examples
 */

import type {ObliqueExamples} from '../sources/sds/sds-examples.reader.js';

export interface SdsExamplesClient {
	getExamples: (component: string) => Promise<ObliqueExamples | undefined>;
}

export async function getObliqueExamples(
	client: SdsExamplesClient,
	component: string
): Promise<ObliqueExamples | undefined> {
	return client.getExamples(component);
}
