/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 14 prepared project plan result and in-memory plan registration
 */

import type {getObliqueVersion} from './get-oblique-version.js';
import type {
	BlockedProjectPreparation,
	PrepareObliqueProjectInput,
	PrepareObliqueProjectResult,
	ProjectPreparationCheck,
} from './prepare-oblique-project.contracts.js';
import type {NpmrcMode, ObliqueProjectPlanStore, PlanPutResult} from './oblique-project-plan.store.js';
import {getAngularMajor, normalizeNodeVersion, supportsNodeVersion} from './prepare-oblique-project.version.js';

interface PlanContext {
	input: PrepareObliqueProjectInput;
	obliqueVersion: string;
	versionInfo: ReturnType<typeof getObliqueVersion>;
	location: {parentDirectory: string; destinationPath: string};
	checks: ProjectPreparationCheck[];
	currentNodeVersion: string | undefined;
	npmrcMode: NpmrcMode;
	planStore: ObliqueProjectPlanStore;
}

export function getNodeValidatedPlan(context: PlanContext): PrepareObliqueProjectResult {
	const currentNode = normalizeNodeVersion(context.currentNodeVersion ?? process.version);
	if (!supportsNodeVersion(currentNode, context.versionInfo.nodeRequirement)) {
		return blocked({
			code: 'UNSUPPORTED_NODE_VERSION',
			failedCheck: 'node-version',
			message: `Node.js ${currentNode} does not meet the Oblique requirement ${context.versionInfo.nodeRequirement}.`,
			checks: context.checks,
		});
	}
	context.checks.push(passed('node-version'), passed('cli-security'));
	return ready({...context, currentNodeVersion: currentNode});
}

export function passed(name: ProjectPreparationCheck['name']): ProjectPreparationCheck {
	return {name, status: 'passed'};
}

export function blocked({
	code,
	failedCheck,
	message,
	checks,
}: {
	code: BlockedProjectPreparation['code'];
	failedCheck: BlockedProjectPreparation['failedCheck'];
	message: string;
	checks: ProjectPreparationCheck[];
}): BlockedProjectPreparation {
	return {
		status: 'blocked',
		code,
		message,
		failedCheck,
		checks: [...checks, {name: failedCheck, status: 'failed'}],
		requiresConfirmation: false,
		executionPerformed: false,
	};
}

function ready(context: PlanContext & {currentNodeVersion: string}): PrepareObliqueProjectResult {
	const args = getArguments(context);
	const storedPlan = storePlan(context, args);
	if (storedPlan.status === 'full') {
		return blocked({
			code: 'PLAN_STORE_FULL',
			failedCheck: 'plan-store',
			message: 'Too many prepared plans are active. Wait for a plan to expire before preparing another project.',
			checks: context.checks,
		});
	}
	context.checks.push(passed('plan-store'));
	return {
		status: 'ready',
		projectName: context.input.projectName,
		applicationOperator: context.input.applicationOperator,
		contact: context.input.contact,
		...context.location,
		versions: {
			oblique: context.obliqueVersion,
			obliqueCli: context.obliqueVersion,
			angular: getAngularMajor(context.versionInfo.angularVersion),
			nodeRequirement: context.versionInfo.nodeRequirement,
			currentNode: context.currentNodeVersion,
		},
		command: {executable: 'npx', args, display: `npx ${args.join(' ')}`},
		checks: context.checks,
		planId: storedPlan.planId,
		expiresInSeconds: storedPlan.expiresInSeconds,
		confirmationPhrase: `CREATE ${context.input.projectName}`,
		requiresConfirmation: true,
		executionPerformed: false,
	};
}

function storePlan(context: PlanContext, args: string[]): PlanPutResult {
	return context.planStore.put({
		projectName: context.input.projectName,
		applicationOperator: context.input.applicationOperator,
		contact: context.input.contact,
		parentDirectory: context.location.parentDirectory,
		destinationPath: context.location.destinationPath,
		obliqueVersion: context.obliqueVersion,
		obliqueCliVersion: context.obliqueVersion,
		angularVersion: getAngularMajor(context.versionInfo.angularVersion),
		nodeRequirement: context.versionInfo.nodeRequirement,
		npmrcMode: context.npmrcMode,
		executable: 'npx',
		args,
	});
}

function getArguments(context: PlanContext): string[] {
	return [
		'--yes',
		`@oblique/cli@${context.obliqueVersion}`,
		'new',
		context.input.projectName,
		`--applicationOperator=${context.input.applicationOperator}`,
		`--contact=${context.input.contact}`,
		context.npmrcMode === 'federal' ? '--npmrc' : '--no-npmrc',
	];
}
