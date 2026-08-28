/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 14 project creation MCP contracts
 */

import {z as schema} from 'zod/v4';

export const createObliqueProjectSchema = schema
	.object({planId: schema.string().min(1), confirmation: schema.string()})
	.strict();

const commandSchema = schema.object({executable: schema.string(), args: schema.array(schema.string())});
const outputSchema = schema.object({
	stdoutTail: schema.string(),
	stderrTail: schema.string(),
	truncated: schema.boolean(),
});
const processSchema = schema.object({
	exitCode: schema.number().nullable(),
	signal: schema.string().nullable(),
	timedOut: schema.boolean(),
	cancelled: schema.boolean(),
	durationMs: schema.number(),
});
const validationSchema = schema.object({
	destination: schema.enum(['passed', 'failed']),
	packageJson: schema.enum(['passed', 'failed']),
	angularWorkspace: schema.enum(['passed', 'failed']),
	obliqueDependency: schema.enum(['passed', 'failed']),
	angularDependency: schema.enum(['passed', 'failed']),
});

export const createObliqueProjectResultSchema = schema.union([
	schema.object({
		status: schema.literal('completed'),
		projectName: schema.string(),
		destinationPath: schema.string(),
		versions: schema.object({oblique: schema.string(), obliqueCli: schema.string(), angular: schema.string()}),
		npmrcMode: schema.enum(['federal', 'external']),
		command: commandSchema,
		process: schema.object({
			exitCode: schema.number().nullable(),
			signal: schema.string().nullable(),
			timedOut: schema.boolean(),
			cancelled: schema.boolean(),
			durationMs: schema.number(),
		}),
		validation: validationSchema,
		output: outputSchema,
		executionPerformed: schema.literal(true),
		partialProject: schema.literal(false),
		cleanupRequired: schema.literal(false),
	}),
	schema.object({
		status: schema.enum(['blocked', 'failed']),
		code: schema.enum([
			'PLAN_NOT_FOUND',
			'PLAN_EXPIRED',
			'PLAN_ALREADY_USED',
			'CONFIRMATION_REQUIRED',
			'PROJECT_CREATION_IN_PROGRESS',
			'REVALIDATION_FAILED',
			'DESTINATION_ALREADY_EXISTS',
			'SPAWN_FAILED',
			'EXECUTION_TIMEOUT',
			'EXECUTION_CANCELLED',
			'CLI_EXECUTION_FAILED',
			'POST_VALIDATION_FAILED',
		]),
		message: schema.string(),
		projectName: schema.string().optional(),
		destinationPath: schema.string().optional(),
		output: outputSchema.optional(),
		process: processSchema.optional(),
		reason: schema.enum(['NON_ZERO_EXIT', 'INSTALLATION_FAILURE_MARKER', 'SIGNAL_TERMINATION']).optional(),
		partialProject: schema.boolean(),
		cleanupRequired: schema.boolean(),
		executionPerformed: schema.boolean(),
	}),
]);

export type CreateObliqueProjectInput = schema.infer<typeof createObliqueProjectSchema>;
export type CreateObliqueProjectResult = schema.infer<typeof createObliqueProjectResultSchema>;
