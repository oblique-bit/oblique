/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 14 RxJS canonical project-plan revalidation
 */

import {lstat, realpath} from 'node:fs/promises';
import {resolve} from 'node:path';
import {type Observable, catchError, defer, from, map, of, switchMap} from 'rxjs';
import {isPathInside} from '../utils/path.js';
import {type PackageMetadata, getObliqueVersion} from './get-oblique-version.js';
import type {ObliqueProjectPlan} from './oblique-project-plan.store.js';
import {
	getAngularMajor,
	getVersionFailure,
	normalizeNodeVersion,
	supportsNodeVersion,
} from './prepare-oblique-project.version.js';

export interface RevalidationFileSystem {
	lstat: (path: string) => Promise<unknown>;
	realpath: (path: string) => Promise<string>;
}

export interface RevalidationOptions {
	currentNodeVersion?: string;
	fileSystem?: RevalidationFileSystem;
}

export type RevalidationFailure = 'DESTINATION_ALREADY_EXISTS' | 'REVALIDATION_FAILED' | undefined;

const hostFileSystem: RevalidationFileSystem = {lstat, realpath};

export function getRevalidationFailure$(
	plan: ObliqueProjectPlan,
	packageMetadata: PackageMetadata,
	options: RevalidationOptions = {}
): Observable<RevalidationFailure> {
	if (!hasValidPlanVersions(plan, packageMetadata, options.currentNodeVersion)) {
		return of('REVALIDATION_FAILED');
	}
	return validateCurrentLocation$(plan, options.fileSystem ?? hostFileSystem);
}

export function destinationExists$(
	destinationPath: string,
	fileSystem: RevalidationFileSystem = hostFileSystem
): Observable<boolean> {
	return defer(() => from(fileSystem.lstat(destinationPath))).pipe(
		map(() => true),
		catchError(() => of(false))
	);
}

function hasValidPlanVersions(
	plan: ObliqueProjectPlan,
	packageMetadata: PackageMetadata,
	currentNodeVersion: string | undefined
): boolean {
	const metadata = getObliqueVersion(packageMetadata);
	return (
		getVersionFailure(plan.obliqueVersion, metadata.obliqueVersion) === undefined &&
		plan.obliqueCliVersion === plan.obliqueVersion &&
		plan.angularVersion === getAngularMajor(metadata.angularVersion) &&
		plan.nodeRequirement === metadata.nodeRequirement &&
		supportsNodeVersion(normalizeNodeVersion(currentNodeVersion ?? process.version), metadata.nodeRequirement) &&
		sameArguments(plan.args, getExpectedArgs(plan))
	);
}

function validateCurrentLocation$(
	plan: ObliqueProjectPlan,
	fileSystem: RevalidationFileSystem
): Observable<RevalidationFailure> {
	return defer(() => from(fileSystem.realpath(plan.parentDirectory))).pipe(
		switchMap(parentDirectory => {
			const expectedDestination = resolve(parentDirectory, plan.projectName);
			if (
				parentDirectory !== plan.parentDirectory ||
				plan.destinationPath !== expectedDestination ||
				!isPathInside(parentDirectory, plan.destinationPath)
			) {
				return of('REVALIDATION_FAILED' as const);
			}
			return destinationStatus$(plan.destinationPath, fileSystem);
		}),
		catchError(() => of('REVALIDATION_FAILED' as const))
	);
}

function destinationStatus$(
	destinationPath: string,
	fileSystem: RevalidationFileSystem
): Observable<RevalidationFailure> {
	return defer(() => from(fileSystem.lstat(destinationPath))).pipe(
		map(() => 'DESTINATION_ALREADY_EXISTS' as const),
		catchError(error => of(isMissingPath(error) ? undefined : ('REVALIDATION_FAILED' as const)))
	);
}

function getExpectedArgs(plan: ObliqueProjectPlan): string[] {
	return [
		'--yes',
		`@oblique/cli@${plan.obliqueVersion}`,
		'new',
		plan.projectName,
		plan.npmrcMode === 'federal' ? '--npmrc' : '--no-npmrc',
	];
}

function sameArguments(left: string[], right: string[]): boolean {
	return left.length === right.length && left.every((argument, index) => argument === right[index]);
}

function isMissingPath(error: unknown): boolean {
	return typeof error === 'object' && error !== null && 'code' in error && Reflect.get(error, 'code') === 'ENOENT';
}
