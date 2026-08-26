/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 3 public API reader tests
 */

import {resolve} from 'node:path';
import * as typescript from 'typescript';
import {ObliqueCodeAnalyzer} from '../../analyzers/oblique-code.analyzer.js';
import {ObliqueTemplateAnalyzer} from '../../analyzers/oblique-template.analyzer.js';
import {getObliqueTemplateApi} from '../../tools/get-oblique-template-api.js';
import {ObliquePublicApiReader, isTypeScriptIdentifier} from './public-api.reader.js';

const fixtureRepositoryRoot = resolve(__dirname, '../../../fixtures/oblique-public-api');
const fixturePublicApiPath = resolve(fixtureRepositoryRoot, 'projects/oblique/src/public_api.ts');
const repositoryRoot = resolve(__dirname, '../../../../..');

function createFixtureReader(): ObliquePublicApiReader {
	return new ObliquePublicApiReader(fixtureRepositoryRoot);
}

describe('ObliquePublicApiReader', () => {
	it('uses the repository root default only when no explicit root is supplied', () => {
		expect(new ObliquePublicApiReader()).toBeInstanceOf(ObliquePublicApiReader);
	});

	it('accepts only one TypeScript identifier as a symbol input', () => {
		expect(isTypeScriptIdentifier('ObNotificationService')).toBe(true);
		expect(isTypeScriptIdentifier('  ObNotificationService  ')).toBe(false);
		expect(isTypeScriptIdentifier('../../outside-the-repository')).toBe(false);
	});

	it('indexes a named public class re-export without leaking its implementation', () => {
		const api = createFixtureReader().getApi('NamedPublicClass');

		expect(api).toMatchObject({
			symbol: 'NamedPublicClass',
			kind: 'class',
			public: true,
			packageImport: '@oblique/oblique',
			exportedFrom: 'projects/oblique/src/public_api.ts',
			declaredIn: 'projects/oblique/src/lib/named-public-class.ts',
			signature: 'class NamedPublicClass',
			documentation: null,
			deprecated: false,
		});
		expect(api?.signature).not.toContain('hiddenImplementation');
		expect(api?.signature).not.toContain('must not be exposed');
	});

	it('indexes a single named interface re-export', () => {
		expect(createFixtureReader().getApi('PublicInterface')).toMatchObject({
			kind: 'interface',
			signature: 'interface PublicInterface<T = string>',
			declaredIn: 'projects/oblique/src/lib/public-interface.ts',
		});
	});

	it('resolves enum, function and const exports through export-all declarations and a re-export chain', () => {
		const reader = createFixtureReader();

		expect(reader.getApi('PublicEnum')).toMatchObject({
			kind: 'enum',
			signature: 'enum PublicEnum',
			declaredIn: 'projects/oblique/src/lib/public-declarations.ts',
		});
		expect(reader.getApi('publicFunction')).toMatchObject({
			kind: 'function',
			signature: 'function publicFunction(value: string): number',
			declaredIn: 'projects/oblique/src/lib/public-declarations.ts',
		});
		expect(reader.getApi('PUBLIC_TOKEN')).toMatchObject({
			kind: 'const',
			signature: 'const PUBLIC_TOKEN: { readonly description: string; }',
			declaredIn: 'projects/oblique/src/lib/public-declarations.ts',
		});
	});

	it('resolves export-all cycles without recursing indefinitely', () => {
		expect(createFixtureReader().getApi('LoopedPublicType')).toMatchObject({
			kind: 'type',
			signature: 'type LoopedPublicType = {value: string}',
			declaredIn: 'projects/oblique/src/lib/looped-public-type.ts',
		});
	});

	it('classifies plain classes, guards, mutable values and other declarations conservatively', () => {
		const reader = createFixtureReader();

		expect(reader.getApi('PlainPublicClass')).toMatchObject({
			kind: 'class',
			signature: 'class PlainPublicClass implements Marker',
		});
		expect(reader.getApi('Example')).toMatchObject({
			kind: 'class',
			signature: 'class Example implements CanSomething',
		});
		expect(reader.getApi('RouterGuard')).toMatchObject({
			kind: 'guard',
			signature: 'class RouterGuard implements RouterCanDeactivate<unknown>',
		});
		expect(reader.getApi('PublicUnknownGuard')).toMatchObject({
			kind: 'class',
			signature: 'class PublicUnknownGuard implements MissingGuard',
		});
		expect(reader.getApi('DecoratorWithoutSymbol')).toMatchObject({
			kind: 'class',
			signature: 'class DecoratorWithoutSymbol',
		});
		expect(reader.getApi('PublicMutableValue')).toMatchObject({
			kind: 'other',
			signature: 'let PublicMutableValue: number',
		});
		expect(reader.getApi('PublicNamespace')).toMatchObject({kind: 'other', signature: 'PublicNamespace'});
		expect(reader.getApi('DirectPublicConstant')).toMatchObject({
			kind: 'const',
			signature: 'const DirectPublicConstant: 1',
			declaredIn: 'projects/oblique/src/public_api.ts',
		});
	});

	it('falls back to class when an implemented type has no provable Angular Router provenance', () => {
		const program = typescript.createProgram([fixturePublicApiPath], {
			module: typescript.ModuleKind.ESNext,
			moduleResolution: typescript.ModuleResolutionKind.Bundler,
		});
		const typeChecker = program.getTypeChecker();
		const getSymbolAtLocation = typeChecker.getSymbolAtLocation.bind(typeChecker);
		jest
			.spyOn(typeChecker, 'getSymbolAtLocation')
			.mockImplementation(node =>
				typescript.isIdentifier(node) && node.text === 'CanSomething'
					? ({flags: typescript.SymbolFlags.None, getName: () => 'CanSomething'} as unknown as typescript.Symbol)
					: getSymbolAtLocation(node)
			);
		const reader = new ObliquePublicApiReader(fixtureRepositoryRoot, () => program);

		expect(reader.getApi('Example')).toMatchObject({kind: 'class'});
	});

	it('extracts JSDoc documentation and deprecation metadata', () => {
		expect(createFixtureReader().getApi('DeprecatedPublicType')).toMatchObject({
			kind: 'type',
			documentation: 'Legacy public API.',
			deprecated: true,
		});
	});

	it('indexes statically-known public Angular component and directive selectors only', () => {
		const reader = createFixtureReader();

		expect(reader.getAngularTemplateApis()).toEqual(
			expect.arrayContaining([
				expect.objectContaining({
					symbol: 'PublicFixtureDirective',
					kind: 'directive',
					selector: '[obPublicFixture]',
					public: true,
				}),
				expect.objectContaining({
					symbol: 'PublicFixtureComponent',
					kind: 'component',
					selector: 'ob-public-fixture',
					public: true,
				}),
				expect.objectContaining({
					symbol: 'StringKeySelectorFixtureComponent',
					kind: 'component',
					selector: 'ob-string-key-fixture',
					public: true,
				}),
			])
		);
		expect(reader.getAngularTemplateApis()).not.toEqual(
			expect.arrayContaining([
				expect.objectContaining({symbol: 'ComputedMetadataFixtureComponent'}),
				expect.objectContaining({symbol: 'DynamicFixtureComponent'}),
				expect.objectContaining({symbol: 'EmptySelectorFixtureComponent'}),
				expect.objectContaining({symbol: 'MissingMetadataFixtureComponent'}),
				expect.objectContaining({symbol: 'NonCallDecoratorFixtureComponent'}),
				expect.objectContaining({symbol: 'NumericKeySelectorFixtureComponent'}),
				expect.objectContaining({symbol: 'InternalFixtureComponent'}),
				expect.objectContaining({symbol: 'InternalFixtureDirective'}),
				expect.objectContaining({symbol: 'LocalComponentDecoratorFixture'}),
				expect.objectContaining({symbol: 'LocalDirectiveDecoratorFixture'}),
			])
		);
	});

	it('requires @angular/core decorator provenance for Angular class kinds and selectors', () => {
		const reader = createFixtureReader();

		expect(reader.getApi('PublicFixtureComponent')).toMatchObject({kind: 'component'});
		expect(reader.getApi('PublicFixtureDirective')).toMatchObject({kind: 'directive'});
		expect(reader.getApi('LocalComponentDecoratorFixture')).toMatchObject({kind: 'class'});
		expect(reader.getApi('LocalDirectiveDecoratorFixture')).toMatchObject({kind: 'class'});
		expect(reader.getApi('LocalInjectableDecoratorFixture')).toMatchObject({kind: 'class'});
		expect(reader.getApi('LocalNgModuleDecoratorFixture')).toMatchObject({kind: 'class'});
		expect(reader.getApi('LocalPipeDecoratorFixture')).toMatchObject({kind: 'class'});
		expect(reader.getAngularTemplateApis()).not.toEqual(
			expect.arrayContaining([
				expect.objectContaining({selector: 'ob-fake'}),
				expect.objectContaining({selector: '[obFake]'}),
			])
		);
	});

	it('extracts public classic, signal, inherited and explicitly exposed host-directive bindings', () => {
		const api = createFixtureReader()
			.getAngularTemplateApis()
			.find(candidate => candidate.symbol === 'BindingFixtureComponent');

		expect(api).toMatchObject({selector: 'ob-binding-fixture'});
		expect(api?.inputs).toEqual(
			expect.arrayContaining([
				expect.objectContaining({name: 'aliasInput', propertyName: 'aliasedInput'}),
				expect.objectContaining({name: 'requiredInput', required: true}),
				expect.objectContaining({name: 'transformedInput', propertyName: 'transformedInput'}),
				expect.objectContaining({name: 'date', required: true}),
				expect.objectContaining({name: 'publicFormat', propertyName: 'format'}),
				expect.objectContaining({name: 'baseSignal'}),
				expect.objectContaining({name: 'hostInput', propertyName: 'exposedInput'}),
				expect.objectContaining({name: 'oldInput', deprecated: true}),
			])
		);
		expect(api?.inputs).not.toEqual(expect.arrayContaining([expect.objectContaining({name: 'hiddenInput'})]));
		expect(api?.outputs).toEqual(
			expect.arrayContaining([
				expect.objectContaining({name: 'aliasOutput', propertyName: 'aliasedOutput'}),
				expect.objectContaining({name: 'baseOutput'}),
				expect.objectContaining({name: 'hostOutput', propertyName: 'exposedOutput'}),
				expect.objectContaining({name: 'publicClosed', propertyName: 'closed'}),
				expect.objectContaining({name: 'oldOutput', deprecated: true}),
			])
		);
		expect(api?.outputs).not.toEqual(expect.arrayContaining([expect.objectContaining({name: 'hiddenOutput'})]));
		expect(
			createFixtureReader()
				.getAngularTemplateApis()
				.find(candidate => candidate.symbol === 'LocalBindingFixtureComponent')
		).toMatchObject({
			inputs: [],
			outputs: [],
		});
	});

	it('covers static binding variants and skips dynamic binding or host metadata conservatively', () => {
		const api = createFixtureReader()
			.getAngularTemplateApis()
			.find(candidate => candidate.symbol === 'BindingCoverageFixtureComponent');

		expect(api?.inputs).toEqual(
			expect.arrayContaining([
				expect.objectContaining({name: 'configuredAlias', required: true}),
				expect.objectContaining({name: 'explicitlyOptionalInput', required: false}),
				expect.objectContaining({name: 'plainSignal'}),
				expect.objectContaining({name: 'requiredSignal', required: true}),
				expect.objectContaining({name: 'value'}),
				expect.objectContaining({name: 'requiredValue', required: true}),
				expect.objectContaining({name: 'publicValue'}),
				expect.objectContaining({name: 'exposedInput'}),
			])
		);
		expect(api?.inputs).not.toEqual(
			expect.arrayContaining([
				expect.objectContaining({name: 'dynamicInput'}),
				expect.objectContaining({name: 'dynamicDecoratorInput'}),
				expect.objectContaining({name: 'dynamicSignal'}),
			])
		);
		expect(api?.outputs).toEqual(
			expect.arrayContaining([
				expect.objectContaining({name: 'plainOutput'}),
				expect.objectContaining({name: 'outputAlias'}),
				expect.objectContaining({name: 'signalOutput'}),
				expect.objectContaining({name: 'valueChange'}),
				expect.objectContaining({name: 'requiredValueChange'}),
				expect.objectContaining({name: 'publicValueChange'}),
				expect.objectContaining({name: 'exposedOutput'}),
			])
		);
		expect(api?.outputs).not.toEqual(expect.arrayContaining([expect.objectContaining({name: 'dynamicSignalOutput'})]));
	});

	it('does not expose an internal symbol, unknown symbol or a case-variant', () => {
		const reader = createFixtureReader();

		expect(reader.getApi('InternalOnlyClass')).toBeUndefined();
		expect(reader.getApi('__UnknownObliqueSymbol__')).toBeUndefined();
		expect(reader.getApi('namedpublicclass')).toBeUndefined();
	});

	it('builds one deterministic cached index from the known public API entry point', () => {
		const programFactory = jest.fn(publicApiPath =>
			typescript.createProgram([publicApiPath], {
				experimentalDecorators: true,
				module: typescript.ModuleKind.ESNext,
				moduleResolution: typescript.ModuleResolutionKind.Bundler,
				noEmit: true,
				skipLibCheck: true,
				target: typescript.ScriptTarget.ES2022,
			})
		);
		const reader = new ObliquePublicApiReader(fixtureRepositoryRoot, programFactory);

		const firstResult = reader.getApi('PublicEnum');
		const secondResult = reader.getApi('PublicEnum');
		const selectors = reader.getAngularTemplateApis();
		const unsafeLookup = reader.getApi('../../outside-the-repository');

		expect(firstResult).toEqual(secondResult);
		expect(unsafeLookup).toBeUndefined();
		expect(selectors).toHaveLength(11);
		expect(programFactory).toHaveBeenCalledTimes(1);
		expect(programFactory).toHaveBeenCalledWith(fixturePublicApiPath);
	});

	it('shares one public API Program between API, code and template analysis', () => {
		const programFactory = jest.fn(publicApiPath =>
			typescript.createProgram([publicApiPath], {
				experimentalDecorators: true,
				module: typescript.ModuleKind.ESNext,
				moduleResolution: typescript.ModuleResolutionKind.Bundler,
				noEmit: true,
				skipLibCheck: true,
				target: typescript.ScriptTarget.ES2022,
			})
		);
		const reader = new ObliquePublicApiReader(fixtureRepositoryRoot, programFactory);
		const packageMetadata = {
			version: '15.4.4',
			engines: {node: '>=22.12.0'},
			dependencies: {},
			repository: {url: 'https://example.test/oblique'},
		};

		expect(reader.getApi('PublicFixtureComponent')).toBeDefined();
		expect(
			new ObliqueCodeAnalyzer(reader).analyze("import {PublicFixtureComponent} from '@oblique/oblique';").valid
		).toBe(true);
		expect(new ObliqueTemplateAnalyzer(reader).analyze('<ob-public-fixture></ob-public-fixture>').valid).toBe(true);
		expect(new ObliqueTemplateAnalyzer(reader).analyze('<ob-public-fixture></ob-public-fixture>').valid).toBe(true);
		expect(getObliqueTemplateApi(reader, {symbol: 'PublicFixtureComponent'}, packageMetadata)).toMatchObject({
			matches: [expect.objectContaining({symbol: 'PublicFixtureComponent'})],
		});
		expect(getObliqueTemplateApi(reader, {selector: 'ob-public-fixture'}, packageMetadata)).toMatchObject({
			matches: [expect.objectContaining({symbol: 'PublicFixtureComponent'})],
		});
		expect(programFactory).toHaveBeenCalledTimes(1);
	});

	it('reports an unreadable public API entry point', () => {
		const program = typescript.createProgram([], {});
		const reader = new ObliquePublicApiReader(fixtureRepositoryRoot, () => program);

		expect(() => reader.getApi('PublicEnum')).toThrow(
			`Unable to read the Oblique public API entry point at "${fixturePublicApiPath}".`
		);
	});

	it('reports an entry point whose module symbol cannot be resolved', () => {
		const program = typescript.createProgram([fixturePublicApiPath], {
			module: typescript.ModuleKind.ESNext,
			moduleResolution: typescript.ModuleResolutionKind.Bundler,
		});
		jest.spyOn(program.getTypeChecker(), 'getSymbolAtLocation').mockReturnValue(undefined);
		const reader = new ObliquePublicApiReader(fixtureRepositoryRoot, () => program);

		expect(() => reader.getApi('PublicEnum')).toThrow(
			`Unable to resolve exports from the Oblique public API entry point at "${fixturePublicApiPath}".`
		);
	});

	it('ignores compiler export symbols without a declaration', () => {
		const program = typescript.createProgram([fixturePublicApiPath], {
			module: typescript.ModuleKind.ESNext,
			moduleResolution: typescript.ModuleResolutionKind.Bundler,
		});
		const typeChecker = program.getTypeChecker();
		jest
			.spyOn(typeChecker, 'getExportsOfModule')
			.mockReturnValue([
				{flags: typescript.SymbolFlags.None, getName: () => 'MissingDeclaration'} as unknown as typescript.Symbol,
			]);
		const reader = new ObliquePublicApiReader(fixtureRepositoryRoot, () => program);

		expect(reader.getApi('MissingDeclaration')).toBeUndefined();
	});

	it('falls back to a basic function signature when TypeScript cannot provide one', () => {
		const program = typescript.createProgram([fixturePublicApiPath], {
			module: typescript.ModuleKind.ESNext,
			moduleResolution: typescript.ModuleResolutionKind.Bundler,
		});
		jest.spyOn(program.getTypeChecker(), 'getSignatureFromDeclaration').mockReturnValue(undefined);
		const reader = new ObliquePublicApiReader(fixtureRepositoryRoot, () => program);

		expect(reader.getApi('publicFunction')).toMatchObject({signature: 'function publicFunction'});
	});

	it('indexes real Oblique public APIs from the repository entry point', () => {
		const reader = new ObliquePublicApiReader(repositoryRoot);

		expect(reader.getApi('ObButtonDirective')).toMatchObject({
			kind: 'directive',
			declaredIn: 'projects/oblique/src/lib/button/button.directive.ts',
			signature: 'class ObButtonDirective implements OnInit, OnChanges',
		});
		expect(reader.getApi('ObNotificationService')).toMatchObject({
			kind: 'service',
			declaredIn: 'projects/oblique/src/lib/notification/notification.service.ts',
			signature: 'class ObNotificationService',
			documentation: 'Service for the `NotificationComponent`. Can be configured using `NotificationConfig`.',
		});
		expect(reader.getApi('ObNotificationModule')).toMatchObject({
			kind: 'module',
			declaredIn: 'projects/oblique/src/lib/notification/notification.module.ts',
		});
		expect(reader.getApi('ObMasterLayoutComponent')).toMatchObject({
			kind: 'component',
			declaredIn: 'projects/oblique/src/lib/master-layout/master-layout/master-layout.component.ts',
		});
		expect(reader.getApi('ObTranslateParamsPipe')).toMatchObject({kind: 'pipe'});
		expect(reader.getApi('ObUnsavedChangesGuard')).toMatchObject({
			kind: 'guard',
			declaredIn: 'projects/oblique/src/lib/unsaved-changes/unsaved-changes.guard.ts',
		});
		expect(reader.getApi('provideObliqueConfiguration')).toMatchObject({
			kind: 'function',
			declaredIn: 'projects/oblique/src/lib/utilities.ts',
			signature: 'function provideObliqueConfiguration(config: ObIObliqueConfiguration): EnvironmentProviders',
		});
		expect(reader.getApi('WINDOW')).toMatchObject({
			kind: 'const',
			declaredIn: 'projects/oblique/src/lib/utilities.ts',
			signature: 'const WINDOW: InjectionToken<Window>',
		});
		expect(reader.getApi('appVersion')).toMatchObject({
			kind: 'const',
			declaredIn: 'projects/oblique/src/lib/version.ts',
		});
		expect(reader.getApi('ObINotification')).toMatchObject({
			kind: 'interface',
			declaredIn: 'projects/oblique/src/lib/notification/notification.model.ts',
		});
		expect(reader.getApi('ObENotificationType')).toMatchObject({
			kind: 'enum',
			declaredIn: 'projects/oblique/src/lib/notification/notification.model.ts',
		});
	});

	it('extracts real public Oblique template selectors without exposing internal decorated classes', () => {
		const reader = new ObliquePublicApiReader(repositoryRoot);
		const selectors = reader.getAngularTemplateApis();

		expect(selectors).toEqual(
			expect.arrayContaining([
				expect.objectContaining({symbol: 'ObAlertComponent', kind: 'component', selector: 'ob-alert'}),
				expect.objectContaining({symbol: 'ObButtonDirective', kind: 'directive', selector: '[obButton]'}),
			])
		);
		expect(selectors).not.toEqual(expect.arrayContaining([expect.objectContaining({symbol: 'ObProgressComponent'})]));
		expect(reader.getApi('ObProgressComponent')).toBeUndefined();
	});

	it('rejects a real internal Oblique class that is not exported from public_api.ts', () => {
		expect(new ObliquePublicApiReader(repositoryRoot).getApi('MasterLayoutComponentBase')).toBeUndefined();
	});

	it('extracts public bindings from accessor members (getters and setters)', () => {
		const api = createFixtureReader()
			.getAngularTemplateApis()
			.find(candidate => candidate.symbol === 'AccessorFixtureComponent');

		expect(api).toMatchObject({
			selector: 'ob-accessor-fixture',
		});
		expect(api?.inputs).toEqual(expect.arrayContaining([expect.objectContaining({name: 'value'})]));
		expect(api?.outputs).toEqual(expect.arrayContaining([expect.objectContaining({name: 'valueChanged'})]));
	});

	it('prefers non-deprecated bindings when they override deprecated inherited bindings', () => {
		const api = createFixtureReader()
			.getAngularTemplateApis()
			.find(candidate => candidate.symbol === 'OverrideDeprecatedFixtureComponent');

		expect(api?.inputs).toEqual(expect.arrayContaining([expect.objectContaining({name: 'deprecatedValue'})]));
	});

	it('handles signal inputs with edge-case alias configurations conservatively', () => {
		const api = createFixtureReader()
			.getAngularTemplateApis()
			.find(candidate => candidate.symbol === 'SignalEdgeCasesComponent');

		expect(api?.inputs).toEqual([]);
	});

	it('extracts bindings from components that inherit from exported base components', () => {
		const api = createFixtureReader()
			.getAngularTemplateApis()
			.find(candidate => candidate.symbol === 'InheritedFromExportedComponent');

		expect(api?.inputs).toEqual(
			expect.arrayContaining([
				expect.objectContaining({name: 'baseInput'}),
				expect.objectContaining({name: 'childInput'}),
			])
		);
		expect(api?.outputs).toEqual(expect.arrayContaining([expect.objectContaining({name: 'baseOutput'})]));
	});

	it('handles hostDirectives with non-string array elements conservatively', () => {
		const api = createFixtureReader()
			.getAngularTemplateApis()
			.find(candidate => candidate.symbol === 'InheritedFromExportedComponent');

		expect(api?.inputs).not.toEqual(expect.arrayContaining([expect.objectContaining({name: 'hostEdgeInput'})]));
	});

	it('indexes the exported base component', () => {
		const api = createFixtureReader().getApi('ExportedBaseComponent');
		expect(api).toMatchObject({
			kind: 'component',
		});
	});
});
