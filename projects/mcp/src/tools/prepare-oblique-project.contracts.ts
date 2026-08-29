/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 13 project preparation MCP contracts
 */

import {z as schema} from 'zod/v4';

export const prepareObliqueProjectSchema = schema
	.object({
		projectName: schema.string(),
		applicationOperator: schema.string().min(1),
		contact: schema.string().min(1),
		parentDirectory: schema.string().optional(),
		obliqueVersion: schema.string().optional(),
		npmrcMode: schema.string().optional(),
	})
	.strict();

const checkSchema = schema.object({
	name: schema.enum([
		'project-name',
		'oblique-version',
		'parent-directory',
		'destination',
		'node-version',
		'cli-security',
		'npmrc-mode',
		'plan-store',
	]),
	status: schema.enum(['passed', 'failed']),
});

const versionsSchema = schema.object({
	oblique: schema.string(),
	obliqueCli: schema.string(),
	angular: schema.string(),
	nodeRequirement: schema.string(),
	currentNode: schema.string(),
});

const commandSchema = schema.object({
	executable: schema.literal('npx'),
	args: schema.array(schema.string()),
	display: schema.string(),
});

export const prepareObliqueProjectResultSchema = schema.union([
	schema.object({
		status: schema.literal('ready'),
		projectName: schema.string(),
		applicationOperator: schema.string(),
		contact: schema.string(),
		parentDirectory: schema.string(),
		destinationPath: schema.string(),
		versions: versionsSchema,
		command: commandSchema,
		checks: schema.array(checkSchema),
		planId: schema.string(),
		expiresInSeconds: schema.number().int().positive(),
		confirmationPhrase: schema.string(),
		requiresConfirmation: schema.literal(true),
		executionPerformed: schema.literal(false),
	}),
	schema.object({
		status: schema.literal('blocked'),
		code: schema.enum([
			'INVALID_PROJECT_NAME',
			'INVALID_PARENT_DIRECTORY',
			'DESTINATION_ALREADY_EXISTS',
			'UNSUPPORTED_NODE_VERSION',
			'INVALID_OBLIQUE_VERSION',
			'UNSAFE_CLI_VERSION',
			'UNSUPPORTED_OBLIQUE_VERSION',
			'PATH_OUTSIDE_ALLOWED_DIRECTORY',
			'NPMRC_MODE_REQUIRED',
			'PLAN_STORE_FULL',
		]),
		message: schema.string(),
		failedCheck: schema.enum([
			'project-name',
			'oblique-version',
			'parent-directory',
			'destination',
			'node-version',
			'cli-security',
			'npmrc-mode',
			'plan-store',
		]),
		checks: schema.array(checkSchema),
		requiresConfirmation: schema.literal(false),
		executionPerformed: schema.literal(false),
	}),
]);

export type PrepareObliqueProjectInput = schema.infer<typeof prepareObliqueProjectSchema>;
export type PrepareObliqueProjectResult = schema.infer<typeof prepareObliqueProjectResultSchema>;
export type ProjectPreparationCheck = schema.infer<typeof checkSchema>;
export type BlockedProjectPreparation = Extract<PrepareObliqueProjectResult, {status: 'blocked'}>;
