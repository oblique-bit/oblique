/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 14 RxJS read-only created-project validation
 */

import {lstat, readFile, realpath} from 'node:fs/promises';
import {resolve} from 'node:path';
import {intersects, satisfies} from 'semver';
import {type Observable, catchError, defer, forkJoin, from, map, of, switchMap} from 'rxjs';
import {isPathInside} from '../utils/path.js';
import type {ObliqueProjectPlan} from './oblique-project-plan.store.js';

export interface ProjectValidationFileSystem {
	lstat: (path: string) => Promise<{isDirectory: () => boolean; isFile: () => boolean; isSymbolicLink: () => boolean}>;
	realpath: (path: string) => Promise<string>;
	readFile: (path: string, encoding: 'utf8') => Promise<string>;
}

interface Validation {
	destination: 'passed' | 'failed';
	packageJson: 'passed' | 'failed';
	angularWorkspace: 'passed' | 'failed';
	obliqueDependency: 'passed' | 'failed';
	angularDependency: 'passed' | 'failed';
}

interface PassedValidation {
	destination: 'passed';
	packageJson: 'passed';
	angularWorkspace: 'passed';
	obliqueDependency: 'passed';
	angularDependency: 'passed';
}

export type ProjectValidationResult =
	{valid: true; validation: PassedValidation} | {valid: false; validation: Validation};

const hostFileSystem: ProjectValidationFileSystem = {lstat, realpath, readFile};

export function validateCreatedObliqueProject$(
	plan: ObliqueProjectPlan,
	fileSystem: ProjectValidationFileSystem = hostFileSystem
): Observable<ProjectValidationResult> {
	return isRealDestination$(plan, fileSystem).pipe(
		switchMap(destination => {
			if (!destination) {
				return of(getValidationResult({destination: false, packageJson: undefined, angularWorkspace: false, plan}));
			}
			return readPackageJson$(plan.destinationPath, fileSystem).pipe(
				switchMap(packageJson =>
					isRegularFile$(resolve(plan.destinationPath, 'angular.json'), fileSystem).pipe(
						map(angularWorkspace => getValidationResult({destination: true, packageJson, angularWorkspace, plan}))
					)
				)
			);
		})
	);
}

function isRealDestination$(plan: ObliqueProjectPlan, fileSystem: ProjectValidationFileSystem): Observable<boolean> {
	return forkJoin({
		destinationStat: stat$(plan.destinationPath, fileSystem),
		canonicalParent: realpath$(plan.parentDirectory, fileSystem),
		canonicalDestination: realpath$(plan.destinationPath, fileSystem),
	}).pipe(
		map(
			({destinationStat, canonicalParent, canonicalDestination}) =>
				destinationStat.isDirectory() &&
				!destinationStat.isSymbolicLink() &&
				canonicalParent === plan.parentDirectory &&
				isPathInside(canonicalParent, canonicalDestination)
		),
		catchError(() => of(false))
	);
}

function readPackageJson$(
	destinationPath: string,
	fileSystem: ProjectValidationFileSystem
): Observable<Record<string, unknown> | undefined> {
	const packageJsonPath = resolve(destinationPath, 'package.json');
	return isRegularFile$(packageJsonPath, fileSystem).pipe(
		switchMap(isRegularFile => (isRegularFile ? readJson$(packageJsonPath, fileSystem) : of(undefined)))
	);
}

function readJson$(
	path: string,
	fileSystem: ProjectValidationFileSystem
): Observable<Record<string, unknown> | undefined> {
	return defer(() => from(fileSystem.readFile(path, 'utf8'))).pipe(
		map(source => {
			const parsed: unknown = JSON.parse(source);
			return isRecord(parsed) ? parsed : undefined;
		}),
		catchError(() => of(undefined))
	);
}

function isRegularFile$(path: string, fileSystem: ProjectValidationFileSystem): Observable<boolean> {
	return stat$(path, fileSystem).pipe(
		map(fileStat => fileStat.isFile() && !fileStat.isSymbolicLink()),
		catchError(() => of(false))
	);
}

function stat$(
	path: string,
	fileSystem: Pick<ProjectValidationFileSystem, 'lstat'>
): Observable<{isDirectory: () => boolean; isFile: () => boolean; isSymbolicLink: () => boolean}> {
	return defer(() => from(fileSystem.lstat(path)));
}

function realpath$(path: string, fileSystem: Pick<ProjectValidationFileSystem, 'realpath'>): Observable<string> {
	return defer(() => from(fileSystem.realpath(path)));
}

function getValidationResult(context: {
	destination: boolean;
	packageJson: Record<string, unknown> | undefined;
	angularWorkspace: boolean;
	plan: ObliqueProjectPlan;
}): ProjectValidationResult {
	const {destination, packageJson, angularWorkspace, plan} = context;
	const dependencies = packageJson === undefined ? {} : getDependencies(packageJson);
	const validation = {
		destination: destination ? 'passed' : 'failed',
		packageJson: packageJson === undefined ? 'failed' : 'passed',
		angularWorkspace: angularWorkspace ? 'passed' : 'failed',
		obliqueDependency: isCompatibleRange(plan.obliqueVersion, dependencies['@oblique/oblique']) ? 'passed' : 'failed',
		angularDependency: isCompatibleAngular(dependencies['@angular/core'], plan.angularVersion) ? 'passed' : 'failed',
	} as const;
	return isPassedValidation(validation) ? {valid: true, validation} : {valid: false, validation};
}

function getDependencies(packageJson: Record<string, unknown>): Record<string, string> {
	return {...getStringRecord(packageJson['dependencies']), ...getStringRecord(packageJson['devDependencies'])};
}

function getStringRecord(value: unknown): Record<string, string> {
	return isRecord(value)
		? Object.fromEntries(
				Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === 'string')
			)
		: {};
}

function isCompatibleAngular(declaredVersion: string | undefined, expectedMajor: string): boolean {
	const major = Number(expectedMajor);
	if (declaredVersion === undefined || declaredVersion.trim().length === 0 || !Number.isSafeInteger(major)) {
		return false;
	}
	try {
		return intersects(declaredVersion, `>=${major}.0.0 <${major + 1}.0.0`, {includePrerelease: false});
	} catch {
		return false;
	}
}

function isCompatibleRange(expectedVersion: string, declaredVersion: string | undefined): boolean {
	return (
		declaredVersion !== undefined && declaredVersion.trim().length > 0 && satisfies(expectedVersion, declaredVersion)
	);
}

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isPassedValidation(validation: Validation): validation is PassedValidation {
	return Object.values(validation).every(value => value === 'passed');
}
