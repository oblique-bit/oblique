/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 14 bounded redacted project process output
 */

export const maximumProjectOutputLength = 16_384;

export function appendBoundedProjectOutput(output: string, chunk: unknown): {value: string; truncated: boolean} {
	const combined = Buffer.concat([Buffer.from(output), Buffer.from(String(chunk))]);
	return {value: getUtf8Tail(combined), truncated: combined.length > maximumProjectOutputLength};
}

export function sanitizeProjectOutput(output: string): {value: string; truncated: boolean} {
	const outputBytes = Buffer.from(output);
	return {
		value: getUtf8Tail(outputBytes)
			.replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/giu, 'Bearer [REDACTED]')
			.replace(/(?<key>_authToken|npm_[a-z_]*token)\s*[=:]\s*[^\s]+/giu, '$<key>=[REDACTED]')
			.replace(/https?:\/\/[^\s/@]+:[^\s/@]+@/giu, 'https://[REDACTED]@'),
		truncated: outputBytes.length > maximumProjectOutputLength,
	};
}

function getUtf8Tail(output: Buffer): string {
	let tail = output.length > maximumProjectOutputLength ? output.subarray(-maximumProjectOutputLength) : output;
	while (Buffer.byteLength(tail.toString('utf8')) > maximumProjectOutputLength) {
		tail = tail.subarray(1);
	}
	return tail.toString('utf8');
}
