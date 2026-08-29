/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 14 post-project validation tests
 */

import {firstValueFrom} from 'rxjs';
import {type ProjectValidationFileSystem, validateCreatedObliqueProject$} from './oblique-project.validator.js';
import type {ObliqueProjectPlan} from './oblique-project-plan.store.js';

const plan: ObliqueProjectPlan = {
	projectName: 'employee-portal',
	applicationOperator: 'Federal Test Office',
	contact: 'accessibility@example.test',
	parentDirectory: '/workspace',
	destinationPath: '/workspace/employee-portal',
	obliqueVersion: '15.4.4',
	obliqueCliVersion: '15.4.4',
	angularVersion: '21',
	nodeRequirement: '>=22.12.0',
	npmrcMode: 'external',
	executable: 'npx',
	args: [
		'--yes',
		'@oblique/cli@15.4.4',
		'new',
		'employee-portal',
		'--applicationOperator=Federal Test Office',
		'--contact=accessibility@example.test',
		'--no-npmrc',
	],
};

describe('validateCreatedObliqueProject', () => {
	it('uses only read-only default filesystem operations when the destination is absent', async () => {
		await expect(
			firstValueFrom(validateCreatedObliqueProject$({...plan, destinationPath: '/tmp/oblique-mcp-phase14-missing'}))
		).resolves.toMatchObject({valid: false, validation: {destination: 'failed'}});
	});

	it('accepts a regular Angular workspace with compatible Oblique dependencies', async () => {
		await expect(firstValueFrom(validateCreatedObliqueProject$(plan, createFileSystem()))).resolves.toMatchObject({
			valid: true,
			validation: {
				destination: 'passed',
				packageJson: 'passed',
				angularWorkspace: 'passed',
				obliqueDependency: 'passed',
				angularDependency: 'passed',
			},
		});
	});

	it('rejects an invalid expected Oblique version without throwing', async () => {
		await expect(
			firstValueFrom(validateCreatedObliqueProject$({...plan, obliqueVersion: 'invalid'}, createFileSystem()))
		).resolves.toMatchObject({valid: false, validation: {obliqueDependency: 'failed'}});
	});

	it.each([
		['missing destination', createFileSystem({destination: 'missing'})],
		['destination symlink', createFileSystem({destination: 'symlink'})],
		['destination outside parent', createFileSystem({destination: 'outside'})],
		['parent directory replaced after execution', createFileSystem({destination: 'parent-changed'})],
		['missing package JSON', createFileSystem({missingPackageJson: true})],
		['invalid package JSON', createFileSystem({packageJson: '{invalid'})],
		['non-object package JSON', createFileSystem({packageJson: '"not-an-object"'})],
		['missing Angular workspace', createFileSystem({angularJson: 'missing'})],
		['missing Oblique dependency', createFileSystem({dependencies: {'@angular/core': '^21.2.20'}})],
		[
			'empty Oblique dependency declaration',
			createFileSystem({dependencies: {'@oblique/oblique': '', '@angular/core': '^21.2.20'}}),
		],
		[
			'incompatible Oblique dependency',
			createFileSystem({dependencies: {'@oblique/oblique': '15.4.3', '@angular/core': '^21.2.20'}}),
		],
		[
			'non-matching longer Oblique dependency',
			createFileSystem({dependencies: {'@oblique/oblique': '^15.4.40', '@angular/core': '^21.2.20'}}),
		],
		[
			'non-semver Oblique declaration containing the expected version',
			createFileSystem({dependencies: {'@oblique/oblique': 'workspace:^15.4.4', '@angular/core': '^21.2.20'}}),
		],
		['missing Angular dependency', createFileSystem({dependencies: {'@oblique/oblique': '^15.4.4'}})],
		[
			'empty Angular dependency declaration',
			createFileSystem({dependencies: {'@oblique/oblique': '^15.4.4', '@angular/core': ''}}),
		],
		[
			'incompatible Angular dependency',
			createFileSystem({dependencies: {'@oblique/oblique': '^15.4.4', '@angular/core': '^20.0.0'}}),
		],
		[
			'non-semver Angular declaration containing the expected major',
			createFileSystem({dependencies: {'@oblique/oblique': '^15.4.4', '@angular/core': 'workspace:^21.2.20'}}),
		],
	])('rejects %s', async (_description, fileSystem) => {
		await expect(firstValueFrom(validateCreatedObliqueProject$(plan, fileSystem))).resolves.toMatchObject({
			valid: false,
		});
	});
});

function createFileSystem(
	options: {
		destination?: 'missing' | 'symlink' | 'outside' | 'parent-changed';
		packageJson?: string;
		missingPackageJson?: boolean;
		angularJson?: 'missing';
		dependencies?: Record<string, string>;
	} = {}
): ProjectValidationFileSystem {
	return {
		lstat: async path => {
			if (path === plan.destinationPath && options.destination === 'missing') {
				throw new Error('missing');
			}
			if (
				(path.endsWith('angular.json') && options.angularJson === 'missing') ||
				(path.endsWith('package.json') && options.missingPackageJson)
			) {
				throw new Error('missing');
			}
			return {
				isDirectory: () => path === plan.destinationPath,
				isFile: () => path !== plan.destinationPath,
				isSymbolicLink: () => path === plan.destinationPath && options.destination === 'symlink',
			};
		},
		realpath: async path => {
			if (options.destination === 'outside' && path === plan.destinationPath) {
				return '/outside/employee-portal';
			}
			return options.destination === 'parent-changed' && path === plan.parentDirectory ? '/changed' : path;
		},
		readFile: async () =>
			options.packageJson ??
			JSON.stringify({
				dependencies: options.dependencies ?? {'@oblique/oblique': '^15.4.4', '@angular/core': '^21.2.20'},
			}),
	};
}
