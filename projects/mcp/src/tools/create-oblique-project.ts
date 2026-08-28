/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 14 RxJS controlled execution from an in-memory Oblique project plan
 */

import type {McpServer} from '@modelcontextprotocol/server';
import {type Observable, catchError, defaultIfEmpty, defer, finalize, firstValueFrom, from, of, switchMap} from 'rxjs';
import {NodeProjectExecutor, type ProjectExecutor, buildProjectChildEnvironment} from './oblique-project.executor.js';
import type {ObliqueProjectPlan, ObliqueProjectPlanStore} from './oblique-project-plan.store.js';
import {type RevalidationFileSystem, getRevalidationFailure$} from './oblique-project.revalidation.js';
import type {PackageMetadata} from './get-oblique-version.js';
import {
	type CreateObliqueProjectInput,
	type CreateObliqueProjectResult,
	createObliqueProjectResultSchema,
	createObliqueProjectSchema,
} from './create-oblique-project.contracts.js';
import {getExecutionResult$, unexpectedFailure$} from './create-oblique-project.result.js';
import type {ProjectValidationFileSystem} from './oblique-project.validator.js';
import {getAbortSignal, getCreateResponse, getPlanCode} from './create-oblique-project.support.js';

export {
	createObliqueProjectResultSchema,
	createObliqueProjectSchema,
	type CreateObliqueProjectInput,
	type CreateObliqueProjectResult,
};
export interface ProjectCreationEnvironment {
	currentNodeVersion?: string;
	platform?: NodeJS.Platform;
	fileSystem?: RevalidationFileSystem;
	validationFileSystem?: ProjectValidationFileSystem;
	executor?: ProjectExecutor;
	childEnvironment?: NodeJS.ProcessEnv;
}
export interface ProjectCreationContext {
	packageMetadata: PackageMetadata;
	planStore: ObliqueProjectPlanStore;
	environment?: ProjectCreationEnvironment;
	signal?: AbortSignal;
}
export interface CreateObliqueProjectToolOptions {
	planStore: ObliqueProjectPlanStore;
	environment?: ProjectCreationEnvironment;
}

/** Executes only a previously prepared canonical plan after exact user confirmation. */
export function createObliqueProject$(
	input: CreateObliqueProjectInput,
	context: ProjectCreationContext
): Observable<CreateObliqueProjectResult> {
	return defer(() => {
		const plan = getPreparedPlan(input, context.planStore);
		if ('status' in plan) {
			return of(plan);
		}
		if (input.confirmation !== `CREATE ${plan.projectName}`) {
			return of(
				blocked('CONFIRMATION_REQUIRED', 'Enter the exact confirmation phrase shown by the prepared plan.', plan)
			);
		}
		if (!context.planStore.acquireDestination(plan.destinationPath)) {
			return of(
				blocked('PROJECT_CREATION_IN_PROGRESS', 'A project creation is already in progress for this destination.', plan)
			);
		}
		return createLockedProject$(input.planId, plan, context);
	});
}

export function registerCreateObliqueProjectTool(
	server: McpServer,
	readPackageMetadata: () => Promise<PackageMetadata>,
	options: CreateObliqueProjectToolOptions
): void {
	server.registerTool(
		'create_oblique_project',
		{
			description:
				'Create files by downloading and executing a pinned Oblique CLI package. Requires a prepared single-use plan and exact confirmation, refuses existing destinations, and may leave partial files if the CLI fails.',
			inputSchema: createObliqueProjectSchema,
			outputSchema: createObliqueProjectResultSchema,
			annotations: {readOnlyHint: false, destructiveHint: true, idempotentHint: false, openWorldHint: true},
		},
		async (input, extra) =>
			getCreateResponse(
				await firstValueFrom(
					defer(() => from(readPackageMetadata())).pipe(
						switchMap(packageMetadata =>
							createObliqueProject$(input, {
								packageMetadata,
								planStore: options.planStore,
								environment: options.environment,
								signal: getAbortSignal(extra),
							})
						),
						defaultIfEmpty(blocked('REVALIDATION_FAILED', 'Project creation produced no result.')),
						catchError(() => of(blocked('REVALIDATION_FAILED', 'Project creation could not be safely started.')))
					)
				)
			)
	);
}

function createLockedProject$(
	planId: string,
	preparedPlan: ObliqueProjectPlan,
	context: ProjectCreationContext
): Observable<CreateObliqueProjectResult> {
	const consumed = context.planStore.take(planId);
	if (consumed.status !== 'ready') {
		context.planStore.releaseDestination(preparedPlan.destinationPath);
		return of(blockedFromPlan(consumed.status));
	}
	const environment = context.environment ?? {};
	return getRevalidationFailure$(consumed.plan, context.packageMetadata, environment).pipe(
		switchMap(failure =>
			failure === undefined
				? executePlan$(consumed.plan, context, environment)
				: of(blocked(failure, 'The prepared plan no longer passes pre-execution validation.', consumed.plan))
		),
		catchError(() => unexpectedFailure$(consumed.plan, environment)),
		finalize(() => context.planStore.releaseDestination(preparedPlan.destinationPath))
	);
}

function getPreparedPlan(
	input: CreateObliqueProjectInput,
	planStore: ObliqueProjectPlanStore
): ObliqueProjectPlan | CreateObliqueProjectResult {
	const prepared = planStore.get(input.planId);
	return prepared.status === 'ready' ? prepared.plan : blockedFromPlan(prepared.status);
}

function executePlan$(
	plan: ObliqueProjectPlan,
	context: ProjectCreationContext,
	environment: ProjectCreationEnvironment
): Observable<CreateObliqueProjectResult> {
	return getProjectExecutor(environment)
		.execute$({
			executable: environment.platform === 'win32' ? 'npx.cmd' : 'npx',
			args: plan.args,
			cwd: plan.parentDirectory,
			environment: buildProjectChildEnvironment(environment.childEnvironment),
			signal: context.signal,
		})
		.pipe(switchMap(execution => getExecutionResult$(plan, execution, environment)));
}

/* istanbul ignore next -- tests inject execution and must never invoke the real npm CLI. */
function getProjectExecutor(environment: ProjectCreationEnvironment): ProjectExecutor {
	return environment.executor ?? new NodeProjectExecutor();
}

function blockedFromPlan(status: 'not-found' | 'expired' | 'already-used'): CreateObliqueProjectResult {
	return blocked(
		getPlanCode(status),
		'The prepared plan is unavailable. Prepare a new project plan before creating files.'
	);
}

function blocked(
	code: Extract<CreateObliqueProjectResult, {status: 'blocked' | 'failed'}>['code'],
	message: string,
	plan?: ObliqueProjectPlan
): CreateObliqueProjectResult {
	return {
		status: 'blocked',
		code,
		message,
		...(plan === undefined ? {} : {projectName: plan.projectName, destinationPath: plan.destinationPath}),
		partialProject: false,
		cleanupRequired: false,
		executionPerformed: false,
	};
}
