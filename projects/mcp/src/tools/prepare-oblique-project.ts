/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 13 read-only Oblique project preparation tool
 */

import {realpath, stat} from 'node:fs/promises';
import {resolve} from 'node:path';
import type {McpServer} from '@modelcontextprotocol/server';
import {isPathInside} from '../utils/path.js';
import {type PackageMetadata, getObliqueVersion} from './get-oblique-version.js';
import {
	type BlockedProjectPreparation,
	type PrepareObliqueProjectInput,
	type PrepareObliqueProjectResult,
	type ProjectPreparationCheck,
	prepareObliqueProjectResultSchema,
	prepareObliqueProjectSchema,
} from './prepare-oblique-project.contracts.js';
import {
	type ProjectPreparationFileSystem,
	getCanonicalDirectory,
	pathExists,
} from './prepare-oblique-project.filesystem.js';
import {type NpmrcMode, ObliqueProjectPlanStore} from './oblique-project-plan.store.js';
import {blocked, getNodeValidatedPlan, passed} from './prepare-oblique-project.result.js';
import {getVersionFailure, unsafeObliqueCliVersions} from './prepare-oblique-project.version.js';

export {
	type PrepareObliqueProjectInput,
	type PrepareObliqueProjectResult,
	prepareObliqueProjectResultSchema,
	prepareObliqueProjectSchema,
	type ProjectPreparationFileSystem,
	unsafeObliqueCliVersions,
};

const projectNamePattern = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/u;

export const maximumProjectNameLength = 64;

export interface ProjectPreparationEnvironment {
	workingDirectory?: string;
	currentNodeVersion?: string;
	fileSystem?: ProjectPreparationFileSystem;
	pathIsInside?: (basePath: string, targetPath: string) => boolean;
	planStore?: ObliqueProjectPlanStore;
}

interface PreparedLocation {
	parentDirectory: string;
	destinationPath: string;
}

interface DestinationContext {
	parentDirectory: string;
	projectName: string;
	pathIsInside: (basePath: string, targetPath: string) => boolean;
	fileSystem: ProjectPreparationFileSystem;
	checks: ProjectPreparationCheck[];
}

interface InputContext {
	npmrcMode: NpmrcMode;
	versionInfo: ReturnType<typeof getObliqueVersion>;
	obliqueVersion: string;
}

const hostFileSystem: ProjectPreparationFileSystem = {stat, realpath};
const defaultProjectPlanStore = new ObliqueProjectPlanStore();

/** Validates a future project destination and returns an inert CLI plan. It never executes the plan. */
export async function prepareObliqueProject(
	input: PrepareObliqueProjectInput,
	packageMetadata: PackageMetadata,
	environment: ProjectPreparationEnvironment = {}
): Promise<PrepareObliqueProjectResult> {
	const checks: ProjectPreparationCheck[] = [];
	const validatedInput = getInputContext(input, packageMetadata, checks);
	if ('status' in validatedInput) {
		return validatedInput;
	}
	const location = await getPreparedLocation(input, environment, checks);
	if ('status' in location) {
		return location;
	}
	return getNodeValidatedPlan({
		input,
		obliqueVersion: validatedInput.obliqueVersion,
		versionInfo: validatedInput.versionInfo,
		location,
		checks,
		currentNodeVersion: environment.currentNodeVersion,
		npmrcMode: validatedInput.npmrcMode,
		planStore: environment.planStore ?? defaultProjectPlanStore,
	});
}

function getInputContext(
	input: PrepareObliqueProjectInput,
	packageMetadata: PackageMetadata,
	checks: ProjectPreparationCheck[]
): InputContext | BlockedProjectPreparation {
	const nameFailure = getProjectNameFailure(input.projectName, checks);
	if (nameFailure !== undefined) {
		return nameFailure;
	}
	const npmrcMode = getNpmrcMode(input.npmrcMode, checks);
	if (typeof npmrcMode !== 'string') {
		return npmrcMode;
	}
	const versionInfo = getObliqueVersion(packageMetadata);
	const obliqueVersion = input.obliqueVersion ?? versionInfo.obliqueVersion;
	const versionFailure = getVersionFailure(obliqueVersion, versionInfo.obliqueVersion);
	if (versionFailure !== undefined) {
		return blocked({...versionFailure, checks});
	}
	checks.push(passed('oblique-version'));
	return {npmrcMode, versionInfo, obliqueVersion};
}

export function registerPrepareObliqueProjectTool(
	server: McpServer,
	readPackageMetadata: () => Promise<PackageMetadata>,
	environment: ProjectPreparationEnvironment = {}
): void {
	server.registerTool(
		'prepare_oblique_project',
		{
			description:
				'Prepare a read-only, confirmation-required Oblique CLI project plan with the required application operator and contact metadata. Each successful call creates a fresh short-lived plan but never creates or modifies a project.',
			inputSchema: prepareObliqueProjectSchema,
			outputSchema: prepareObliqueProjectResultSchema,
			annotations: {
				readOnlyHint: true,
				destructiveHint: false,
				idempotentHint: false,
				openWorldHint: false,
			},
		},
		async input =>
			getProjectPreparationResponse(await prepareObliqueProject(input, await readPackageMetadata(), environment))
	);
}

function getProjectNameFailure(
	projectName: string,
	checks: ProjectPreparationCheck[]
): BlockedProjectPreparation | undefined {
	if (
		projectName.length > 0 &&
		projectName.length <= maximumProjectNameLength &&
		projectNamePattern.test(projectName)
	) {
		checks.push(passed('project-name'));
		return undefined;
	}
	return blocked({
		code: 'INVALID_PROJECT_NAME',
		failedCheck: 'project-name',
		message: 'Project names must use lowercase kebab-case and be at most 64 characters long.',
		checks,
	});
}

function getNpmrcMode(
	npmrcMode: PrepareObliqueProjectInput['npmrcMode'],
	checks: ProjectPreparationCheck[]
): NpmrcMode | BlockedProjectPreparation {
	if (npmrcMode === 'federal' || npmrcMode === 'external') {
		checks.push(passed('npmrc-mode'));
		return npmrcMode;
	}
	return blocked({
		code: 'NPMRC_MODE_REQUIRED',
		failedCheck: 'npmrc-mode',
		message: 'Select either the federal or external npmrc mode before preparing a project.',
		checks,
	});
}

async function getPreparedLocation(
	input: PrepareObliqueProjectInput,
	environment: ProjectPreparationEnvironment,
	checks: ProjectPreparationCheck[]
): Promise<PreparedLocation | BlockedProjectPreparation> {
	const resolvedParentDirectory = resolve(environment.workingDirectory ?? process.cwd(), input.parentDirectory ?? '.');
	const fileSystem = environment.fileSystem ?? hostFileSystem;
	const parentDirectory = await getCanonicalDirectory(resolvedParentDirectory, fileSystem);
	if (parentDirectory === undefined) {
		return blocked({
			code: 'INVALID_PARENT_DIRECTORY',
			failedCheck: 'parent-directory',
			message: 'The selected parent directory does not exist or is not a directory.',
			checks,
		});
	}
	checks.push(passed('parent-directory'));
	return getDestination({
		parentDirectory,
		projectName: input.projectName,
		pathIsInside: environment.pathIsInside ?? isPathInside,
		fileSystem,
		checks,
	});
}

async function getDestination({
	parentDirectory,
	projectName,
	pathIsInside,
	fileSystem,
	checks,
}: DestinationContext): Promise<PreparedLocation | BlockedProjectPreparation> {
	const destinationPath = resolve(parentDirectory, projectName);
	if (!pathIsInside(parentDirectory, destinationPath)) {
		return blocked({
			code: 'PATH_OUTSIDE_ALLOWED_DIRECTORY',
			failedCheck: 'destination',
			message: 'The project destination must remain inside the selected parent directory.',
			checks,
		});
	}
	if (await pathExists(destinationPath, fileSystem)) {
		return blocked({
			code: 'DESTINATION_ALREADY_EXISTS',
			failedCheck: 'destination',
			message: 'The project destination already exists. Choose a different project name or parent directory.',
			checks,
		});
	}
	checks.push(passed('destination'));
	return {parentDirectory, destinationPath};
}

function getProjectPreparationResponse(result: PrepareObliqueProjectResult): {
	content: {type: 'text'; text: string}[];
	structuredContent: PrepareObliqueProjectResult;
	isError?: true;
} {
	return {
		content: [{type: 'text', text: JSON.stringify(result)}],
		structuredContent: result,
		...(result.status === 'blocked' ? {isError: true} : {}),
	};
}
