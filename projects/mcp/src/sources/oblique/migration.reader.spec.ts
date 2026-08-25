/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 4 official migration reader tests
 */

import {resolve} from 'node:path';
import * as typescript from 'typescript';
import {ObliqueMigrationPathError, ObliqueMigrationReader, ObliqueMigrationSourceError} from './migration.reader.js';

const fixtureRepositoryRoot = resolve(__dirname, '../../../fixtures/oblique-migrations');
const malformedFixtureRepositoryRoot = resolve(__dirname, '../../../fixtures/oblique-migrations-malformed');
const outsideFixtureRepositoryRoot = resolve(__dirname, '../../../fixtures/oblique-migrations-outside');
const fixtureMigrationIndexPath = resolve(
	fixtureRepositoryRoot,
	'projects/oblique/schematics/index/ng-update/index.ts'
);
const repositoryRoot = resolve(__dirname, '../../../../..');

function createFixtureReader(): ObliqueMigrationReader {
	return new ObliqueMigrationReader(fixtureRepositoryRoot);
}

interface SyntheticReaderOptions {
	classFileName?: string;
	symbolFactory?: (declaration: typescript.ClassDeclaration) => typescript.Symbol | undefined;
}

function createSyntheticReader(
	indexText: string,
	classText: string,
	options: SyntheticReaderOptions = {}
): ObliqueMigrationReader {
	const classFileName = options.classFileName ?? 'update-v4-to-v5.ts';
	const symbolFactory =
		options.symbolFactory ??
		(declaration =>
			({flags: typescript.SymbolFlags.None, valueDeclaration: declaration}) as unknown as typescript.Symbol);
	return new ObliqueMigrationReader(fixtureRepositoryRoot, migrationIndexPath => {
		const migrationSourcePath = resolve(
			fixtureRepositoryRoot,
			'projects/oblique/schematics/index/ng-update',
			classFileName
		);
		const indexSource = typescript.createSourceFile(
			migrationIndexPath,
			indexText,
			typescript.ScriptTarget.Latest,
			true
		);
		const migrationSource = typescript.createSourceFile(
			migrationSourcePath,
			classText,
			typescript.ScriptTarget.Latest,
			true
		);
		const migrationClass = migrationSource.statements.find(typescript.isClassDeclaration);
		if (migrationClass === undefined) {
			throw new Error('The synthetic migration fixture must declare a class.');
		}
		const typeChecker = {
			getAliasedSymbol: (symbol: typescript.Symbol): typescript.Symbol => symbol,
			getSymbolAtLocation: (): typescript.Symbol | undefined => symbolFactory(migrationClass),
		} as unknown as typescript.TypeChecker;
		return {
			getSourceFile: (sourceFileName: string): typescript.SourceFile | undefined =>
				sourceFileName === migrationIndexPath ? indexSource : undefined,
			getTypeChecker: (): typescript.TypeChecker => typeChecker,
		} as unknown as typescript.Program;
	});
}

describe('ObliqueMigrationReader', () => {
	it('uses the repository root default only when no explicit root is supplied', () => {
		expect(new ObliqueMigrationReader()).toBeInstanceOf(ObliqueMigrationReader);
	});

	it('discovers named migration classes from official upgrade functions, including an import alias', () => {
		expect(createFixtureReader().getMigration(4, 5)).toEqual({
			fromVersion: 4,
			toVersion: 5,
			migrationRequired: true,
			steps: [
				{
					fromVersion: 4,
					toVersion: 5,
					source: 'projects/oblique/schematics/index/ng-update/update-v4-to-v5.ts',
					tasks: [
						{name: 'externalSharedRule', description: null},
						{name: 'renameConfiguration', description: 'Rename configuration'},
						{name: 'removeLegacyOption', description: null},
					],
					dependencies: [
						{name: 'literalDependency', requirement: 5},
						{name: 'arrayDependency', requirement: [4, 2]},
						{name: 'computedDependency', requirement: {type: 'computed'}},
					],
				},
			],
		});
	});

	it('preserves ordered chain entries and resolves this.method descriptions without returning implementation bodies', () => {
		const step = createFixtureReader().getMigration(4, 5).steps[0];

		expect(step?.tasks.map(task => task.name)).toEqual([
			'externalSharedRule',
			'renameConfiguration',
			'removeLegacyOption',
		]);
		expect(JSON.stringify(step)).not.toContain('must not be returned');
	});

	it('returns a complete multi-hop path in execution order and rejects an incomplete path', () => {
		const migration = createFixtureReader().getMigration(4, 6);

		expect(migration.steps.map(step => [step.fromVersion, step.toVersion])).toEqual([
			[4, 5],
			[5, 6],
		]);
		expect(() => createFixtureReader().getMigration(4, 8)).toThrow(
			new ObliqueMigrationPathError('No complete Oblique migration path found from version 4 to version 8.')
		);
	});

	it('returns a valid no-op result and rejects downgrade and unsupported-version requests', () => {
		expect(createFixtureReader().getMigration(5, 5)).toEqual({
			fromVersion: 5,
			toVersion: 5,
			migrationRequired: false,
			steps: [],
		});
		expect(() => createFixtureReader().getMigration(6, 4)).toThrow(
			new ObliqueMigrationPathError('Oblique migrations only support upgrades, not version 6 to version 4.')
		);
		expect(() => createFixtureReader().getMigration(3, 5)).toThrow(
			new ObliqueMigrationPathError('No complete Oblique migration path found from version 3 to version 5.')
		);
		expect(() => createFixtureReader().getMigration(4, 9)).toThrow(
			new ObliqueMigrationPathError('No complete Oblique migration path found from version 4 to version 9.')
		);
	});

	it('builds a deterministic cached index from the known ng-update index entry point', () => {
		const programFactory = jest.fn(migrationIndexPath =>
			typescript.createProgram([migrationIndexPath], {
				module: typescript.ModuleKind.ESNext,
				moduleResolution: typescript.ModuleResolutionKind.Bundler,
				noEmit: true,
				skipLibCheck: true,
				target: typescript.ScriptTarget.ES2022,
			})
		);
		const reader = new ObliqueMigrationReader(fixtureRepositoryRoot, programFactory);

		const firstResult = reader.getMigration(4, 6);
		const secondResult = reader.getMigration(4, 6);

		expect(firstResult).toEqual(secondResult);
		expect(programFactory).toHaveBeenCalledTimes(1);
		expect(programFactory).toHaveBeenCalledWith(fixtureMigrationIndexPath);
	});

	it('reports a malformed migration class cleanly', () => {
		expect(() => new ObliqueMigrationReader(malformedFixtureRepositoryRoot).getMigration(4, 5)).toThrow(
			new ObliqueMigrationSourceError('Migration class UpdateV4toV5 does not declare applyMigrations().')
		);
	});

	it('reports an unreadable migration index cleanly', () => {
		const reader = new ObliqueMigrationReader(
			fixtureRepositoryRoot,
			() =>
				({
					getSourceFile: (): undefined => undefined,
				}) as unknown as typescript.Program
		);

		expect(() => reader.getMigration(4, 5)).toThrow(
			new ObliqueMigrationSourceError(`Unable to read the Oblique migration index at "${fixtureMigrationIndexPath}".`)
		);
	});

	it('rejects duplicate, unresolved and invalid migration declarations', () => {
		const validClass = 'export class UpdateV4toV5 { dependencies = {}; applyMigrations() { return chain([]); } }';

		expect(() =>
			createSyntheticReader(
				'export function upgradeToV5() { return new Migration(); } export function upgradeToV5() { return new Migration(); }',
				validClass
			).getMigration(4, 5)
		).toThrow(new ObliqueMigrationSourceError('Multiple Oblique migrations start at version 4.'));
		expect(() => createSyntheticReader('export function upgradeToV5() {}', validClass).getMigration(4, 5)).toThrow(
			new ObliqueMigrationSourceError('Unable to resolve the migration class for upgradeToV5.')
		);
		expect(() =>
			createSyntheticReader('export function upgradeToV5() { return new Migration(); }', validClass, {
				symbolFactory: () => undefined,
			}).getMigration(4, 5)
		).toThrow(new ObliqueMigrationSourceError('Unable to resolve the migration class for upgradeToV5.'));
		expect(() =>
			createSyntheticReader('export function upgradeToV5() { return new Migration(); }', validClass, {
				symbolFactory: () => ({flags: typescript.SymbolFlags.None}) as unknown as typescript.Symbol,
			}).getMigration(4, 5)
		).toThrow(new ObliqueMigrationSourceError('Unable to resolve the migration class for upgradeToV5.'));
		expect(() =>
			createSyntheticReader('export function upgradeToV5() { return new Migration(); }', validClass, {
				symbolFactory: declaration =>
					({flags: typescript.SymbolFlags.None, declarations: [declaration]}) as unknown as typescript.Symbol,
			}).getMigration(4, 5)
		).not.toThrow();
		expect(() =>
			createSyntheticReader('export declare function upgradeToV5(): unknown;', validClass).getMigration(4, 5)
		).toThrow(new ObliqueMigrationSourceError('Unable to resolve the migration class for upgradeToV5.'));
		expect(() =>
			createSyntheticReader('export function upgradeToV5() { return new Migration(); }', validClass, {
				classFileName: 'update-v4-to-v6.ts',
			}).getMigration(4, 5)
		).toThrow(new ObliqueMigrationSourceError('Unable to validate the migration source for upgrade to version 5.'));
		expect(() =>
			createSyntheticReader('export function upgradeToV5() { return new Migration(); }', validClass, {
				classFileName: 'not-a-migration.ts',
			}).getMigration(4, 5)
		).toThrow(new ObliqueMigrationSourceError('Unable to validate the migration source for upgrade to version 5.'));
		expect(() =>
			createSyntheticReader('export function upgradeToV5() { return new Migration(); }', validClass, {
				classFileName: 'update-v4.ts',
			}).getMigration(4, 5)
		).toThrow(new ObliqueMigrationSourceError('Unable to validate the migration source for upgrade to version 5.'));
		expect(() =>
			createSyntheticReader('export function upgradeToV5() { return new Migration(); }', validClass, {
				classFileName: 'update-vx-to-v5.ts',
			}).getMigration(4, 5)
		).toThrow(new ObliqueMigrationSourceError('Unable to validate the migration source for upgrade to version 5.'));
	});

	it('handles conservative AST fallbacks for unsupported task and dependency forms', () => {
		const reader = createSyntheticReader(
			'export function unrelated() { return new Migration(); } export function upgradeToVinvalid() { return new Migration(); } export function upgradeToV5() { return new Migration(); }',
			`export class UpdateV4toV5 {
				dependencies = {...baseDependencies, [computedName]: 5, mixedDependency: [4, unknownVersion]};
				applyMigrations() { return chain([task, (() => undefined)(), this.withoutInfo(), this.withDynamicInfo()]); }
				withoutInfo() { return undefined; }
				withDynamicInfo() { infoMigration({}, dynamicMessage); return undefined; }
			}`
		);

		expect(reader.getMigration(4, 5).steps[0]).toMatchObject({
			tasks: [
				{name: 'Identifier', description: null},
				{name: 'ParenthesizedExpression', description: null},
				{name: 'withoutInfo', description: null},
				{name: 'withDynamicInfo', description: null},
			],
			dependencies: [{name: 'mixedDependency', requirement: {type: 'computed'}}],
		});
	});

	it('reports a migration class without a chain and treats missing dependency metadata as empty', () => {
		expect(() =>
			createSyntheticReader(
				'export function upgradeToV5() { return new Migration(); }',
				'export class UpdateV4toV5 { applyMigrations() { return undefined; } }'
			).getMigration(4, 5)
		).toThrow(
			new ObliqueMigrationSourceError(
				'Migration class UpdateV4toV5 does not declare chain([...]) in applyMigrations().'
			)
		);
		expect(
			createSyntheticReader(
				'export function upgradeToV5() { return new Migration(); }',
				'export class UpdateV4toV5 { applyMigrations() { return chain([]); } }'
			).getMigration(4, 5).steps[0]?.dependencies
		).toEqual([]);
	});

	it('uses anonymous migration class placeholders in malformed-source errors', () => {
		expect(() =>
			createSyntheticReader(
				'export function upgradeToV5() { return new Migration(); }',
				'export default class { dependencies = {}; }'
			).getMigration(4, 5)
		).toThrow(new ObliqueMigrationSourceError('Migration class <anonymous> does not declare applyMigrations().'));
		expect(() =>
			createSyntheticReader(
				'export function upgradeToV5() { return new Migration(); }',
				'export default class { dependencies = {}; applyMigrations() { return undefined; } }'
			).getMigration(4, 5)
		).toThrow(
			new ObliqueMigrationSourceError('Migration class <anonymous> does not declare chain([...]) in applyMigrations().')
		);
	});

	it('rejects a migration class resolved outside the authoritative ng-update directory', () => {
		expect(() => new ObliqueMigrationReader(outsideFixtureRepositoryRoot).getMigration(4, 5)).toThrow(
			new ObliqueMigrationSourceError('Resolved a migration source outside the official ng-update directory.')
		);
	});

	it('indexes real official migrations through the checked-out ng-update source', () => {
		const reader = new ObliqueMigrationReader(repositoryRoot);
		const v14ToV15 = reader.getMigration(14, 15);

		expect(v14ToV15).toMatchObject({
			fromVersion: 14,
			toVersion: 15,
			steps: [
				{
					fromVersion: 14,
					toVersion: 15,
					source: 'projects/oblique/schematics/index/ng-update/update-v14-to-v15.ts',
				},
			],
		});
		expect(v14ToV15.steps[0]?.tasks).toEqual([
			{name: 'warnIfStandalone', description: null},
			{name: 'removeMaxFavoriteApplications', description: 'Remove maxFavoriteApplications property'},
			{name: 'removeMaxLastUsedApplications', description: 'Remove maxLastUsedApplications property'},
			{name: 'removeObILocaleDisplay', description: 'Remove OblLocale.display property'},
			{name: 'renameIcons', description: 'Rename icons'},
			{name: 'removeBrowserAnimationModuleIfUnused', description: null},
			{name: 'fixTestConfig', description: 'Adapt Jest configuration'},
			{name: 'disableZonelessIfAsyncUsed', description: 'Disable zoneless for tests'},
			{
				name: 'addPrettierrcAngularHtmlParser',
				description: 'Add Angular html parser to .prettierrc if the file exists',
			},
		]);
		expect(reader.getMigration(13, 15).steps.map(step => [step.fromVersion, step.toVersion])).toEqual([
			[13, 14],
			[14, 15],
		]);
		expect(reader.getMigration(10, 12).steps.map(step => [step.fromVersion, step.toVersion])).toEqual([
			[10, 11],
			[11, 12],
		]);
		expect(() => reader.getMigration(3, 15)).toThrow(
			new ObliqueMigrationPathError('No complete Oblique migration path found from version 3 to version 15.')
		);
	});
});
