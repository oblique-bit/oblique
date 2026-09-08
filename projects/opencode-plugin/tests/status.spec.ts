import {describe, expect, it} from '@jest/globals';
import type {Config} from '@opencode-ai/plugin';

import {
	buildObliqueStatusReport,
	checkObliqueMcpHealth,
	registerObliqueStatusCommand,
	sanitizeForDisplay,
} from '../src/status.js';

const obliqueProject = {
	projectRoot: '/tmp/demo',
	isAngularProject: true,
	isObliqueProject: true,
	angularVersion: '21.0.0',
	obliqueVersion: '15.4.4',
	packageManager: 'npm' as const,
};

function createSseResponse(payload: unknown): Response {
	return new Response(`event: message\ndata: ${JSON.stringify(payload)}\n\n`, {
		status: 200,
		headers: {'content-type': 'text/event-stream'},
	});
}

describe('sanitizeForDisplay', () => {
	it('removes credentials and query strings from endpoints', () => {
		const sanitized = sanitizeForDisplay('https://user:secret@example.com/mcp?token=abc');
		expect(sanitized).toBe('https://example.com/mcp');
	});

	it('returns undefined for empty values', () => {
		expect(sanitizeForDisplay('')).toBeUndefined();
	});
});

describe('buildObliqueStatusReport', () => {
	it('aggregates project and MCP health for a healthy Oblique project', () => {
		const report = buildObliqueStatusReport(obliqueProject, {
			mcp: {
				configured: true,
				mode: 'remote',
				endpoint: 'https://example.com/mcp',
				reachable: true,
				initialized: true,
				toolsAvailable: true,
			},
		});

		expect(report.status).toBe('ok');
		expect(report.message).toContain('Angular: 21.0.0');
		expect(report.message).toContain('Oblique: 15.4.4');
		expect(report.message).toContain('tools/list available');
	});
});

describe('checkObliqueMcpHealth', () => {
	it('uses the MCP Streamable HTTP initialization flow before tools/list', async () => {
		const requests: {method: string; headers: Headers}[] = [];
		const fetcher: typeof fetch = async (_url, init) => {
			const request = JSON.parse(String(init?.body)) as {id?: number; method: string};
			const headers = new Headers(init?.headers as HeadersInit | undefined);
			requests.push({method: request.method, headers});
			if (request.method === 'initialize') {
				return createSseResponse({
					jsonrpc: '2.0',
					id: request.id,
					result: {
						protocolVersion: '2025-11-25',
						capabilities: {tools: {}},
						serverInfo: {name: 'oblique-mcp', version: '0.1.0'},
					},
				});
			}
			if (request.method === 'tools/list') {
				return createSseResponse({
					jsonrpc: '2.0',
					id: request.id,
					result: {tools: [{name: 'search', description: 'Search Oblique', inputSchema: {type: 'object'}}]},
				});
			}
			return new Response(null, {status: 202});
		};

		const report = await checkObliqueMcpHealth(obliqueProject, {
			endpoint: 'https://example.com/mcp',
			fetcher,
		});

		expect(report.checks.mcp).toMatchObject({reachable: true, initialized: true, toolsAvailable: true});
		expect(requests.map(request => request.method)).toEqual(['initialize', 'notifications/initialized', 'tools/list']);
		expect(requests[2]?.headers.get('mcp-protocol-version')).toBe('2025-11-25');
	});

	it('reports a sanitized failure without leaking endpoint credentials', async () => {
		const report = await checkObliqueMcpHealth(obliqueProject, {
			endpoint: 'https://user:secret@example.com/mcp?token=private',
			fetcher: async () => {
				throw new Error('connection to https://user:secret@example.com/mcp?token=private failed');
			},
		});

		expect(report.checks.mcp.endpoint).toBe('https://example.com/mcp');
		expect(report.checks.mcp.reason).toBe('MCP initialization or tools/list request failed.');
		expect(report.message).not.toContain('secret');
		expect(report.message).not.toContain('private');
	});

	it('does not claim that a local MCP process was initialized', async () => {
		const report = await checkObliqueMcpHealth(obliqueProject, {mode: 'local'});

		expect(report.checks.mcp).toMatchObject({
			configured: true,
			reachable: false,
			initialized: false,
			toolsAvailable: false,
		});
		expect(report.checks.mcp.reason).toContain('managed by OpenCode');
	});
});

describe('registerObliqueStatusCommand', () => {
	it('registers the status command through the V1 configuration model', () => {
		const config: Config = {};

		registerObliqueStatusCommand(config, obliqueProject);

		expect(config.command?.['oblique-status']?.template).toContain('/oblique-status');
		expect(config.command?.['oblique-status']?.description).toContain('Oblique OpenCode Integration');
	});
});
