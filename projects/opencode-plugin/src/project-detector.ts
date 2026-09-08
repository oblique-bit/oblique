import {existsSync, readFileSync} from 'node:fs';
import {dirname, resolve} from 'node:path';

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun' | 'unknown';

export interface ObliqueProjectInfo {
	projectRoot: string;
	isAngularProject: boolean;
	isObliqueProject: boolean;
	angularVersion?: string;
	obliqueVersion?: string;
	packageManager?: PackageManager;
}

interface PackageJsonLike {
	dependencies?: Record<string, unknown>;
	devDependencies?: Record<string, unknown>;
	packageManager?: unknown;
	workspaces?: unknown;
}

interface DetectorOptions {
	readFile?: (path: string) => string;
	pathExists?: (path: string) => boolean;
}

interface ProjectPackageCandidate {
	directory: string;
	packageJson: PackageJsonLike | undefined;
}

const angularPackageName = '@angular/core';
const obliquePackageName = '@oblique/oblique';

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeVersion(tag: string | undefined): string | undefined {
	if (tag === undefined || tag.trim() === '') {
		return undefined;
	}

	const trimmed = tag.trim();
	const normalized = trimmed.replace(/^[\^~><=\s]+/u, '');
	return normalized || undefined;
}

function readPackageJson(filePath: string, readFile: (path: string) => string): PackageJsonLike | undefined {
	try {
		const parsed = JSON.parse(readFile(filePath)) as unknown;
		if (!isRecord(parsed)) {
			return undefined;
		}
		return parsed as PackageJsonLike;
	} catch {
		return undefined;
	}
}

function hasAngularManifest(directory: string, pathExists: (path: string) => boolean): boolean {
	return ['angular.json', 'workspace.json', 'project.json'].some(fileName => {
		return pathExists(`${directory}/${fileName}`);
	});
}

function collectAncestorDirectories(startDirectory: string): string[] {
	const directories: string[] = [];
	let current = resolve(startDirectory);
	for (;;) {
		directories.push(current);
		const parent = dirname(current);
		if (parent === current) {
			break;
		}
		current = parent;
	}
	return directories;
}

function getDeclaredDependencyVersion(
	packageJson: PackageJsonLike | undefined,
	dependencyName: string
): string | undefined {
	if (packageJson === undefined) {
		return undefined;
	}

	for (const sectionName of ['dependencies', 'devDependencies'] as const) {
		const version = packageJson[sectionName]?.[dependencyName];
		if (typeof version === 'string') {
			return normalizeVersion(version);
		}
	}

	return undefined;
}

function collectProjectCandidates(
	startDirectory: string,
	pathExists: (path: string) => boolean,
	readFile: (path: string) => string
): ProjectPackageCandidate[] {
	const projectCandidates: ProjectPackageCandidate[] = [];
	const directories = collectAncestorDirectories(startDirectory);

	for (const directory of directories) {
		const packageJsonPath = `${directory}/package.json`;
		if (pathExists(packageJsonPath)) {
			projectCandidates.push({
				directory,
				packageJson: readPackageJson(packageJsonPath, readFile),
			});
		}
	}

	return projectCandidates;
}

function detectPackageManagerForDirectory(directory: string, pathExists: (path: string) => boolean): PackageManager {
	for (const fileName of ['pnpm-lock.yaml', 'yarn.lock', 'package-lock.json', 'bun.lock', 'bun.lockb']) {
		if (pathExists(`${directory}/${fileName}`)) {
			if (fileName === 'pnpm-lock.yaml') {
				return 'pnpm';
			}
			if (fileName === 'yarn.lock') {
				return 'yarn';
			}
			if (fileName === 'bun.lock' || fileName === 'bun.lockb') {
				return 'bun';
			}
			return 'npm';
		}
	}
	return 'unknown';
}

function resolvePackageManager(
	packageJson: PackageJsonLike | undefined,
	startDirectory: string,
	pathExists: (path: string) => boolean
): PackageManager {
	if (typeof packageJson?.packageManager === 'string') {
		const value = packageJson.packageManager.trim();
		const packageManager = value.split('@', 1)[0]?.trim();
		if (
			packageManager === 'npm' ||
			packageManager === 'pnpm' ||
			packageManager === 'yarn' ||
			packageManager === 'bun'
		) {
			return packageManager;
		}
	}

	for (const directory of collectAncestorDirectories(startDirectory)) {
		const detectedInstaller = detectPackageManagerForDirectory(directory, pathExists);
		if (detectedInstaller !== 'unknown') {
			return detectedInstaller;
		}
	}

	return 'unknown';
}

function resolveProjectRoot(
	projectCandidates: ProjectPackageCandidate[],
	startDirectory: string,
	pathExists: (path: string) => boolean
): string {
	const workspaceRoot = projectCandidates.find(({directory, packageJson}) => {
		return Boolean(packageJson) && (hasAngularManifest(directory, pathExists) || Boolean(packageJson?.workspaces));
	});
	if (workspaceRoot !== undefined) {
		return workspaceRoot.directory;
	}
	return projectCandidates[0]?.directory ?? resolve(startDirectory);
}

function resolveDependencyVersion(
	projectCandidates: ProjectPackageCandidate[],
	dependencyName: string
): string | undefined {
	for (const {packageJson} of projectCandidates) {
		const version = getDeclaredDependencyVersion(packageJson, dependencyName);
		if (version !== undefined) {
			return version;
		}
	}
	return undefined;
}

export function detectObliqueProjectInfo(startDirectory: string, options: DetectorOptions = {}): ObliqueProjectInfo {
	const readFile = options.readFile ?? ((path: string) => readFileSync(path, 'utf8'));
	const pathExists = options.pathExists ?? existsSync;
	const projectCandidates = collectProjectCandidates(startDirectory, pathExists, readFile);
	const projectRoot = resolveProjectRoot(projectCandidates, startDirectory, pathExists);
	const packageJson = projectCandidates.find(candidate => candidate.directory === projectRoot)?.packageJson;
	const angularVersion = resolveDependencyVersion(projectCandidates, angularPackageName);
	const obliqueVersion = resolveDependencyVersion(projectCandidates, obliquePackageName);
	const isAngularProject =
		Boolean(angularVersion) ||
		hasAngularManifest(projectRoot, pathExists) ||
		projectCandidates.some(candidate => {
			return Boolean(getDeclaredDependencyVersion(candidate.packageJson, angularPackageName));
		});
	const isObliqueProject =
		Boolean(obliqueVersion) ||
		projectCandidates.some(candidate => {
			return Boolean(getDeclaredDependencyVersion(candidate.packageJson, obliquePackageName));
		});
	const packageManager = resolvePackageManager(packageJson, startDirectory, pathExists);

	return {
		projectRoot,
		isAngularProject,
		isObliqueProject,
		angularVersion,
		obliqueVersion,
		packageManager,
	};
}

export function detectProjectInfo(startDirectory: string, options: DetectorOptions = {}): ObliqueProjectInfo {
	return detectObliqueProjectInfo(startDirectory, options);
}
