import process from 'node:process';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {printEnv} from './env.js';
import {formatShellExports} from '../utils/shell.js';
import {isRegistryReady, npmrcPath, registryUrl} from '../utils/runtime.js';

vi.mock('../utils/runtime.js', async importOriginal => {
	const original = await importOriginal<typeof import('../utils/runtime.js')>();
	return {...original, isRegistryReady: vi.fn()};
});

describe('printEnv', () => {
	const readyMock = vi.mocked(isRegistryReady);

	beforeEach(() => {
		readyMock.mockResolvedValue(false);
	});

	const originalPlatform = process.platform;
	const shellIndicatorKeys = ['SHELL', 'MSYSTEM', 'PSModulePath'] as const;
	const originalShellIndicators = Object.fromEntries(shellIndicatorKeys.map(key => [key, process.env[key]])) as Record<
		(typeof shellIndicatorKeys)[number],
		string | undefined
	>;

	afterEach(() => {
		Object.defineProperty(process, 'platform', {
			value: originalPlatform,
			configurable: true,
		});
		for (const key of shellIndicatorKeys) {
			restoreShellIndicator(key);
		}
		vi.restoreAllMocks();
	});

	/** Overrides the reported platform for the current test. */
	function stubPlatform(platform: NodeJS.Platform): void {
		Object.defineProperty(process, 'platform', {
			value: platform,
			configurable: true,
		});
	}

	/** Removes the shell indicator variables so the sniff resolves cmd on win32. */
	function clearShellIndicators(): void {
		for (const key of shellIndicatorKeys) {
			delete process.env[key];
		}
	}

	/** Restores one shell indicator variable to its original state. */
	function restoreShellIndicator(key: (typeof shellIndicatorKeys)[number]): void {
		const value = originalShellIndicators[key];
		if (value === undefined) {
			delete process.env[key];
		} else {
			process.env[key] = value;
		}
	}

	it('emits POSIX exports and exits 0 when the registry is running', async () => {
		stubPlatform('linux');
		readyMock.mockResolvedValue(true);
		const stdout = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
		const stderr = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

		const exitCode = await printEnv();

		expect(exitCode).toBe(0);
		expect(stdout).toHaveBeenCalledWith(formatShellExports('posix', npmrcPath, registryUrl));
		expect(stderr).not.toHaveBeenCalled();
		expect(consoleError).not.toHaveBeenCalled();
	});

	it('warns on stderr when the registry is not running but still emits exports', async () => {
		stubPlatform('linux');
		const stdout = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
		const stderr = vi.spyOn(process.stderr, 'write').mockImplementation(() => true);
		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

		const exitCode = await printEnv();

		expect(exitCode).toBe(0);
		expect(stdout).toHaveBeenCalledTimes(1);
		expect(consoleError).toHaveBeenCalledWith(expect.stringContaining('is not running'));
		expect(stderr).not.toHaveBeenCalled();
	});

	it('refuses cmd.exe with exit code 1 and no stdout output', async () => {
		stubPlatform('win32');
		clearShellIndicators();
		const stdout = vi.spyOn(process.stdout, 'write').mockImplementation(() => true);
		const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

		const exitCode = await printEnv();

		expect(exitCode).toBe(1);
		expect(stdout).not.toHaveBeenCalled();
		expect(consoleError).toHaveBeenCalledWith(expect.stringContaining('cmd.exe is not supported'));
	});
});
