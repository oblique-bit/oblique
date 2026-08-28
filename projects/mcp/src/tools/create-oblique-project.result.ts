/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 14 RxJS execution result mapping and validation
 */

import {type Observable, map, of, switchMap} from 'rxjs';
import {type ProjectExecutionResult, sanitizeProjectOutput} from './oblique-project.executor.js';
import {type RevalidationFileSystem, destinationExists$} from './oblique-project.revalidation.js';
import {type ProjectValidationFileSystem, validateCreatedObliqueProject$} from './oblique-project.validator.js';
import type {ObliqueProjectPlan} from './oblique-project-plan.store.js';
import type {CreateObliqueProjectResult} from './create-oblique-project.contracts.js';

export interface ProjectResultEnvironment {
	fileSystem?: RevalidationFileSystem;
	validationFileSystem?: ProjectValidationFileSystem;
}

interface Output {
	stdoutTail: string;
	stderrTail: string;
	truncated: boolean;
}

interface FailureContext {
	code: Extract<CreateObliqueProjectResult, {status: 'blocked' | 'failed'}>['code'];
	message: string;
	plan: ObliqueProjectPlan;
	output: Output;
	partialProject: boolean;
	execution?: ProjectExecutionResult;
	reason?: 'NON_ZERO_EXIT' | 'INSTALLATION_FAILURE_MARKER' | 'SIGNAL_TERMINATION';
}

interface Validation {
	destination: 'passed';
	packageJson: 'passed';
	angularWorkspace: 'passed';
	obliqueDependency: 'passed';
	angularDependency: 'passed';
}

export function getExecutionResult$(
	plan: ObliqueProjectPlan,
	execution: ProjectExecutionResult,
	environment: ProjectResultEnvironment
): Observable<CreateObliqueProjectResult> {
	const output = getOutput(execution);
	return destinationExists$(plan.destinationPath, environment.fileSystem).pipe(
		switchMap(partialProject => {
			const failure = getExecutionFailure(execution, output);
			if (failure !== undefined) {
				return of(failed({...failure, plan, output, partialProject, execution}));
			}
			return validateCreatedObliqueProject$(plan, environment.validationFileSystem).pipe(
				map(validation =>
					validation.valid
						? completed({plan, execution, validation: validation.validation, output})
						: failed({
								code: 'POST_VALIDATION_FAILED',
								message: 'The created directory did not pass the required project validation.',
								plan,
								output,
								partialProject: true,
								execution,
							})
				)
			);
		})
	);
}

export function unexpectedFailure$(
	plan: ObliqueProjectPlan,
	environment: ProjectResultEnvironment | undefined
): Observable<CreateObliqueProjectResult> {
	return destinationExists$(plan.destinationPath, environment?.fileSystem).pipe(
		map(partialProject =>
			failed({
				code: 'SPAWN_FAILED',
				message: 'Unable to start the pinned Oblique CLI.',
				plan,
				output: {stdoutTail: '', stderrTail: '', truncated: false},
				partialProject,
			})
		)
	);
}

function getExecutionFailure(
	execution: ProjectExecutionResult,
	output: Output
): Pick<FailureContext, 'code' | 'message' | 'reason'> | undefined {
	if (execution.cancelled) {
		return {code: 'EXECUTION_CANCELLED', message: 'Project creation was cancelled.'};
	}
	if (execution.timedOut) {
		return {code: 'EXECUTION_TIMEOUT', message: 'Project creation exceeded the allowed execution time.'};
	}
	if (execution.exitCode === null) {
		return {code: 'SPAWN_FAILED', message: 'Unable to start the pinned Oblique CLI.'};
	}
	if (execution.signal !== null) {
		return cliFailure('SIGNAL_TERMINATION');
	}
	if (includesInstallationFailure(output)) {
		return cliFailure('INSTALLATION_FAILURE_MARKER');
	}
	if (execution.exitCode === 0) {
		return undefined;
	}
	return cliFailure('NON_ZERO_EXIT');
}

function cliFailure(
	reason: NonNullable<FailureContext['reason']>
): Pick<FailureContext, 'code' | 'message' | 'reason'> {
	return {code: 'CLI_EXECUTION_FAILED', message: 'The Oblique CLI reported a project creation failure.', reason};
}

function completed(context: {
	plan: ObliqueProjectPlan;
	execution: ProjectExecutionResult;
	validation: Validation;
	output: Output;
}): CreateObliqueProjectResult {
	const {plan, execution, validation, output} = context;
	return {
		status: 'completed',
		projectName: plan.projectName,
		destinationPath: plan.destinationPath,
		versions: {oblique: plan.obliqueVersion, obliqueCli: plan.obliqueCliVersion, angular: plan.angularVersion},
		npmrcMode: plan.npmrcMode,
		command: {executable: plan.executable, args: plan.args},
		process: {
			exitCode: execution.exitCode,
			signal: execution.signal,
			timedOut: execution.timedOut,
			cancelled: execution.cancelled,
			durationMs: execution.durationMs,
		},
		validation,
		output,
		executionPerformed: true,
		partialProject: false,
		cleanupRequired: false,
	};
}

function getOutput(execution: ProjectExecutionResult): Output {
	const stdout = sanitizeProjectOutput(execution.stdout);
	const stderr = sanitizeProjectOutput(execution.stderr);
	return {
		stdoutTail: stdout.value,
		stderrTail: stderr.value,
		truncated: execution.outputTruncated === true || stdout.truncated || stderr.truncated,
	};
}

function includesInstallationFailure(output: Output): boolean {
	return output.stdoutTail.includes('Installation failed:') || output.stderrTail.includes('Installation failed:');
}

function failed(context: FailureContext): CreateObliqueProjectResult {
	return {
		status: 'failed',
		code: context.code,
		message: context.message,
		projectName: context.plan.projectName,
		destinationPath: context.plan.destinationPath,
		output: context.output,
		partialProject: context.partialProject,
		cleanupRequired: context.partialProject,
		executionPerformed: true,
		...(context.execution === undefined
			? {}
			: {
					process: {
						exitCode: context.execution.exitCode,
						signal: context.execution.signal,
						timedOut: context.execution.timedOut,
						cancelled: context.execution.cancelled,
						durationMs: context.execution.durationMs,
					},
				}),
		...(context.reason === undefined ? {} : {reason: context.reason}),
	};
}
