import {describe, expect, it} from '@jest/globals';
import type {Config} from '@opencode-ai/plugin';

import {applyObliqueMcpConfiguration, resolveObliqueMcpConfiguration} from '../src/mcp-config.js';

describe('resolveObliqueMcpConfiguration', () => {
	it('returns undefined when no MCP config is provided', () => {
		expect(resolveObliqueMcpConfiguration({env: {}})).toBeUndefined();
	});

	it('keeps an existing Oblique MCP configuration intact', () => {
		const existing: Config = {
			mcp: {
				oblique: {
					type: 'remote',
					url: 'https://existing.example/mcp',
					enabled: true,
				},
			},
		};

		expect(applyObliqueMcpConfiguration(existing, {env: {}})).toEqual(existing);
	});

	it('adds Oblique MCP config without overwriting an unrelated MCP entry', () => {
		const initial: Config = {
			mcp: {
				github: {
					type: 'remote',
					url: 'https://github.example/mcp',
				},
			},
		};

		const configured = applyObliqueMcpConfiguration(initial, {
			env: {
				OBLIQUE_MCP_URL: 'https://example.com/mcp',
			},
		});

		expect(configured.mcp?.['github']).toEqual({
			type: 'remote',
			url: 'https://github.example/mcp',
		});
		expect(configured.mcp?.['oblique']).toEqual({
			type: 'remote',
			url: 'https://example.com/mcp',
			enabled: true,
		});
	});

	it('uses the environment URL override when present', () => {
		const configured = applyObliqueMcpConfiguration({mcp: {}} as Config, {
			env: {
				OBLIQUE_MCP_URL: 'https://example.com/mcp',
			},
		});

		expect(configured.mcp?.['oblique']).toEqual({
			type: 'remote',
			url: 'https://example.com/mcp',
			enabled: true,
		});
	});

	it('ignores invalid remote URLs', () => {
		expect(
			resolveObliqueMcpConfiguration({
				env: {
					OBLIQUE_MCP_URL: 'not-a-url',
				},
			})
		).toBeUndefined();
	});

	it('is idempotent across repeated execution', () => {
		const initial: Config = {mcp: {}};
		const once = applyObliqueMcpConfiguration(initial, {
			env: {
				OBLIQUE_MCP_URL: 'https://example.com/mcp',
			},
		});
		const twice = applyObliqueMcpConfiguration(once, {
			env: {
				OBLIQUE_MCP_URL: 'https://example.com/mcp',
			},
		});

		expect(twice.mcp?.['oblique']).toEqual({
			type: 'remote',
			url: 'https://example.com/mcp',
			enabled: true,
		});
		expect(Object.keys(twice.mcp ?? {})).toEqual(['oblique']);
	});

	it('does not forward the complete process environment to a local MCP child process', () => {
		const resolved = resolveObliqueMcpConfiguration({
			env: {
				OBLIQUE_MCP_MODE: 'local',
				OBLIQUE_MCP_COMMAND: 'node',
				OBLIQUE_MCP_ARGS: 'projects/mcp/dist/server.js',
				UNRELATED_SECRET: 'do-not-forward',
			},
		});

		expect(resolved).toEqual({
			mode: 'local',
			command: ['node', 'projects/mcp/dist/server.js'],
			environment: undefined,
			enabled: true,
		});
	});

	it('allows callers to explicitly select local environment variables', () => {
		const resolved = resolveObliqueMcpConfiguration({
			mode: 'local',
			command: ['node', 'projects/mcp/dist/server.js'],
			environment: {HTTPS_PROXY: 'http://proxy.example'},
			env: {},
		});

		expect(resolved?.environment).toEqual({HTTPS_PROXY: 'http://proxy.example'});
	});
});
