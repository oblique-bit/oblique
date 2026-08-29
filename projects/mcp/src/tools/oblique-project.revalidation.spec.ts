/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 14 canonical location revalidation tests
 */

import {realpath} from 'node:fs/promises';
import {resolve} from 'node:path';
import {firstValueFrom} from 'rxjs';
import {destinationExists$, getRevalidationFailure$} from './oblique-project.revalidation.js';
import type {PackageMetadata} from './get-oblique-version.js';
import type {ObliqueProjectPlan} from './oblique-project-plan.store.js';

const packageMetadata: PackageMetadata = {
	version: '15.4.4',
	engines: {node: '>=22.12.0'},
	dependencies: {'@angular/core': '^21.2.20'},
	repository: {url: 'https://github.com/oblique-bit/oblique.git'},
};

describe('project plan revalidation', () => {
	it('uses read-only default filesystem operations for a canonical missing destination', async () => {
		const parentDirectory = await realpath(process.cwd());
		const projectName = `phase14-missing-${process.pid}`;
		const plan = getPlan(parentDirectory, resolve(parentDirectory, projectName), projectName);

		await expect(
			firstValueFrom(getRevalidationFailure$(plan, packageMetadata, {currentNodeVersion: '22.12.0'}))
		).resolves.toBeUndefined();
		await expect(firstValueFrom(getRevalidationFailure$(plan, packageMetadata))).resolves.toBeUndefined();
		await expect(firstValueFrom(destinationExists$(plan.destinationPath))).resolves.toBe(false);
	});

	it('rejects parent changes and accepts both npmrc canonical argument modes', async () => {
		const plan = getPlan('/workspace', '/workspace/employee-portal');
		const fileSystem = {
			realpath: async (path: string) => path,
			lstat: async () => Promise.reject(Object.assign(new Error('missing'), {code: 'ENOENT'})),
		};
		await expect(
			firstValueFrom(
				getRevalidationFailure$(
					{...plan, npmrcMode: 'external', args: [...plan.args.slice(0, -1), '--no-npmrc']},
					packageMetadata,
					{currentNodeVersion: '22.12.0', fileSystem}
				)
			)
		).resolves.toBeUndefined();
		await expect(
			firstValueFrom(
				getRevalidationFailure$({...plan, parentDirectory: '/changed'}, packageMetadata, {
					currentNodeVersion: '22.12.0',
					fileSystem,
				})
			)
		).resolves.toBe('REVALIDATION_FAILED');
	});

	it('rejects a destination symlink before spawning instead of following it', async () => {
		const plan = getPlan('/workspace', '/workspace/employee-portal');
		const fileSystem = {
			realpath: async (path: string) => path,
			lstat: async () => ({}),
		};

		await expect(
			firstValueFrom(getRevalidationFailure$(plan, packageMetadata, {currentNodeVersion: '22.12.0', fileSystem}))
		).resolves.toBe('DESTINATION_ALREADY_EXISTS');
	});

	it('captures a synchronous filesystem adapter throw inside defer', async () => {
		const plan = getPlan('/workspace', '/workspace/employee-portal');
		const fileSystem = {
			realpath: () => {
				throw new Error('synchronous failure');
			},
			lstat: async () => ({}),
		};

		await expect(firstValueFrom(getRevalidationFailure$(plan, packageMetadata, {fileSystem}))).resolves.toBe(
			'REVALIDATION_FAILED'
		);
	});
});

function getPlan(
	parentDirectory: string,
	destinationPath: string,
	projectName = 'employee-portal'
): ObliqueProjectPlan {
	return {
		projectName,
		applicationOperator: 'Federal Test Office',
		contact: 'accessibility@example.test',
		parentDirectory,
		destinationPath,
		obliqueVersion: '15.4.4',
		obliqueCliVersion: '15.4.4',
		angularVersion: '21',
		nodeRequirement: '>=22.12.0',
		npmrcMode: 'federal',
		executable: 'npx',
		args: [
			'--yes',
			'@oblique/cli@15.4.4',
			'new',
			projectName,
			'--applicationOperator=Federal Test Office',
			'--contact=accessibility@example.test',
			'--npmrc',
		],
	};
}
