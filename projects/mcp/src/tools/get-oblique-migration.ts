/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 4 migration tool response and schemas
 */

import {z as schema} from 'zod/v4';
import {
	type ObliqueMigration,
	ObliqueMigrationPathError,
	type ObliqueMigrationReader,
	ObliqueMigrationSourceError,
} from '../sources/oblique/migration.reader.js';

export const migrationSchema = schema.object({
	fromVersion: schema.number().int().positive(),
	toVersion: schema.number().int().positive().optional(),
});

export const migrationResultSchema = schema.object({
	fromVersion: schema.number(),
	toVersion: schema.number(),
	migrationRequired: schema.boolean(),
	steps: schema.array(
		schema.object({
			fromVersion: schema.number(),
			toVersion: schema.number(),
			source: schema.string(),
			tasks: schema.array(schema.object({name: schema.string(), description: schema.string().nullable()})),
			dependencies: schema.array(
				schema.object({
					name: schema.string(),
					requirement: schema.union([
						schema.number(),
						schema.array(schema.number()),
						schema.object({type: schema.literal('computed')}),
					]),
				})
			),
		})
	),
});

export function getMigrationResponse(
	migrationReader: ObliqueMigrationReader,
	fromVersion: number,
	toVersion: number
): {
	content: {type: 'text'; text: string}[];
	structuredContent?: ObliqueMigration;
	isError?: true;
} {
	try {
		const migration = migrationReader.getMigration(fromVersion, toVersion);
		return {content: [{type: 'text', text: JSON.stringify(migration)}], structuredContent: migration};
	} catch (error) {
		if (error instanceof ObliqueMigrationPathError || error instanceof ObliqueMigrationSourceError) {
			return {content: [{type: 'text', text: error.message}], isError: true};
		}
		throw error;
	}
}
