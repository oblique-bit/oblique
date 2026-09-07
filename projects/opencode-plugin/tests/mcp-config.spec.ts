import {describe, expect, it} from '@jest/globals';

import {applyObliqueMcpConfiguration, resolveObliqueMcpConfiguration} from '../src/mcp-config.js';

describe('resolveObliqueMcpConfiguration', () => {
	it('returns undefined when no MCP config is provided', () => {
		expect(resolveObliqueMcpConfiguration({env: {}})).toBeUndefined();
	});

	it('keeps an existing Oblique MCP configuration intact', () => {
		const existing = {
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
		const initial = {
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

		expect(configured.mcp?.github).toEqual({
			type: 'remote',
			url: 'https://github.example/mcp',
		});
		expect(configured.mcp?.oblique).toEqual({
			type: 'remote',
			url: 'https://example.com/mcp',
			enabled: true,
		});
	});

	it('uses the environment URL override when present', () => {
		const configured = applyObliqueMcpConfiguration(
			{mcp: {}},
			{
				env: {
					OBLIQUE_MCP_URL: 'https://example.com/mcp',
				},
			}
		);

		expect(configured.mcp?.oblique).toEqual({
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
		const initial = {mcp: {}};
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

		expect(twice.mcp?.oblique).toEqual({
			type: 'remote',
			url: 'https://example.com/mcp',
			enabled: true,
		});
		expect(Object.keys(twice.mcp ?? {})).toEqual(['oblique']);
	});
});
