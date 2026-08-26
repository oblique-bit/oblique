/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 5 TypeScript public API analysis tests
 */

import {resolve} from 'node:path';
import * as typescript from 'typescript';
import {ObliqueCodeAnalyzer, type ObliqueCodePublicApiReader} from './oblique-code.analyzer.js';
import {type ObliqueApiSymbol, ObliquePublicApiReader} from '../sources/oblique/public-api.reader.js';

const fixtureRepositoryRoot = resolve(__dirname, '../../fixtures/oblique-public-api');

function createPublicApiSymbol(
	symbol: string,
	deprecated = false,
	documentation: string | null = null
): ObliqueApiSymbol {
	return {
		symbol,
		kind: 'class',
		public: true,
		packageImport: '@oblique/oblique',
		exportedFrom: 'projects/oblique/src/public_api.ts',
		declaredIn: 'projects/oblique/src/lib/example.ts',
		signature: `class ${symbol}`,
		documentation,
		deprecated,
	};
}

const defaultSymbols = [
	createPublicApiSymbol('ObNotificationService'),
	createPublicApiSymbol('ObINotification'),
	createPublicApiSymbol('ObButtonDirective'),
];

function createAnalyzer(
	symbols: readonly ObliqueApiSymbol[] = defaultSymbols,
	syntaxDiagnosticsReader?: (code: string, fileName: string) => readonly typescript.Diagnostic[] | undefined
): ObliqueCodeAnalyzer {
	const publicApiBySymbol = new Map(symbols.map(symbol => [symbol.symbol, symbol]));
	const reader: ObliqueCodePublicApiReader = {getApi: symbol => publicApiBySymbol.get(symbol)};
	return new ObliqueCodeAnalyzer(reader, syntaxDiagnosticsReader);
}

describe('ObliqueCodeAnalyzer', () => {
	it('accepts valid named, aliased and type-only public imports', () => {
		const analyzer = createAnalyzer();

		expect(
			analyzer.analyze(`
				import {ObNotificationService} from '@oblique/oblique';
				import {ObNotificationService as NotificationService} from '@oblique/oblique';
				import type {ObINotification} from '@oblique/oblique';
				import {type ObINotification as Notification} from '@oblique/oblique';`)
		).toEqual({valid: true, summary: {errors: 0, warnings: 0, info: 0}, findings: []});
	});

	it('reports unknown public symbols at the imported identifier', () => {
		const result = createAnalyzer().analyze("import {ObDefinitelyDoesNotExist} from '@oblique/oblique';");

		expect(result).toEqual({
			valid: false,
			summary: {errors: 1, warnings: 0, info: 0},
			findings: [
				{
					rule: 'OBLIQUE_UNKNOWN_PUBLIC_SYMBOL',
					severity: 'error',
					message:
						'"ObDefinitelyDoesNotExist" is not a public export of @oblique/oblique in the checked-out Oblique version.',
					symbol: 'ObDefinitelyDoesNotExist',
					module: '@oblique/oblique',
					location: {line: 1, column: 9},
					recommendation: 'Import only symbols exported from "@oblique/oblique".',
				},
			],
		});
	});

	it('rejects unsupported deep and side-effect imports but allows the published CSS asset subpath', () => {
		const analyzer = createAnalyzer();

		expect(analyzer.analyze("import {InternalThing} from '@oblique/oblique/src/lib/internal';").findings).toMatchObject(
			[
				{
					rule: 'OBLIQUE_INTERNAL_IMPORT',
					severity: 'error',
					module: '@oblique/oblique/src/lib/internal',
					recommendation: 'Import public symbols from "@oblique/oblique".',
				},
			]
		);
		expect(analyzer.analyze("import '@oblique/oblique/src/lib/internal';").findings).toMatchObject([
			{rule: 'OBLIQUE_INTERNAL_IMPORT', module: '@oblique/oblique/src/lib/internal'},
		]);
		expect(analyzer.analyze("import '@oblique/oblique/styles/css/oblique-core.css';")).toMatchObject({
			valid: true,
			findings: [],
		});
		expect(analyzer.analyze("import '@oblique/oblique/styles/css/../internal.css';").findings).toHaveLength(1);
	});

	it('rejects an unsupported default import unless the public API exposes default', () => {
		expect(createAnalyzer().analyze("import Oblique from '@oblique/oblique';").findings).toMatchObject([
			{rule: 'OBLIQUE_DEFAULT_IMPORT', severity: 'error', module: '@oblique/oblique'},
		]);
		expect(
			createAnalyzer([...defaultSymbols, createPublicApiSymbol('default')]).analyze(
				"import Oblique from '@oblique/oblique';"
			)
		).toMatchObject({valid: true, findings: []});
	});

	it('validates namespace property accesses without reporting unused namespaces', () => {
		const analyzer = createAnalyzer();

		expect(
			analyzer.analyze("import * as Oblique from '@oblique/oblique'; const x = Oblique.ObButtonDirective;")
		).toMatchObject({valid: true, findings: []});
		expect(
			analyzer.analyze("import * as Oblique from '@oblique/oblique'; Oblique.ObDefinitelyDoesNotExist;")
		).toMatchObject({
			valid: false,
			findings: [{rule: 'OBLIQUE_UNKNOWN_PUBLIC_SYMBOL', symbol: 'ObDefinitelyDoesNotExist'}],
		});
		expect(createAnalyzer().analyze("import * as Oblique from '@oblique/oblique';")).toMatchObject({
			valid: true,
			findings: [],
		});
	});

	it('validates namespace qualified names used in type positions', () => {
		const analyzer = createAnalyzer();

		expect(
			analyzer.analyze("import * as Oblique from '@oblique/oblique'; let notification: Oblique.ObINotification;")
		).toMatchObject({valid: true, findings: []});
		expect(
			analyzer.analyze(
				"import * as Oblique from '@oblique/oblique'; let notification: Oblique.ObDefinitelyDoesNotExist;"
			)
		).toMatchObject({
			valid: false,
			findings: [{rule: 'OBLIQUE_UNKNOWN_PUBLIC_SYMBOL', symbol: 'ObDefinitelyDoesNotExist'}],
		});
	});

	it('does not treat lexical namespace shadows as public namespace accesses', () => {
		const analyzer = createAnalyzer();

		expect(
			analyzer.analyze(`
				import * as Oblique from '@oblique/oblique';
				function test(Oblique: {LocalValue: number}): number {
					return Oblique.LocalValue;
				}`)
		).toMatchObject({valid: true, findings: []});
		expect(
			analyzer.analyze(`
				import * as Oblique from '@oblique/oblique';
				{
					const Oblique = {LocalValue: 1};
					console.log(Oblique.LocalValue);
				}`)
		).toMatchObject({valid: true, findings: []});
	});

	it('conservatively recognizes lexical bindings in other TypeScript scopes', () => {
		expect(
			createAnalyzer().analyze(`
				import * as Oblique from '@oblique/oblique';
				try {} catch (Oblique) { Oblique.LocalValue; }
				try {} catch {}
				for (const Oblique = {LocalValue: 1}; false;) { Oblique.LocalValue; }
				for (const Oblique in {}) { Oblique.LocalValue; }
				for (const Oblique of []) { Oblique.LocalValue; }
				for (Oblique; false;) {}
				{
					const [, Oblique] = [{}, {LocalValue: 1}];
					Oblique.LocalValue;
				}
				{
					function Oblique() {}
					Oblique.LocalValue;
				}
				{
					class Oblique {}
					Oblique.LocalValue;
				}
				{
					enum Oblique {LocalValue}
					Oblique.LocalValue;
				}`)
		).toMatchObject({valid: true, findings: []});
	});

	it('tracks renamed and multiple namespace imports', () => {
		const analyzer = createAnalyzer();

		expect(analyzer.analyze("import * as Ob from '@oblique/oblique'; const x = Ob.ObButtonDirective;")).toMatchObject({
			valid: true,
			findings: [],
		});
		expect(
			analyzer.analyze(`
				import * as Ob1 from '@oblique/oblique';
				import * as Ob2 from '@oblique/oblique';
				Ob1.ObButtonDirective;
				Ob2.ObDefinitelyDoesNotExist;`)
		).toMatchObject({
			valid: false,
			findings: [{rule: 'OBLIQUE_UNKNOWN_PUBLIC_SYMBOL', symbol: 'ObDefinitelyDoesNotExist'}],
		});
	});

	it('validates static namespace element access and ignores dynamic element access', () => {
		const analyzer = createAnalyzer();

		expect(
			analyzer.analyze("import * as Oblique from '@oblique/oblique'; Oblique['ObButtonDirective'];")
		).toMatchObject({valid: true, findings: []});
		expect(
			analyzer.analyze("import * as Oblique from '@oblique/oblique'; Oblique['ObDefinitelyDoesNotExist'];")
		).toMatchObject({
			valid: false,
			findings: [{rule: 'OBLIQUE_UNKNOWN_PUBLIC_SYMBOL', symbol: 'ObDefinitelyDoesNotExist'}],
		});
		expect(analyzer.analyze("import * as Oblique from '@oblique/oblique'; Oblique[someVariable];")).toMatchObject({
			valid: true,
			findings: [],
		});
	});

	it('validates named public re-exports', () => {
		const analyzer = createAnalyzer();

		expect(analyzer.analyze("export {ObNotificationService} from '@oblique/oblique';")).toMatchObject({
			valid: true,
			findings: [],
		});
		expect(analyzer.analyze("export {ObDefinitelyDoesNotExist} from '@oblique/oblique';")).toMatchObject({
			valid: false,
			findings: [{rule: 'OBLIQUE_UNKNOWN_PUBLIC_SYMBOL', symbol: 'ObDefinitelyDoesNotExist'}],
		});
		expect(analyzer.analyze("export {Something} from '@oblique/oblique/lib/internal';")).toMatchObject({
			valid: false,
			findings: [{rule: 'OBLIQUE_INTERNAL_IMPORT', module: '@oblique/oblique/lib/internal'}],
		});
		expect(analyzer.analyze("export * from '@oblique/oblique';")).toMatchObject({valid: true, findings: []});
		expect(analyzer.analyze("export * from '@oblique/oblique/src/lib/internal';")).toMatchObject({
			valid: false,
			findings: [{rule: 'OBLIQUE_INTERNAL_IMPORT', module: '@oblique/oblique/src/lib/internal'}],
		});
	});

	it('reports deprecated public symbols with their available documentation', () => {
		const deprecatedSymbol = createPublicApiSymbol('ObDeprecatedService', true, 'Use ObReplacementService instead.');
		const undocumentedDeprecatedSymbol = createPublicApiSymbol('ObDeprecatedWithoutDocumentation', true);
		const analyzer = createAnalyzer([...defaultSymbols, deprecatedSymbol, undocumentedDeprecatedSymbol]);

		expect(analyzer.analyze("import {ObDeprecatedService} from '@oblique/oblique';")).toMatchObject({
			valid: true,
			summary: {errors: 0, warnings: 1, info: 0},
			findings: [
				{
					rule: 'OBLIQUE_DEPRECATED_PUBLIC_SYMBOL',
					severity: 'warning',
					symbol: 'ObDeprecatedService',
					message: '"ObDeprecatedService" is deprecated in @oblique/oblique. Use ObReplacementService instead.',
				},
			],
		});
		expect(
			analyzer.analyze("import {ObDeprecatedWithoutDocumentation} from '@oblique/oblique';").findings[0]?.message
		).toBe('"ObDeprecatedWithoutDocumentation" is deprecated in @oblique/oblique.');
	});

	it('returns only deterministic TypeScript syntax findings for malformed source', () => {
		const result = createAnalyzer().analyze("import {ObNotificationService from '@oblique/oblique';");

		expect(result.valid).toBe(false);
		expect(result.summary.errors).toBeGreaterThan(0);
		expect(result.findings).toEqual(
			expect.arrayContaining([
				expect.objectContaining({rule: 'TYPESCRIPT_SYNTAX_ERROR', severity: 'error', location: {line: 1, column: 31}}),
			])
		);
		expect(result.findings).not.toEqual(
			expect.arrayContaining([expect.objectContaining({rule: 'OBLIQUE_UNKNOWN_PUBLIC_SYMBOL'})])
		);
	});

	it('does not duplicate identical TypeScript syntax diagnostics', () => {
		const diagnostic: typescript.Diagnostic = {
			category: typescript.DiagnosticCategory.Error,
			code: 1000,
			messageText: 'Synthetic syntax error',
			start: 6,
			length: 1,
		};

		expect(createAnalyzer(defaultSymbols, () => [diagnostic, diagnostic]).analyze('const value = 1;')).toMatchObject({
			valid: false,
			findings: [
				{
					rule: 'TYPESCRIPT_SYNTAX_ERROR',
					message: 'Synthetic syntax error',
					location: {line: 1, column: 7},
				},
			],
		});
	});

	it('handles optional syntax diagnostic metadata without throwing', () => {
		expect(createAnalyzer(defaultSymbols, () => undefined).analyze('const value = 1;')).toMatchObject({
			valid: true,
			findings: [],
		});
		expect(
			createAnalyzer(defaultSymbols, () => [
				{category: typescript.DiagnosticCategory.Error, code: 1000, messageText: 'Synthetic syntax error'},
			]).analyze('const value = 1;')
		).toMatchObject({
			valid: false,
			findings: [{rule: 'TYPESCRIPT_SYNTAX_ERROR', location: {line: 1, column: 1}}],
		});
	});

	it('ignores unrelated modules and re-exports without a module specifier', () => {
		expect(
			createAnalyzer().analyze(
				"import {Component} from '@angular/core'; import {map} from 'rxjs'; export {Component}; export * from '@oblique/oblique';"
			)
		).toEqual({valid: true, summary: {errors: 0, warnings: 0, info: 0}, findings: []});
	});

	it('avoids duplicate root-cause findings for one deep import occurrence', () => {
		const result = createAnalyzer().analyze(
			"import {ObDefinitelyDoesNotExist} from '@oblique/oblique/src/lib/internal';"
		);

		expect(result.findings).toHaveLength(1);
		expect(result.findings[0]?.rule).toBe('OBLIQUE_INTERNAL_IMPORT');
	});

	it('keeps valid named imports when a default import is invalid', () => {
		const result = createAnalyzer().analyze("import Oblique, {ObButtonDirective} from '@oblique/oblique';");

		expect(result.findings).toEqual([expect.objectContaining({rule: 'OBLIQUE_DEFAULT_IMPORT', severity: 'error'})]);
	});

	it('remains resilient to modern TypeScript import attributes', () => {
		expect(
			createAnalyzer().analyze(
				"import * as Oblique from '@oblique/oblique' with {type: 'javascript'}; Oblique.ObButtonDirective;"
			)
		).toMatchObject({valid: true, findings: []});
	});

	it('orders multiple findings by source position deterministically', () => {
		const analyzer = createAnalyzer();
		const code = `
			import Oblique from '@oblique/oblique';
			import {ObDefinitelyDoesNotExist} from '@oblique/oblique';
			import * as Namespace from '@oblique/oblique'; Namespace.ObAnotherMissingSymbol;`;

		const firstResult = analyzer.analyze(code);
		const secondResult = analyzer.analyze(code);

		expect(firstResult).toEqual(secondResult);
		expect(firstResult.findings.map(finding => finding.rule)).toEqual([
			'OBLIQUE_DEFAULT_IMPORT',
			'OBLIQUE_UNKNOWN_PUBLIC_SYMBOL',
			'OBLIQUE_UNKNOWN_PUBLIC_SYMBOL',
		]);
	});

	it('shares the public API reader cache with direct public API lookups', () => {
		const programFactory = jest.fn(publicApiPath =>
			typescript.createProgram([publicApiPath], {
				module: typescript.ModuleKind.ESNext,
				moduleResolution: typescript.ModuleResolutionKind.Bundler,
				noEmit: true,
				skipLibCheck: true,
				target: typescript.ScriptTarget.ES2022,
			})
		);
		const reader = new ObliquePublicApiReader(fixtureRepositoryRoot, programFactory);
		const analyzer = new ObliqueCodeAnalyzer(reader);

		expect(reader.getApi('NamedPublicClass')).toBeDefined();
		expect(analyzer.analyze("import {NamedPublicClass} from '@oblique/oblique';")).toMatchObject({valid: true});
		expect(analyzer.analyze("import {NamedPublicClass} from '@oblique/oblique';")).toMatchObject({valid: true});
		expect(programFactory).toHaveBeenCalledTimes(1);
	});
});
