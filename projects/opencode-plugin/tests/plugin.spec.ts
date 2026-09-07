import {mkdtempSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';

import {describe, expect, it} from '@jest/globals';

import obliqueOpenCodePlugin, {obliquePluginRuntimeState, obliqueProjectContext} from '../src/index.js';

describe('obliqueOpenCodePlugin', () => {
	it('exports a valid plugin entry point', () => {
		expect(typeof obliqueOpenCodePlugin).toBe('function');
	});

	it('initializes a neutral runtime state and config hook', async () => {
		const context = {
			project: {name: 'demo-project'},
			directory: process.cwd(),
			worktree: process.cwd(),
			client: {
				app: {
					log: (): void => undefined,
				},
			},
			shellApi: {},
		} satisfies Partial<Parameters<typeof obliqueOpenCodePlugin>[0]>;

		const hooks = await obliqueOpenCodePlugin(context as Parameters<typeof obliqueOpenCodePlugin>[0]);
		const configHook = hooks.config;

		expect(typeof configHook).toBe('function');
		expect(obliqueProjectContext.isObliqueProject).toBe(false);
		expect(obliquePluginRuntimeState.status.ready).toBe(true);
		expect(obliquePluginRuntimeState.status.projectDetected).toBe(false);

		if (configHook === undefined) {
			throw new Error('The OpenCode config hook is missing.');
		}

		const input = {mcp: {}} as Parameters<typeof configHook>[0];
		await expect(configHook(input)).resolves.toBeUndefined();
	});

	it('injects Oblique guidance into the chat system prompt when the project uses Oblique', async () => {
		const tempProjectDir = mkdtempSync(join(tmpdir(), 'oblique-plugin-instructions-'));
		writeFileSync(
			join(tempProjectDir, 'package.json'),
			JSON.stringify(
				{
					name: 'demo-oblique-app',
					dependencies: {
						'@angular/core': '^21.0.0',
						'@oblique/oblique': '^15.4.4',
					},
				},
				null,
				2
			),
			'utf8'
		);

		const hooks = await obliqueOpenCodePlugin({
			project: {name: 'demo-project'},
			directory: tempProjectDir,
			worktree: tempProjectDir,
			client: {
				app: {
					log: (): void => undefined,
				},
			},
			shellApi: {},
		} as Parameters<typeof obliqueOpenCodePlugin>[0]);

		const transform = hooks['experimental.chat.system.transform'];
		expect(typeof transform).toBe('function');

		const output = {system: ['base prompt']};
		await transform?.({sessionID: 'session-1', model: {} as never}, output);
		expect(output.system.some(item => item.includes('This project uses'))).toBe(true);
		expect(output.system.at(-1)?.includes('query the Oblique MCP')).toBe(true);
	});
});
