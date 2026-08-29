/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 13 read-only Oblique project preparation tool tests
 */

import {mkdir, mkdtemp, readFile, realpath, rm, stat, symlink, writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {resolve} from 'node:path';
import type {McpServer} from '@modelcontextprotocol/server';
import type {PackageMetadata} from './get-oblique-version.js';
import {ObliqueProjectPlanStore} from './oblique-project-plan.store.js';
import {
	type PrepareObliqueProjectInput,
	type ProjectPreparationEnvironment,
	type ProjectPreparationFileSystem,
	prepareObliqueProject as prepareObliqueProjectImplementation,
	prepareObliqueProjectResultSchema,
	prepareObliqueProjectSchema,
	registerPrepareObliqueProjectTool,
	unsafeObliqueCliVersions,
} from './prepare-oblique-project.js';

const packageMetadata: PackageMetadata = {
	version: '15.4.4',
	engines: {node: '>=22.12.0'},
	dependencies: {'@angular/core': '^21.2.20'},
	repository: {url: 'https://github.com/oblique-bit/oblique.git'},
};
const temporaryDirectories: string[] = [];
const applicationOperator = 'Federal Test Office';
const contact = 'accessibility@example.test';
type PrepareInput = Omit<PrepareObliqueProjectInput, 'applicationOperator' | 'contact'> &
	Partial<Pick<PrepareObliqueProjectInput, 'applicationOperator' | 'contact'>>;

function prepareObliqueProject(
	input: PrepareInput,
	packageMetadata_: PackageMetadata,
	environment?: ProjectPreparationEnvironment
): ReturnType<typeof prepareObliqueProjectImplementation> {
	return prepareObliqueProjectImplementation(
		{applicationOperator, contact, ...input, npmrcMode: input.npmrcMode ?? 'federal'},
		packageMetadata_,
		environment
	);
}

function withRequiredInput(input: PrepareInput): PrepareObliqueProjectInput {
	return {applicationOperator, contact, ...input};
}

afterEach(async () => {
	await Promise.all(temporaryDirectories.splice(0).map(directory => rm(directory, {recursive: true, force: true})));
});

describe('prepare_oblique_project tool', () => {
	it('prepares a valid project from the default MCP working directory without creating it', async () => {
		const projectName = `phase13-plan-${process.pid}`;
		const result = await prepareObliqueProject({projectName}, packageMetadata);

		expect(result).toMatchObject({
			status: 'ready',
			projectName,
			applicationOperator,
			contact,
			parentDirectory: process.cwd(),
			destinationPath: resolve(process.cwd(), projectName),
			versions: {
				oblique: '15.4.4',
				obliqueCli: '15.4.4',
				angular: '21',
				nodeRequirement: '>=22.12.0',
				currentNode: process.version.replace(/^v/u, ''),
			},
			command: {
				executable: 'npx',
				args: [
					'--yes',
					'@oblique/cli@15.4.4',
					'new',
					projectName,
					`--applicationOperator=${applicationOperator}`,
					`--contact=${contact}`,
					'--npmrc',
				],
				display: `npx --yes @oblique/cli@15.4.4 new ${projectName} --applicationOperator=${applicationOperator} --contact=${contact} --npmrc`,
			},
			requiresConfirmation: true,
			executionPerformed: false,
		});
		await expect(stat(resolve(process.cwd(), projectName))).rejects.toMatchObject({code: 'ENOENT'});
	});

	it('prepares a valid project in an explicit parent directory', async () => {
		const parentDirectory = await createTemporaryDirectory();
		const result = await prepareObliqueProject({projectName: 'employee-portal', parentDirectory}, packageMetadata, {
			workingDirectory: '/unused',
			currentNodeVersion: '22.12.0',
		});

		expect(result).toMatchObject({
			status: 'ready',
			parentDirectory,
			destinationPath: resolve(parentDirectory, 'employee-portal'),
		});
	});

	it('requires an explicit npmrc mode and supports the external mode', async () => {
		const environment = createEnvironment(['/workspace']);
		const missing = await prepareObliqueProjectImplementation(
			withRequiredInput({projectName: 'employee-portal'}),
			packageMetadata,
			environment
		);
		const external = await prepareObliqueProjectImplementation(
			withRequiredInput({projectName: 'employee-portal', npmrcMode: 'external'}),
			packageMetadata,
			environment
		);
		const invalid = await prepareObliqueProjectImplementation(
			withRequiredInput({projectName: 'employee-portal', npmrcMode: 'custom'}),
			packageMetadata,
			environment
		);

		expect(missing).toMatchObject({status: 'blocked', code: 'NPMRC_MODE_REQUIRED', failedCheck: 'npmrc-mode'});
		expect(invalid).toMatchObject({status: 'blocked', code: 'NPMRC_MODE_REQUIRED', failedCheck: 'npmrc-mode'});
		expect(external).toMatchObject({
			status: 'ready',
			command: {
				args: [
					'--yes',
					'@oblique/cli@15.4.4',
					'new',
					'employee-portal',
					`--applicationOperator=${applicationOperator}`,
					`--contact=${contact}`,
					'--no-npmrc',
				],
			},
		});
		if (external.status === 'ready') {
			expect(external.checks).toContainEqual({name: 'npmrc-mode', status: 'passed'});
		}
	});

	it('keeps special characters in operator and contact values as single CLI arguments', async () => {
		const specialOperator = 'Federal Test Office; echo hacked && $(touch injected)';
		const specialContact = 'accessibility@example.test, +41 31 555 44 33';
		const result = await prepareObliqueProjectImplementation(
			{
				projectName: 'employee-portal',
				applicationOperator: specialOperator,
				contact: specialContact,
				npmrcMode: 'external',
			},
			packageMetadata,
			createEnvironment(['/workspace'])
		);

		expect(result).toMatchObject({
			status: 'ready',
			command: {
				args: [
					'--yes',
					'@oblique/cli@15.4.4',
					'new',
					'employee-portal',
					`--applicationOperator=${specialOperator}`,
					`--contact=${specialContact}`,
					'--no-npmrc',
				],
			},
		});
	});

	it('resolves a relative parent directory against the MCP working directory', async () => {
		const workingDirectory = await createTemporaryDirectory();
		await mkdir(resolve(workingDirectory, 'projects'));
		const result = await prepareObliqueProject(
			{projectName: 'employee-portal', parentDirectory: 'projects'},
			packageMetadata,
			{workingDirectory, currentNodeVersion: '22.12.0'}
		);

		expect(result).toMatchObject({
			status: 'ready',
			parentDirectory: resolve(workingDirectory, 'projects'),
			destinationPath: resolve(workingDirectory, 'projects', 'employee-portal'),
		});
	});

	it.each([
		'Employee-portal',
		'employee portal',
		'-employee-portal',
		'../employee-portal',
		'/tmp/employee-portal',
		'employee\\portal',
		'employee%2fportal',
		'employee--portal',
		'employee-',
		'.',
		'..',
		'employee;portal',
		'employee&portal',
		'employee|portal',
		'employee$portal',
		'employee`portal`',
		"employee'portal",
		'employee"portal',
		'employee\nportal',
		'a'.repeat(65),
	])('blocks unsafe project name %p before reading the filesystem', async projectName => {
		const fileSystem = createFileSystem(['/workspace']);
		const result = await prepareObliqueProject({projectName}, packageMetadata, {
			workingDirectory: '/workspace',
			currentNodeVersion: '22.12.0',
			fileSystem,
		});

		expect(result).toMatchObject({
			status: 'blocked',
			code: 'INVALID_PROJECT_NAME',
			failedCheck: 'project-name',
			executionPerformed: false,
		});
		expect(fileSystem.stat).not.toHaveBeenCalled();
	});

	it('blocks a missing parent directory', async () => {
		const result = await prepareObliqueProject(
			{projectName: 'employee-portal', parentDirectory: 'missing'},
			packageMetadata,
			createEnvironment(['/workspace'])
		);

		expect(result).toMatchObject({
			status: 'blocked',
			code: 'INVALID_PARENT_DIRECTORY',
			failedCheck: 'parent-directory',
		});
	});

	it('blocks a parent path that is a file', async () => {
		const workingDirectory = await createTemporaryDirectory();
		const parentFile = resolve(workingDirectory, 'parent-file');
		await writeFile(parentFile, 'not a directory');
		const result = await prepareObliqueProject(
			{projectName: 'employee-portal', parentDirectory: 'parent-file'},
			packageMetadata,
			{workingDirectory, currentNodeVersion: '22.12.0'}
		);

		expect(result).toMatchObject({
			status: 'blocked',
			code: 'INVALID_PARENT_DIRECTORY',
			failedCheck: 'parent-directory',
		});
	});

	it('blocks an existing destination without overwriting it', async () => {
		const parentDirectory = await createTemporaryDirectory();
		await mkdir(resolve(parentDirectory, 'employee-portal'));
		const result = await prepareObliqueProject({projectName: 'employee-portal', parentDirectory}, packageMetadata, {
			currentNodeVersion: '22.12.0',
		});

		expect(result).toMatchObject({status: 'blocked', code: 'DESTINATION_ALREADY_EXISTS', failedCheck: 'destination'});
		await expect(stat(resolve(parentDirectory, 'employee-portal'))).resolves.toBeDefined();
	});

	it('blocks a destination that fails the containment guard', async () => {
		const result = await prepareObliqueProject({projectName: 'employee-portal'}, packageMetadata, {
			...createEnvironment(['/workspace']),
			pathIsInside: () => false,
		});

		expect(result).toMatchObject({
			status: 'blocked',
			code: 'PATH_OUTSIDE_ALLOWED_DIRECTORY',
			failedCheck: 'destination',
		});
	});

	it.each([
		['22.11.9', '>=22.12.0'],
		['not-a-version', '>=22.12.0'],
		['22.12.0', 'invalid'],
	])('blocks an unsupported Node.js version %s for requirement %s', async (currentNodeVersion, nodeRequirement) => {
		const result = await prepareObliqueProject(
			{projectName: 'employee-portal'},
			{...packageMetadata, engines: {node: nodeRequirement}},
			{...createEnvironment(['/workspace']), currentNodeVersion}
		);

		expect(result).toMatchObject({status: 'blocked', code: 'UNSUPPORTED_NODE_VERSION', failedCheck: 'node-version'});
	});

	it('accepts the explicit embedded Oblique version and compares patch Node versions', async () => {
		const result = await prepareObliqueProject(
			{projectName: 'employee-portal', obliqueVersion: '15.4.4'},
			packageMetadata,
			{...createEnvironment(['/workspace']), currentNodeVersion: '22.12.1'}
		);

		expect(result).toMatchObject({
			status: 'ready',
			versions: {oblique: '15.4.4', obliqueCli: '15.4.4'},
			command: {
				args: [
					'--yes',
					'@oblique/cli@15.4.4',
					'new',
					'employee-portal',
					`--applicationOperator=${applicationOperator}`,
					`--contact=${contact}`,
					'--npmrc',
				],
			},
		});
	});

	it.each(['15.4.3', '16.0.0'])(
		'blocks a version without embedded compatibility metadata: %s',
		async obliqueVersion => {
			const result = await prepareObliqueProject(
				{projectName: 'employee-portal', obliqueVersion},
				packageMetadata,
				createEnvironment(['/workspace'])
			);

			expect(result).toMatchObject({
				status: 'blocked',
				code: 'UNSUPPORTED_OBLIQUE_VERSION',
				failedCheck: 'oblique-version',
			});
			expect(result).toMatchObject({
				checks: [
					{name: 'project-name', status: 'passed'},
					{name: 'npmrc-mode', status: 'passed'},
					{name: 'oblique-version', status: 'failed'},
				],
			});
			expect(result).not.toHaveProperty('command');
		}
	);

	it('blocks an invalid explicit Oblique version without falling back to latest', async () => {
		const result = await prepareObliqueProject(
			{projectName: 'employee-portal', obliqueVersion: 'latest'},
			packageMetadata,
			createEnvironment(['/workspace'])
		);

		expect(result).toMatchObject({status: 'blocked', code: 'INVALID_OBLIQUE_VERSION', failedCheck: 'cli-security'});
		expect(result).not.toHaveProperty('command');
	});

	it.each(['15.4.0', '15.4.1'])('blocks known unsafe Oblique CLI version %s', async obliqueVersion => {
		const result = await prepareObliqueProject(
			{projectName: 'employee-portal', obliqueVersion},
			packageMetadata,
			createEnvironment(['/workspace'])
		);

		expect(unsafeObliqueCliVersions.has(obliqueVersion)).toBe(true);
		expect(result).toMatchObject({status: 'blocked', code: 'UNSAFE_CLI_VERSION', failedCheck: 'cli-security'});
	});

	it('has a strict JSON-serializable input and result contract', async () => {
		const environment = createEnvironment(['/workspace']);
		const result = await prepareObliqueProject({projectName: 'employee-portal'}, packageMetadata, environment);

		expect(prepareObliqueProjectSchema.safeParse(withRequiredInput({projectName: 'employee-portal'})).success).toBe(
			true
		);
		expect(prepareObliqueProjectSchema.safeParse({projectName: 'employee-portal'}).success).toBe(false);
		expect(
			prepareObliqueProjectSchema.safeParse({...withRequiredInput({projectName: 'employee-portal'}), unknown: true})
				.success
		).toBe(false);
		expect(prepareObliqueProjectResultSchema.parse(result)).toEqual(result);
		expect(JSON.parse(JSON.stringify(result))).toEqual(result);
	});

	it('uses an unknown Angular label only when trusted metadata has no Angular major version', async () => {
		const result = await prepareObliqueProject(
			{projectName: 'employee-portal'},
			{...packageMetadata, dependencies: {'@angular/core': 'unavailable'}},
			createEnvironment(['/workspace'])
		);

		expect(result).toMatchObject({status: 'ready', versions: {angular: 'unknown'}});
	});

	it('uses the canonical parent behind a symlink-like filesystem path', async () => {
		const fileSystem = createFileSystem(['/workspace/link'], [], {'/workspace/link': '/canonical/parent'});
		const result = await prepareObliqueProject(
			{projectName: 'employee-portal', parentDirectory: 'link'},
			packageMetadata,
			{workingDirectory: '/workspace', currentNodeVersion: '22.12.0', fileSystem}
		);

		expect(result).toMatchObject({
			status: 'ready',
			parentDirectory: '/canonical/parent',
			destinationPath: '/canonical/parent/employee-portal',
		});
		expect(fileSystem.realpath).toHaveBeenCalledWith('/workspace/link');
	});

	it('uses the real canonical parent behind a filesystem symlink', async () => {
		const workingDirectory = await createTemporaryDirectory();
		const canonicalParent = resolve(workingDirectory, 'canonical-parent');
		const linkedParent = resolve(workingDirectory, 'linked-parent');
		await mkdir(canonicalParent);
		await symlink(canonicalParent, linkedParent, process.platform === 'win32' ? 'junction' : 'dir');
		const result = await prepareObliqueProject(
			{projectName: 'employee-portal', parentDirectory: 'linked-parent'},
			packageMetadata,
			{workingDirectory, currentNodeVersion: '22.12.0'}
		);

		expect(result).toMatchObject({
			status: 'ready',
			parentDirectory: await realpath(canonicalParent),
			destinationPath: resolve(await realpath(canonicalParent), 'employee-portal'),
		});
		expect(result.checks).toContainEqual({name: 'oblique-version', status: 'passed'});
	});

	it('blocks a parent directory that cannot be canonicalized', async () => {
		const fileSystem = createFileSystem(['/workspace']);
		fileSystem.realpath.mockRejectedValueOnce(new Error('Denied.'));
		const result = await prepareObliqueProject({projectName: 'employee-portal'}, packageMetadata, {
			workingDirectory: '/workspace',
			currentNodeVersion: '22.12.0',
			fileSystem,
		});

		expect(result).toMatchObject({status: 'blocked', code: 'INVALID_PARENT_DIRECTORY'});
		expect(JSON.stringify(result)).not.toContain('Denied');
	});

	it('returns distinct opaque plans for identical inputs and performs only stat reads', async () => {
		const fileSystem = createFileSystem(['/workspace']);
		const environment: ProjectPreparationEnvironment = {
			workingDirectory: '/workspace',
			currentNodeVersion: 'v23.0.0',
			fileSystem,
		};
		const input = {projectName: 'employee-portal', applicationOperator, contact};

		const first = await prepareObliqueProject(input, packageMetadata, environment);
		const second = await prepareObliqueProject(input, packageMetadata, environment);

		if (first.status === 'ready' && second.status === 'ready') {
			expect(first.planId).not.toBe(second.planId);
			expect(first.planId).toMatch(/^[0-9a-f-]{36}$/iu);
			expect({...first, planId: undefined}).toEqual({...second, planId: undefined});
		} else {
			fail('Expected both preparations to be ready.');
		}
		expect(fileSystem.stat).toHaveBeenCalledTimes(4);
	});

	it('returns a stable blocking result when the bounded plan store is full', async () => {
		const result = await prepareObliqueProjectImplementation(
			withRequiredInput({projectName: 'employee-portal', npmrcMode: 'federal'}),
			packageMetadata,
			{
				...createEnvironment(['/workspace']),
				planStore: new ObliqueProjectPlanStore({now: () => 0, ttlMilliseconds: 1_000, maximumPlans: 0}),
			}
		);

		expect(result).toMatchObject({status: 'blocked', code: 'PLAN_STORE_FULL', failedCheck: 'plan-store'});
	});

	it('contains no subprocess or filesystem write API in production planning modules', async () => {
		const sources = await Promise.all(
			['prepare-oblique-project.ts', 'prepare-oblique-project.filesystem.ts', 'prepare-oblique-project.version.ts'].map(
				fileName => readFile(resolve(__dirname, fileName), 'utf8')
			)
		);

		for (const source of sources) {
			expect(source).not.toMatch(/node:child_process|(?<!\.)\b(?:exec|execSync|execFile|spawn|spawnSync)\s*\(/u);
			expect(source).not.toMatch(/\b(?:writeFile|mkdir|rm|cp)\s*\(/u);
		}
	});

	it('registers a read-only but non-idempotent MCP tool', async () => {
		const registerTool = jest.fn();
		registerPrepareObliqueProjectTool({registerTool} as unknown as McpServer, async () => packageMetadata);
		registerPrepareObliqueProjectTool(
			{registerTool} as unknown as McpServer,
			async () => packageMetadata,
			createEnvironment(['/workspace'])
		);

		expect(registerTool).toHaveBeenCalledWith(
			'prepare_oblique_project',
			expect.objectContaining({
				inputSchema: prepareObliqueProjectSchema,
				outputSchema: prepareObliqueProjectResultSchema,
				annotations: {
					readOnlyHint: true,
					destructiveHint: false,
					idempotentHint: false,
					openWorldHint: false,
				},
			}),
			expect.any(Function)
		);
		const callback = registerTool.mock.calls[1]?.[2] as (input: {
			projectName: string;
			applicationOperator: string;
			contact: string;
			npmrcMode: 'federal';
		}) => Promise<unknown>;
		await expect(
			callback(withRequiredInput({projectName: 'employee-portal', npmrcMode: 'federal'}))
		).resolves.toMatchObject({
			structuredContent: {status: 'ready', executionPerformed: false},
		});
		await expect(
			callback(withRequiredInput({projectName: 'Employee Portal', npmrcMode: 'federal'}))
		).resolves.toMatchObject({
			isError: true,
			structuredContent: {status: 'blocked', code: 'INVALID_PROJECT_NAME'},
		});
	});
});

function createEnvironment(directories: string[]): ProjectPreparationEnvironment {
	return {workingDirectory: '/workspace', currentNodeVersion: '22.12.0', fileSystem: createFileSystem(directories)};
}

function createFileSystem(
	directories: string[],
	existingPaths: string[] = [],
	canonicalPaths: Record<string, string> = {}
): ProjectPreparationFileSystem & {realpath: jest.Mock} {
	return {
		stat: jest.fn(async path => {
			if (directories.includes(path)) {
				return {isDirectory: () => true};
			}
			if (existingPaths.includes(path)) {
				return {isDirectory: () => false};
			}
			throw Object.assign(new Error('Not found.'), {code: 'ENOENT'});
		}),
		realpath: jest.fn(async path => canonicalPaths[path] ?? path),
	};
}

async function createTemporaryDirectory(): Promise<string> {
	const directory = await mkdtemp(resolve(tmpdir(), 'oblique-mcp-phase13-'));
	temporaryDirectories.push(directory);
	return directory;
}
