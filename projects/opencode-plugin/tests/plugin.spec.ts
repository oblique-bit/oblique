import {mkdtempSync, readFileSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join, resolve} from 'node:path';

import {describe, expect, it} from '@jest/globals';
import type {Config} from '@opencode-ai/plugin';

import obliqueOpenCodePlugin from '../src/index.js';

function createObliqueProject(): string {
	const directory = mkdtempSync(join(tmpdir(), 'oblique-plugin-'));
	writeFileSync(
		join(directory, 'package.json'),
		JSON.stringify({
			name: 'demo-oblique-app',
			dependencies: {'@angular/core': '^21.0.0', '@oblique/oblique': '^15.4.4'},
		}),
		'utf8'
	);
	return directory;
}

function createPluginInput(directory: string, worktree = directory): Parameters<typeof obliqueOpenCodePlugin>[0] {
	return {
		project: {id: 'demo-project', worktree: directory},
		directory,
		worktree,
		client: {},
		experimental_workspace: {register: (): void => undefined},
		serverUrl: new URL('http://localhost:4096'),
		'$': undefined,
	} as unknown as Parameters<typeof obliqueOpenCodePlugin>[0];
}

async function createDynamicRuntimeUrl(entrypoint: string): Promise<string> {
	const importPattern = /from '(?<specifier>\.\/[^']+)'/gu;
	const source = readFileSync(entrypoint, 'utf8');
	const replacements = await Promise.all(
		[...source.matchAll(importPattern)].map(async match => {
			const specifier = match.groups?.['specifier'];
			const dependencyUrl =
				specifier === undefined ? undefined : await createDynamicRuntimeUrl(resolve(dirname(entrypoint), specifier));
			return {specifier, dependencyUrl};
		})
	);
	const rewritten = replacements.reduce((current, {specifier, dependencyUrl}) => {
		return specifier === undefined || dependencyUrl === undefined
			? current
			: current.replace(`from '${specifier}'`, `from '${dependencyUrl}'`);
	}, source);
	return `data:text/javascript,${encodeURIComponent(rewritten).replaceAll("'", '%27')}`;
}

describe('obliqueOpenCodePlugin', () => {
	it('injects Oblique guidance and registers the agent and commands for Oblique projects', async () => {
		const directory = createObliqueProject();
		const previousUrl = process.env['OBLIQUE_MCP_URL'];
		process.env['OBLIQUE_MCP_URL'] = 'https://example.com/mcp';
		try {
			const hooks = await obliqueOpenCodePlugin(createPluginInput(directory, ''));
			const config: Config = {mcp: {github: {type: 'remote', url: 'https://github.example/mcp'}}};
			await hooks.config?.(config);

			expect(config.mcp?.['oblique']).toEqual({type: 'remote', url: 'https://example.com/mcp', enabled: true});
			expect(config.agent?.['oblique']?.prompt).toContain('Oblique MCP');
			expect(config.command?.['oblique-review']?.template).toBe('/oblique-review [scope]');
			expect(config.command?.['oblique-status']?.template).toBe('/oblique-status');

			const output = {system: ['base prompt']};
			await hooks['experimental.chat.system.transform']?.({sessionID: 'session-1', model: {} as never}, output);
			expect(output.system.at(-1)).toContain('query the Oblique MCP');
		} finally {
			if (previousUrl === undefined) {
				delete process.env['OBLIQUE_MCP_URL'];
			} else {
				process.env['OBLIQUE_MCP_URL'] = previousUrl;
			}
		}
	});

	it('does not add Oblique-specific configuration to non-Oblique projects', async () => {
		const directory = mkdtempSync(join(tmpdir(), 'non-oblique-plugin-'));
		writeFileSync(join(directory, 'package.json'), JSON.stringify({name: 'node-service'}), 'utf8');
		const hooks = await obliqueOpenCodePlugin(createPluginInput(directory));
		const config: Config = {};

		await hooks.config?.(config);

		expect(config).toEqual({});
	});
});

describe('built runtime entrypoint', () => {
	it('dynamically loads only the default V1 plugin export accepted by the OpenCode loader', async () => {
		const entrypoint = join(process.cwd(), 'dist', 'index.js');
		// ts-jest otherwise rewrites import() to require(), which cannot load the built ESM entrypoint.
		// eslint-disable-next-line @typescript-eslint/no-implied-eval, no-new-func
		const dynamicImport = new Function('entry', 'return import(entry);') as (
			entry: string
		) => Promise<Record<string, unknown>>;
		const runtimeModule = await dynamicImport(await createDynamicRuntimeUrl(entrypoint));
		const plugins = Object.values(runtimeModule).map(exported => {
			if (typeof exported !== 'function') {
				throw new TypeError('Plugin export is not a function');
			}
			return exported;
		});

		expect(Object.keys(runtimeModule)).toEqual(['default']);
		expect(typeof runtimeModule['default']).toBe('function');
		expect(plugins).toHaveLength(1);
	});
});
