import {existsSync, mkdtempSync, readFileSync, rmSync, statSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';

import {ensureRuntimeFiles, isRegistryReady, registryUrl} from './runtime.js';

describe('runtime', () => {
	/** The temporary directory the tests run against, never the real runtime directory. */
	let directory: string;

	beforeEach(() => {
		directory = mkdtempSync(join(tmpdir(), 'cli-registry-runtime-'));
	});

	afterEach(() => {
		rmSync(directory, {recursive: true, force: true});
		vi.restoreAllMocks();
	});

	describe('ensureRuntimeFiles', () => {
		it('creates the storage directory, credentials, htpasswd, and npmrc', () => {
			ensureRuntimeFiles(directory);

			expect(existsSync(join(directory, 'storage'))).toBe(true);
			expect(existsSync(join(directory, 'credentials.json'))).toBe(true);
			expect(existsSync(join(directory, 'htpasswd'))).toBe(true);
			expect(existsSync(join(directory, 'npmrc'))).toBe(true);
		});

		it('writes an npmrc pointing at the local registry with scoped and auth entries', () => {
			ensureRuntimeFiles(directory);

			const npmrc = readFileSync(join(directory, 'npmrc'), 'utf8');
			expect(npmrc).toContain(`registry=${registryUrl}/`);
			expect(npmrc).toContain(`@oblique:registry=${registryUrl}/`);
			expect(npmrc).toContain('//127.0.0.1:4873/:_auth=');
		});

		it('writes an htpasswd entry for the autocreated user', () => {
			ensureRuntimeFiles(directory);
			const credentials = JSON.parse(readFileSync(join(directory, 'credentials.json'), 'utf8')) as {
				username: string;
				password: string;
			};

			const htpasswd = readFileSync(join(directory, 'htpasswd'), 'utf8');
			expect(htpasswd).toBe(`${credentials.username}:{PLAIN}${credentials.password}:autocreated\n`);
		});

		it.skipIf(process.platform === 'win32')('restricts the credential files to owner-only permissions', () => {
			ensureRuntimeFiles(directory);

			for (const entry of ['credentials.json', 'htpasswd', 'npmrc']) {
				/* eslint-disable-next-line no-bitwise -- extracting permission bits from stat modes requires bitwise AND */
				const mode = statSync(join(directory, entry)).mode & 0o777;
				expect(mode).toBe(0o600);
			}
		});

		it('reuses persisted credentials instead of generating new ones', () => {
			ensureRuntimeFiles(directory);
			const firstNpmrc = readFileSync(join(directory, 'npmrc'), 'utf8');

			rmSync(join(directory, 'npmrc'));
			rmSync(join(directory, 'htpasswd'));
			ensureRuntimeFiles(directory);
			const secondNpmrc = readFileSync(join(directory, 'npmrc'), 'utf8');

			expect(secondNpmrc).toBe(firstNpmrc);
		});

		it('regenerates the runtime when the persisted credentials are invalid', () => {
			ensureRuntimeFiles(directory);
			writeFileSync(join(directory, 'credentials.json'), 'not json', 'utf8');
			rmSync(join(directory, 'npmrc'));

			ensureRuntimeFiles(directory);

			expect(existsSync(join(directory, 'npmrc'))).toBe(true);
			const credentials = JSON.parse(readFileSync(join(directory, 'credentials.json'), 'utf8')) as {
				username: string;
				password: string;
			};
			expect(credentials.username).toBe('oblique-local');
			expect(credentials.password).toMatch(/^[0-9a-f]{64}$/u);
		});
	});

	describe('isRegistryReady', () => {
		it('returns true when the ping endpoint responds with ok', async () => {
			const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValue({ok: true} as Response);

			await expect(isRegistryReady()).resolves.toBe(true);
			expect(fetchSpy).toHaveBeenCalledWith(`${registryUrl}/-/ping`);
		});

		it('returns false when the ping endpoint responds with an error status', async () => {
			vi.spyOn(globalThis, 'fetch').mockResolvedValue({ok: false} as Response);

			await expect(isRegistryReady()).resolves.toBe(false);
		});

		it('returns false when the ping endpoint is unreachable', async () => {
			vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('connect ECONNREFUSED'));

			await expect(isRegistryReady()).resolves.toBe(false);
		});
	});
});
