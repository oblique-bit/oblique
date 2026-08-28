/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 14 project creation response support
 */

import type {CreateObliqueProjectResult} from './create-oblique-project.contracts.js';

export function getAbortSignal(value: unknown): AbortSignal | undefined {
	if (typeof value !== 'object' || value === null || !('signal' in value)) {
		return undefined;
	}
	const signal = Reflect.get(value, 'signal');
	return signal instanceof AbortSignal ? signal : undefined;
}

export function getCreateResponse(result: CreateObliqueProjectResult): {
	content: {type: 'text'; text: string}[];
	structuredContent: CreateObliqueProjectResult;
	isError?: true;
} {
	return {
		content: [{type: 'text', text: JSON.stringify(result)}],
		structuredContent: result,
		...(result.status === 'completed' ? {} : {isError: true}),
	};
}

export function getPlanCode(
	status: 'not-found' | 'expired' | 'already-used'
): 'PLAN_NOT_FOUND' | 'PLAN_EXPIRED' | 'PLAN_ALREADY_USED' {
	if (status === 'not-found') {
		return 'PLAN_NOT_FOUND';
	}
	return status === 'expired' ? 'PLAN_EXPIRED' : 'PLAN_ALREADY_USED';
}
