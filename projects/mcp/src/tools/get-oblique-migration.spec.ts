/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 4 migration tool response tests
 */

import {
	ObliqueMigrationPathError,
	type ObliqueMigrationReader,
	ObliqueMigrationSourceError,
} from '../sources/oblique/migration.reader.js';
import {getMigrationResponse, migrationResultSchema, migrationSchema} from './get-oblique-migration.js';

const migration = {
	fromVersion: 14,
	toVersion: 15,
	migrationRequired: true,
	steps: [
		{
			fromVersion: 14,
			toVersion: 15,
			source: 'projects/oblique/schematics/index/ng-update/update-v14-to-v15.ts',
			tasks: [{name: 'renameIcons', description: 'Rename icons'}],
			dependencies: [{name: '@angular/core', requirement: 20}],
		},
	],
};

function createReader(getMigration: ObliqueMigrationReader['getMigration']): ObliqueMigrationReader {
	return {getMigration} as ObliqueMigrationReader;
}

describe('getMigrationResponse', () => {
	it('returns structured official migration information', () => {
		const response = getMigrationResponse(
			createReader(() => migration),
			14,
			15
		);

		expect(response).toEqual({
			content: [{type: 'text', text: JSON.stringify(migration)}],
			structuredContent: migration,
		});
		expect(migrationSchema.parse({fromVersion: 14, toVersion: 15})).toEqual({fromVersion: 14, toVersion: 15});
		expect(migrationResultSchema.parse(migration)).toEqual(migration);
	});

	it('returns clean reader errors to MCP clients', () => {
		const error = new ObliqueMigrationPathError(
			'No complete Oblique migration path found from version 3 to version 15.'
		);

		expect(
			getMigrationResponse(
				createReader(() => {
					throw error;
				}),
				3,
				15
			)
		).toEqual({
			content: [{type: 'text', text: error.message}],
			isError: true,
		});
		expect(
			getMigrationResponse(
				createReader(() => {
					throw new ObliqueMigrationSourceError('Malformed official source.');
				}),
				14,
				15
			)
		).toEqual({content: [{type: 'text', text: 'Malformed official source.'}], isError: true});
	});

	it('rethrows unexpected programming errors', () => {
		expect(() =>
			getMigrationResponse(
				createReader(() => {
					throw new Error('Unexpected failure.');
				}),
				14,
				15
			)
		).toThrow('Unexpected failure.');
	});
});
