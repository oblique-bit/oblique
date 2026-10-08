import type {ChildProcess} from 'node:child_process';
import {EventEmitter} from 'node:events';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {startRegistry} from './start.js';
import {ensureRuntimeFiles, isRegistryReady} from '../utils/runtime.js';
import * as nodeChildProcess from 'node:child_process';

vi.mock('node:child_process', async () => ({
	...((await vi.importActual<typeof import('node:child_process')>('node:child_process')) as object),
}));

vi.mock('../utils/runtime.js', async importOriginal => ({
	...((await importOriginal<typeof import('../utils/runtime.js')>()) as object),
	ensureRuntimeFiles: vi.fn(),
	isRegistryReady: vi.fn(),
}));

/** Builds a fake Verdaccio child process backed by an event emitter. */
function createFakeChild(): ChildProcess & {exited: (code: number | null) => void} {
	const child = new EventEmitter() as ChildProcess & {exited: (code: number | null) => void};
	/** Overrides one read-only child process property. */
	const setProperty = (name: 'exitCode' | 'signalCode', value: number | null): void => {
		Object.defineProperty(child, name, {value, configurable: true});
	};
	setProperty('exitCode', null);
	setProperty('signalCode', null);
	child.kill = vi.fn(() => {
		setProperty('exitCode', 0);
		child.emit('exit', 0);
		return true;
	});
	child.exited = (code: number | null) => {
		setProperty('exitCode', code);
		child.emit('exit', code);
	};
	return child;
}

describe('startRegistry', () => {
	const spawnMock = vi.spyOn(nodeChildProcess, 'spawn');
	const readyMock = vi.mocked(isRegistryReady);
	const runtimeMock = vi.mocked(ensureRuntimeFiles);

	beforeEach(() => {
		vi.spyOn(console, 'info').mockImplementation(() => {});
	});

	afterEach(() => {
		vi.restoreAllMocks();
		vi.clearAllMocks();
	});

	it('ensures the runtime files, spawns Verdaccio, and waits for readiness', async () => {
		const child = createFakeChild();
		spawnMock.mockReturnValue(child);
		readyMock.mockResolvedValue(true);

		const registry = startRegistry();
		await vi.waitFor(() => expect(console.info).toHaveBeenCalledWith(expect.stringContaining('registry is ready')));
		child.exited(0);
		await registry;

		expect(runtimeMock).toHaveBeenCalledTimes(1);
		expect(spawnMock).toHaveBeenCalledWith(
			process.execPath,
			[
				expect.stringContaining('verdaccio'),
				'--config',
				expect.stringContaining('config.yaml'),
				'--listen',
				'127.0.0.1:4873',
			],
			expect.objectContaining({cwd: expect.any(String)})
		);
	});

	it('registers SIGINT and SIGTERM forwarding to the Verdaccio child', async () => {
		const child = createFakeChild();
		spawnMock.mockReturnValue(child);
		readyMock.mockResolvedValue(true);
		const onceSpy = vi.spyOn(process, 'once');

		const registry = startRegistry();
		await vi.waitFor(() => expect(console.info).toHaveBeenCalledWith(expect.stringContaining('registry is ready')));
		child.exited(0);
		await registry;

		expect(onceSpy).toHaveBeenCalledWith('SIGINT', expect.any(Function));
		expect(onceSpy).toHaveBeenCalledWith('SIGTERM', expect.any(Function));
	});

	it('throws when Verdaccio stops before becoming ready', async () => {
		const child = createFakeChild();
		spawnMock.mockReturnValue(child);
		readyMock.mockResolvedValue(false);

		const registry = startRegistry();
		child.exited(1);

		await expect(registry).rejects.toThrow('Verdaccio stopped before becoming ready');
	});
});
