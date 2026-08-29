/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 14 controlled project creation tests with injected execution
 */

import type {McpServer} from '@modelcontextprotocol/server';
import {realpath} from 'node:fs/promises';
import {resolve} from 'node:path';
import {EMPTY, Subject, defer, firstValueFrom, from, of, throwError} from 'rxjs';
import {
	type CreateObliqueProjectResult,
	type ProjectCreationContext,
	type ProjectCreationEnvironment,
	createObliqueProject$,
	createObliqueProjectResultSchema,
	createObliqueProjectSchema,
	registerCreateObliqueProjectTool,
} from './create-oblique-project.js';
import type {PackageMetadata} from './get-oblique-version.js';
import {type ObliqueProjectPlan, ObliqueProjectPlanStore} from './oblique-project-plan.store.js';
import {
	NodeProjectExecutor,
	type ProjectExecutionRequest,
	type ProjectExecutionResult,
} from './oblique-project.executor.js';

const packageMetadata: PackageMetadata = {
	version: '15.4.4',
	engines: {node: '>=22.12.0'},
	dependencies: {'@angular/core': '^21.2.20'},
	repository: {url: 'https://github.com/oblique-bit/oblique.git'},
};

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
	npmrcMode: 'federal',
	executable: 'npx',
	args: [
		'--yes',
		'@oblique/cli@15.4.4',
		'new',
		'employee-portal',
		'--applicationOperator=Federal Test Office',
		'--contact=accessibility@example.test',
		'--npmrc',
	],
};

const successfulExecution: ProjectExecutionResult = {
	exitCode: 0,
	signal: null,
	stdout: 'Created employee-portal',
	stderr: '',
	timedOut: false,
	cancelled: false,
	durationMs: 10,
};

function createObliqueProject(
	input: Parameters<typeof createObliqueProject$>[0],
	context: ProjectCreationContext
): Promise<CreateObliqueProjectResult> {
	return firstValueFrom(createObliqueProject$(input, context));
}

describe('create_oblique_project tool', () => {
	it('validates the only two accepted execution inputs and structured results', () => {
		expect(createObliqueProjectSchema.safeParse({planId: 'plan', confirmation: 'CREATE employee-portal'}).success).toBe(
			true
		);
		expect(
			createObliqueProjectSchema.safeParse({planId: 'plan', confirmation: 'CREATE employee-portal', args: []}).success
		).toBe(false);
		expect(
			createObliqueProjectResultSchema.safeParse({
				status: 'blocked',
				code: 'CONFIRMATION_REQUIRED',
				message: 'confirmation required',
				partialProject: false,
				cleanupRequired: false,
				executionPerformed: false,
			}).success
		).toBe(true);
	});

	it('requires an existing single-use plan and exact confirmation before invoking the executor', async () => {
		const store = new ObliqueProjectPlanStore();
		const planId = storePlan(store, plan);
		const execute = jest
			.fn<Promise<ProjectExecutionResult>, [ProjectExecutionRequest]>()
			.mockResolvedValue(successfulExecution);
		const context = createContext(store, {executor: {execute}});

		await expect(
			createObliqueProject({planId, confirmation: 'create employee-portal'}, context)
		).resolves.toMatchObject({
			status: 'blocked',
			code: 'CONFIRMATION_REQUIRED',
			executionPerformed: false,
		});
		expect(execute).not.toHaveBeenCalled();

		await expect(
			createObliqueProject({planId, confirmation: 'CREATE employee-portal'}, context)
		).resolves.toMatchObject({
			status: 'completed',
			command: {executable: 'npx', args: plan.args},
			npmrcMode: 'federal',
			executionPerformed: true,
			partialProject: false,
		});
		expect(execute).toHaveBeenCalledWith(
			expect.objectContaining({
				executable: 'npx',
				args: plan.args,
				cwd: plan.parentDirectory,
			})
		);
		await expect(
			createObliqueProject({planId, confirmation: 'CREATE employee-portal'}, context)
		).resolves.toMatchObject({
			status: 'blocked',
			code: 'PLAN_ALREADY_USED',
		});
	});

	it('blocks unknown, expired, locked, and revalidated existing destinations without execution', async () => {
		let now = 0;
		const store = new ObliqueProjectPlanStore({now: () => now, ttlMilliseconds: 1_000});
		const execute = jest
			.fn<Promise<ProjectExecutionResult>, [ProjectExecutionRequest]>()
			.mockResolvedValue(successfulExecution);
		await expect(
			createObliqueProject(
				{planId: 'unknown', confirmation: 'CREATE employee-portal'},
				createContext(store, {executor: {execute}})
			)
		).resolves.toMatchObject({
			code: 'PLAN_NOT_FOUND',
		});
		const expiredPlanId = storePlan(store, plan);
		now = 1_000;
		await expect(
			createObliqueProject(
				{planId: expiredPlanId, confirmation: 'CREATE employee-portal'},
				createContext(store, {executor: {execute}})
			)
		).resolves.toMatchObject({
			code: 'PLAN_EXPIRED',
		});

		now = 0;
		const lockedPlanId = storePlan(store, plan);
		store.acquireDestination(plan.destinationPath);
		await expect(
			createObliqueProject(
				{planId: lockedPlanId, confirmation: 'CREATE employee-portal'},
				createContext(store, {executor: {execute}})
			)
		).resolves.toMatchObject({
			code: 'PROJECT_CREATION_IN_PROGRESS',
		});
		store.releaseDestination(plan.destinationPath);

		const existingPlanId = storePlan(store, plan);
		await expect(
			createObliqueProject(
				{planId: existingPlanId, confirmation: 'CREATE employee-portal'},
				createContext(store, {executor: {execute}, fileSystem: existingDestinationFileSystem()})
			)
		).resolves.toMatchObject({code: 'DESTINATION_ALREADY_EXISTS', executionPerformed: false});
		expect(execute).not.toHaveBeenCalled();
	});

	it('does not consume a correctly confirmed plan while another creation holds its destination lock', async () => {
		const store = new ObliqueProjectPlanStore();
		const planId = storePlan(store, plan);
		const execute = jest
			.fn<Promise<ProjectExecutionResult>, [ProjectExecutionRequest]>()
			.mockResolvedValue(successfulExecution);
		store.acquireDestination(plan.destinationPath);

		await expect(
			createObliqueProject(
				{planId, confirmation: 'CREATE employee-portal'},
				createContext(store, {executor: {execute}})
			)
		).resolves.toMatchObject({status: 'blocked', code: 'PROJECT_CREATION_IN_PROGRESS'});
		store.releaseDestination(plan.destinationPath);
		await expect(
			createObliqueProject(
				{planId, confirmation: 'CREATE employee-portal'},
				createContext(store, {executor: {execute}})
			)
		).resolves.toMatchObject({status: 'completed'});
		expect(execute).toHaveBeenCalledTimes(1);
	});

	it('serializes simultaneous creations for one destination and releases the lock for retry', async () => {
		const store = new ObliqueProjectPlanStore();
		const firstPlanId = storePlan(store, plan);
		const secondPlanId = storePlan(store, plan);
		const firstExecution = new Subject<ProjectExecutionResult>();
		const executionStarted = new Subject<void>();
		const execute$ = jest
			.fn()
			.mockReturnValueOnce(
				defer(() => {
					executionStarted.next();
					return firstExecution;
				})
			)
			.mockReturnValueOnce(of(successfulExecution));
		const context = createContext(store, {executor: {execute$}});
		const first = createObliqueProject({planId: firstPlanId, confirmation: 'CREATE employee-portal'}, context);

		await expect(
			createObliqueProject({planId: secondPlanId, confirmation: 'CREATE employee-portal'}, context)
		).resolves.toMatchObject({code: 'PROJECT_CREATION_IN_PROGRESS'});
		await firstValueFrom(executionStarted);
		firstExecution.next(successfulExecution);
		firstExecution.complete();
		await expect(first).resolves.toMatchObject({status: 'completed'});
		await expect(
			createObliqueProject({planId: secondPlanId, confirmation: 'CREATE employee-portal'}, context)
		).resolves.toMatchObject({status: 'completed'});
	});

	it.each([
		[{currentNodeVersion: '22.11.0'}, 'REVALIDATION_FAILED'],
		[
			{fileSystem: {realpath: async () => '/changed', lstat: async () => Promise.reject(missingPathError())}},
			'REVALIDATION_FAILED',
		],
		[
			{
				fileSystem: {
					realpath: async () => {
						throw new Error('missing');
					},
					lstat: async () => Promise.reject(missingPathError()),
				},
			},
			'REVALIDATION_FAILED',
		],
		[
			{
				fileSystem: {
					realpath: async path => path,
					lstat: async () => {
						throw new Error('denied');
					},
				},
			},
			'REVALIDATION_FAILED',
		],
	])('blocks changed runtime preconditions: %s', async (environment, code) => {
		const store = new ObliqueProjectPlanStore();
		const planId = storePlan(store, plan);
		const execute = jest.fn<Promise<ProjectExecutionResult>, [ProjectExecutionRequest]>();

		await expect(
			createObliqueProject(
				{planId, confirmation: 'CREATE employee-portal'},
				createContext(store, {executor: {execute}, ...environment})
			)
		).resolves.toMatchObject({
			status: 'blocked',
			code,
		});
		expect(execute).not.toHaveBeenCalled();
	});

	it.each([
		[{...plan, obliqueVersion: '15.4.1'}, 'REVALIDATION_FAILED'],
		[{...plan, args: [...plan.args, '--untrusted']}, 'REVALIDATION_FAILED'],
	])('revalidates canonical versions and arguments before execution', async (modifiedPlan, code) => {
		const store = new ObliqueProjectPlanStore();
		const planId = storePlan(store, modifiedPlan);
		const execute = jest.fn<Promise<ProjectExecutionResult>, [ProjectExecutionRequest]>();

		await expect(
			createObliqueProject(
				{planId, confirmation: 'CREATE employee-portal'},
				createContext(store, {executor: {execute}})
			)
		).resolves.toMatchObject({
			status: 'blocked',
			code,
		});
		expect(execute).not.toHaveBeenCalled();
	});

	it.each([
		[{...successfulExecution, exitCode: 1}, 'CLI_EXECUTION_FAILED', 'NON_ZERO_EXIT'],
		[
			{...successfulExecution, stdout: 'Installation failed: unable to install'},
			'CLI_EXECUTION_FAILED',
			'INSTALLATION_FAILURE_MARKER',
		],
		[{...successfulExecution, signal: 'SIGTERM'}, 'CLI_EXECUTION_FAILED', 'SIGNAL_TERMINATION'],
		[{...successfulExecution, exitCode: null}, 'SPAWN_FAILED', undefined],
		[{...successfulExecution, timedOut: true}, 'EXECUTION_TIMEOUT', undefined],
		[{...successfulExecution, cancelled: true}, 'EXECUTION_CANCELLED', undefined],
	])('preserves partial projects when execution fails: %s', async (execution, code, reason) => {
		const store = new ObliqueProjectPlanStore();
		const planId = storePlan(store, plan);
		let destinationExists = false;
		const context = createContext(store, {
			executor: {
				execute: async () => {
					destinationExists = true;
					return execution;
				},
			},
			fileSystem: changingDestinationFileSystem(() => destinationExists),
		});

		await expect(
			createObliqueProject({planId, confirmation: 'CREATE employee-portal'}, context)
		).resolves.toMatchObject({
			status: 'failed',
			code,
			...(reason === undefined ? {} : {reason}),
			partialProject: true,
			cleanupRequired: true,
		});
	});

	it('marks a successful process as failed when post-validation fails and registers destructive annotations', async () => {
		const store = new ObliqueProjectPlanStore();
		const planId = storePlan(store, plan);
		const failedValidation = createContext(store, {
			executor: {execute: async () => successfulExecution},
			validationFileSystem: invalidValidationFileSystem(),
		});
		await expect(
			createObliqueProject({planId, confirmation: 'CREATE employee-portal'}, failedValidation)
		).resolves.toMatchObject({
			status: 'failed',
			code: 'POST_VALIDATION_FAILED',
			partialProject: true,
		});

		const registerTool = jest.fn();
		registerCreateObliqueProjectTool({registerTool} as unknown as McpServer, async () => packageMetadata, {
			planStore: new ObliqueProjectPlanStore(),
		});
		expect(registerTool).toHaveBeenCalledWith(
			'create_oblique_project',
			expect.objectContaining({
				annotations: {readOnlyHint: false, destructiveHint: true, idempotentHint: false, openWorldHint: true},
			}),
			expect.any(Function)
		);
	});

	it('uses npx.cmd on Windows and returns the registered JSON response', async () => {
		const store = new ObliqueProjectPlanStore();
		const planId = storePlan(store, plan);
		const execute = jest
			.fn<Promise<ProjectExecutionResult>, [ProjectExecutionRequest]>()
			.mockResolvedValue(successfulExecution);
		const context = createContext(store, {executor: {execute}, platform: 'win32'});
		await expect(
			createObliqueProject({planId, confirmation: 'CREATE employee-portal'}, context)
		).resolves.toMatchObject({status: 'completed'});
		expect(execute).toHaveBeenCalledWith(expect.objectContaining({executable: 'npx.cmd'}));

		const registeredStore = new ObliqueProjectPlanStore();
		const registeredPlanId = storePlan(registeredStore, plan);
		const registerTool = jest.fn();
		const registeredEnvironment = createContext(registeredStore, {
			executor: {execute: async () => successfulExecution},
		}).environment;
		registerCreateObliqueProjectTool({registerTool} as unknown as McpServer, async () => packageMetadata, {
			planStore: registeredStore,
			environment: registeredEnvironment,
		});
		const callback = registerTool.mock.calls[0]?.[2] as (
			input: {planId: string; confirmation: string},
			extra?: unknown
		) => Promise<{structuredContent: {status: string}}>;
		await expect(
			callback({planId: registeredPlanId, confirmation: 'not confirmed'}, {signal: new AbortController().signal})
		).resolves.toMatchObject({structuredContent: {status: 'blocked'}});
		const missingSignalCallback = registerTool.mock.calls[0]?.[2] as (
			input: {planId: string; confirmation: string},
			extra?: unknown
		) => Promise<{structuredContent: {status: string}}>;
		await expect(
			missingSignalCallback({planId: 'unknown', confirmation: 'CREATE employee-portal'}, null)
		).resolves.toMatchObject({structuredContent: {status: 'blocked'}});
		const invalidSignalCallback = registerTool.mock.calls[0]?.[2] as (
			input: {planId: string; confirmation: string},
			extra?: unknown
		) => Promise<{structuredContent: {status: string}}>;
		await expect(
			invalidSignalCallback({planId: 'unknown', confirmation: 'CREATE employee-portal'}, {signal: {}})
		).resolves.toMatchObject({structuredContent: {status: 'blocked'}});
		await expect(callback({planId: registeredPlanId, confirmation: 'CREATE employee-portal'})).resolves.toMatchObject({
			structuredContent: {status: 'completed'},
		});
	});

	it('does not execute when a plan becomes unavailable while being consumed', async () => {
		const store = new ObliqueProjectPlanStore();
		const planId = storePlan(store, plan);
		jest.spyOn(store, 'take').mockReturnValue({status: 'expired'});
		const execute = jest.fn<Promise<ProjectExecutionResult>, [ProjectExecutionRequest]>();

		await expect(
			createObliqueProject(
				{planId, confirmation: 'CREATE employee-portal'},
				createContext(store, {executor: {execute}})
			)
		).resolves.toMatchObject({status: 'blocked', code: 'PLAN_EXPIRED'});
		expect(execute).not.toHaveBeenCalled();
	});

	it('uses safe empty execution defaults while revalidation blocks the plan', async () => {
		const store = new ObliqueProjectPlanStore();
		const planId = storePlan(store, {...plan, obliqueVersion: '15.4.1'});

		await expect(
			createObliqueProject({planId, confirmation: 'CREATE employee-portal'}, {packageMetadata, planStore: store})
		).resolves.toMatchObject({status: 'blocked', code: 'REVALIDATION_FAILED'});
	});

	it('uses the Observable pipeline with an omitted optional environment', async () => {
		const store = new ObliqueProjectPlanStore();
		const parentDirectory = await realpath(process.cwd());
		const projectName = `phase14-rxjs-${process.pid}`;
		const planId = storePlan(store, {
			...plan,
			projectName,
			parentDirectory,
			destinationPath: resolve(parentDirectory, projectName),
			args: [
				'--yes',
				'@oblique/cli@15.4.4',
				'new',
				projectName,
				'--applicationOperator=Federal Test Office',
				'--contact=accessibility@example.test',
				'--npmrc',
			],
		});
		const execute$ = jest.spyOn(NodeProjectExecutor.prototype, 'execute$').mockReturnValue(of(successfulExecution));

		await expect(
			createObliqueProject({planId, confirmation: `CREATE ${projectName}`}, {packageMetadata, planStore: store})
		).resolves.toMatchObject({
			status: 'failed',
			code: 'POST_VALIDATION_FAILED',
		});
		expect(execute$).toHaveBeenCalledTimes(1);
	});

	it('releases locks after rejected executors and returns a stable failure without a rejection', async () => {
		const store = new ObliqueProjectPlanStore();
		const planId = storePlan(store, plan);
		const result = await createObliqueProject(
			{planId, confirmation: 'CREATE employee-portal'},
			createContext(store, {executor: {execute$: () => throwError(() => new Error('unexpected'))}})
		);

		expect(result).toMatchObject({status: 'failed', code: 'SPAWN_FAILED'});
		expect(store.acquireDestination(plan.destinationPath)).toBe(true);
	});

	it('maps an unexpected MCP-boundary metadata failure to a stable result', async () => {
		const registerTool = jest.fn();
		registerCreateObliqueProjectTool(
			{registerTool} as unknown as McpServer,
			async () => {
				throw new Error('metadata unavailable');
			},
			{planStore: new ObliqueProjectPlanStore()}
		);
		const callback = registerTool.mock.calls[0]?.[2] as (
			input: {planId: string; confirmation: string},
			extra?: unknown
		) => Promise<{structuredContent: {code?: string; message?: string}}>;
		await expect(callback({planId: 'unknown', confirmation: 'CREATE employee-portal'})).resolves.toMatchObject({
			structuredContent: {code: 'REVALIDATION_FAILED'},
		});
	});

	it('maps an empty injected execution Observable without producing EmptyError', async () => {
		const store = new ObliqueProjectPlanStore();
		const planId = storePlan(store, plan);
		const registerTool = jest.fn();
		registerCreateObliqueProjectTool({registerTool} as unknown as McpServer, async () => packageMetadata, {
			planStore: store,
			environment: {executor: {execute$: () => EMPTY}},
		});
		const callback = registerTool.mock.calls[0]?.[2] as (input: {
			planId: string;
			confirmation: string;
		}) => Promise<{structuredContent: {code?: string}}>;
		await expect(callback({planId, confirmation: 'CREATE employee-portal'})).resolves.toMatchObject({
			structuredContent: {code: 'REVALIDATION_FAILED'},
		});
	});
});

function createContext(store: ObliqueProjectPlanStore, environment: TestEnvironment = {}): ProjectCreationContext {
	const {executor, ...otherEnvironment} = environment;
	return {
		packageMetadata,
		planStore: store,
		environment: {
			currentNodeVersion: '22.12.0',
			fileSystem: missingDestinationFileSystem(),
			validationFileSystem: validValidationFileSystem(),
			...otherEnvironment,
			...(executor === undefined ? {} : {executor: getObservableExecutor(executor)}),
		},
	};
}

type TestEnvironment = Omit<ProjectCreationEnvironment, 'executor'> & {
	executor?:
		| NonNullable<ProjectCreationEnvironment['executor']>
		| {execute: (request: ProjectExecutionRequest) => Promise<ProjectExecutionResult>};
};

function getObservableExecutor(
	executor: NonNullable<TestEnvironment['executor']>
): NonNullable<ProjectCreationEnvironment['executor']> {
	return 'execute$' in executor ? executor : {execute$: request => from(executor.execute(request))};
}

function missingDestinationFileSystem(): NonNullable<ProjectCreationEnvironment['fileSystem']> {
	return {
		realpath: async path => path,
		lstat: async () => Promise.reject(missingPathError()),
	};
}

function existingDestinationFileSystem(): NonNullable<ProjectCreationEnvironment['fileSystem']> {
	return {
		realpath: async path => path,
		lstat: async path =>
			path === plan.destinationPath ? {isDirectory: () => true} : Promise.reject(missingPathError()),
	};
}

function changingDestinationFileSystem(exists: () => boolean): NonNullable<ProjectCreationEnvironment['fileSystem']> {
	return {
		realpath: async path => path,
		lstat: async path =>
			path === plan.destinationPath && exists() ? {isDirectory: () => true} : Promise.reject(missingPathError()),
	};
}

function validValidationFileSystem(): NonNullable<ProjectCreationEnvironment['validationFileSystem']> {
	return {
		lstat: async path => ({
			isDirectory: () => path === plan.destinationPath,
			isFile: () => path !== plan.destinationPath,
			isSymbolicLink: () => false,
		}),
		realpath: async path => path,
		readFile: async path =>
			path.endsWith('package.json')
				? JSON.stringify({dependencies: {'@oblique/oblique': '^15.4.4', '@angular/core': '^21.2.20'}})
				: '',
	};
}

function invalidValidationFileSystem(): NonNullable<ProjectCreationEnvironment['validationFileSystem']> {
	return {...validValidationFileSystem(), readFile: async () => '{not json'};
}

function missingPathError(): Error & {code: string} {
	return Object.assign(new Error('missing'), {code: 'ENOENT'});
}

function storePlan(store: ObliqueProjectPlanStore, projectPlan: ObliqueProjectPlan): string {
	const result = store.put(projectPlan);
	if (result.status !== 'ready') {
		throw new Error('Expected the plan store to have capacity.');
	}
	return result.planId;
}
