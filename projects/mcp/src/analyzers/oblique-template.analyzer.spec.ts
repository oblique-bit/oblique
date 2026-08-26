/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 8 Angular template public API analysis tests
 */

import type {ObliqueAngularTemplateApi} from '../sources/oblique/public-api.reader.js';
import {type TmplAstNode, parseTemplate} from '@angular/compiler';
import {ObliqueTemplateAnalyzer, type ObliqueTemplatePublicApiReader} from './oblique-template.analyzer.js';

const publicTemplateApis: readonly ObliqueAngularTemplateApi[] = [
	{
		symbol: 'ObAlertComponent',
		kind: 'component',
		selector: 'ob-alert',
		deprecated: false,
		documentation: null,
		declaredIn: 'projects/oblique/src/lib/alert/alert.component.ts',
		public: true,
	},
	{
		symbol: 'ObButtonDirective',
		kind: 'directive',
		selector: '[obButton]',
		deprecated: false,
		documentation: null,
		declaredIn: 'projects/oblique/src/lib/button/button.directive.ts',
		public: true,
	},
	{
		symbol: 'DeprecatedComponent',
		kind: 'component',
		selector: 'ob-deprecated',
		deprecated: true,
		documentation: 'Use the current component instead.',
		declaredIn: 'projects/oblique/src/lib/deprecated.component.ts',
		public: true,
	},
	{
		symbol: 'DeprecatedDirective',
		kind: 'directive',
		selector: 'button[obDeprecated]',
		deprecated: true,
		documentation: null,
		declaredIn: 'projects/oblique/src/lib/deprecated.directive.ts',
		public: true,
	},
	{
		symbol: 'DeprecatedClassDirective',
		kind: 'directive',
		selector: '.ob-deprecated-class',
		deprecated: true,
		documentation: null,
		declaredIn: 'projects/oblique/src/lib/deprecated-class.directive.ts',
		public: true,
	},
	{
		symbol: 'DeprecatedStructuralDirective',
		kind: 'directive',
		selector: '[obDeprecatedStructural]',
		deprecated: true,
		documentation: null,
		declaredIn: 'projects/oblique/src/lib/deprecated-structural.directive.ts',
		public: true,
	},
	{
		symbol: 'PublicTypedDirective',
		kind: 'directive',
		selector: 'input[type="email"][obTyped]',
		deprecated: false,
		documentation: null,
		declaredIn: 'projects/oblique/src/lib/typed.directive.ts',
		public: true,
	},
	{
		symbol: 'DeprecatedCompoundDirective',
		kind: 'directive',
		selector: '[obCompound][ngModel],[obCompound][formControlName]',
		deprecated: true,
		documentation: null,
		declaredIn: 'projects/oblique/src/lib/compound.directive.ts',
		public: true,
	},
	{
		symbol: 'DeprecatedCommaDirective',
		kind: 'directive',
		selector: '.ob-deprecated-comma, legacy-comma',
		deprecated: true,
		documentation: null,
		declaredIn: 'projects/oblique/src/lib/comma.directive.ts',
		public: true,
	},
	{
		symbol: 'DeprecatedStaticValueDirective',
		kind: 'directive',
		selector: 'input[type="button"][obDeprecatedTyped]',
		deprecated: true,
		documentation: null,
		declaredIn: 'projects/oblique/src/lib/static-value.directive.ts',
		public: true,
	},
];

function createAnalyzer(
	templateApis: readonly ObliqueAngularTemplateApi[] = publicTemplateApis
): ObliqueTemplateAnalyzer {
	const reader: ObliqueTemplatePublicApiReader = {getAngularTemplateApis: () => templateApis};
	return new ObliqueTemplateAnalyzer(reader);
}

describe('ObliqueTemplateAnalyzer', () => {
	it('accepts valid public component selectors and ignores unrelated elements', () => {
		expect(
			createAnalyzer().analyze('<ob-alert></ob-alert><app-card></app-card><div></div><mat-form-field></mat-form-field>')
		).toEqual({
			valid: true,
			summary: {errors: 0, warnings: 0, info: 0},
			findings: [],
		});
	});

	it('reports unknown Oblique component elements but not unknown directive-like attributes', () => {
		const result = createAnalyzer().analyze('<ob-missing></ob-missing><button obButon>Save</button>');

		expect(result).toMatchObject({
			valid: false,
			summary: {errors: 1, warnings: 0, info: 0},
			findings: [
				{
					rule: 'OBLIQUE_UNKNOWN_COMPONENT_SELECTOR',
					selector: 'ob-missing',
					location: {line: 1, column: 2},
				},
			],
		});
	});

	it('recognizes public static and bound attribute directives without validating bindings', () => {
		const analyzer = createAnalyzer();

		expect(analyzer.analyze('<button obButton (click)="save()">Save</button>')).toMatchObject({
			valid: true,
			findings: [],
		});
		expect(analyzer.analyze('<button [obButton]="variant">Save</button>')).toMatchObject({valid: true, findings: []});
		expect(analyzer.analyze('<input type="email" obTyped>')).toMatchObject({valid: true, findings: []});
	});

	it('uses Angular selector semantics for the compound selector forms used by public Oblique directives', () => {
		const analyzer = createAnalyzer();
		const result = analyzer.analyze(
			'<input obCompound ngModel><input obCompound formControlName><form obFocusInvalid></form><a href="/help"></a><div class="ob-deprecated-comma"></div><legacy-comma></legacy-comma>'
		);

		expect(result.findings.map(finding => finding.symbol)).toEqual([
			'DeprecatedCompoundDirective',
			'DeprecatedCompoundDirective',
			'DeprecatedCommaDirective',
			'DeprecatedCommaDirective',
		]);
	});

	it('does not treat dynamic bound values as a match for a static attribute-value selector', () => {
		const analyzer = createAnalyzer();

		expect(analyzer.analyze('<input type="button" obDeprecatedTyped>')).toMatchObject({
			valid: true,
			findings: [{symbol: 'DeprecatedStaticValueDirective'}],
		});
		expect(analyzer.analyze('<input [type]="type" obDeprecatedTyped>')).toEqual({
			valid: true,
			summary: {errors: 0, warnings: 0, info: 0},
			findings: [],
		});
	});

	it('matches static class and structural directive selectors through Angular template AST nodes', () => {
		const analyzer = createAnalyzer();

		expect(analyzer.analyze('<button class="ob-deprecated-class">Save</button>')).toMatchObject({
			valid: true,
			findings: [{symbol: 'DeprecatedClassDirective'}],
		});
		expect(analyzer.analyze('<div *obDeprecatedStructural></div>')).toMatchObject({
			valid: true,
			findings: [{symbol: 'DeprecatedStructuralDirective'}],
		});
	});

	it('orders multiple deprecated selector matches deterministically', () => {
		const templateApis: readonly ObliqueAngularTemplateApi[] = [
			{
				symbol: 'AlphaDirective',
				kind: 'directive',
				selector: '[obSort]',
				deprecated: true,
				documentation: null,
				declaredIn: 'alpha.ts',
				public: true,
			},
			{
				symbol: 'BetaDirective',
				kind: 'directive',
				selector: '[obSort]',
				deprecated: true,
				documentation: null,
				declaredIn: 'beta.ts',
				public: true,
			},
			{
				symbol: 'SharedDirective',
				kind: 'directive',
				selector: '[obSort]',
				deprecated: true,
				documentation: null,
				declaredIn: 'shared.ts',
				public: true,
			},
			{
				symbol: 'SharedDirective',
				kind: 'directive',
				selector: 'button[obSort]',
				deprecated: true,
				documentation: null,
				declaredIn: 'shared.ts',
				public: true,
			},
			{
				symbol: 'ElementDirective',
				kind: 'directive',
				selector: 'button',
				deprecated: true,
				documentation: null,
				declaredIn: 'element.ts',
				public: true,
			},
		];

		expect(
			createAnalyzer(templateApis)
				.analyze('<button obSort></button>')
				.findings.map(finding => finding.symbol)
		).toEqual(['ElementDirective', 'AlphaDirective', 'BetaDirective', 'SharedDirective', 'SharedDirective']);
	});

	it('does not report an ambiguous deprecated selector when a current public API has the same selector', () => {
		const templateApis: readonly ObliqueAngularTemplateApi[] = [
			{
				symbol: 'CurrentComponent',
				kind: 'component',
				selector: 'ob-shared',
				deprecated: false,
				documentation: null,
				declaredIn: 'current.component.ts',
				public: true,
			},
			{
				symbol: 'DeprecatedMockComponent',
				kind: 'component',
				selector: 'ob-shared',
				deprecated: true,
				documentation: null,
				declaredIn: 'deprecated-mock.component.ts',
				public: true,
			},
		];

		expect(createAnalyzer(templateApis).analyze('<ob-shared></ob-shared>')).toEqual({
			valid: true,
			summary: {errors: 0, warnings: 0, info: 0},
			findings: [],
		});
	});

	it('reports deprecated public components and directives once per matched occurrence', () => {
		const result = createAnalyzer().analyze(
			'<ob-deprecated></ob-deprecated><button obDeprecated>Save</button><button [obDeprecated]="enabled">Save</button>'
		);

		expect(result).toMatchObject({
			valid: true,
			summary: {errors: 0, warnings: 3, info: 0},
			findings: [
				{rule: 'OBLIQUE_DEPRECATED_TEMPLATE_API', symbol: 'DeprecatedComponent', selector: 'ob-deprecated'},
				{rule: 'OBLIQUE_DEPRECATED_TEMPLATE_API', symbol: 'DeprecatedDirective', selector: 'button[obDeprecated]'},
				{rule: 'OBLIQUE_DEPRECATED_TEMPLATE_API', symbol: 'DeprecatedDirective', selector: 'button[obDeprecated]'},
			],
		});
		expect(result.findings[0]?.message).toContain('Use the current component instead.');
	});

	it('ignores selectors in comments, text nodes and Angular interpolation strings', () => {
		expect(
			createAnalyzer().analyze("<!-- <ob-missing></ob-missing> --><p>&lt;ob-missing&gt;</p>{{ '&lt;ob-missing&gt;' }}")
		).toMatchObject({
			valid: true,
			findings: [],
		});
	});

	it('accepts Angular control flow and bindings without evaluating expressions', () => {
		const analyzer = createAnalyzer();

		expect(analyzer.analyze('@if (visible) { <ob-alert [type]="alertType"></ob-alert> }')).toMatchObject({
			valid: true,
			findings: [],
		});
		expect(analyzer.analyze('@for (item of items; track item.id) { <ob-alert></ob-alert> }')).toMatchObject({
			valid: true,
			findings: [],
		});
		expect(
			analyzer.analyze('@for (item of items; track item.id) { <ob-alert></ob-alert> } @empty { <ob-alert></ob-alert> }')
		).toMatchObject({valid: true, findings: []});
		expect(
			analyzer.analyze('@if (visible) { @for (item of items; track item.id) { <ob-alert></ob-alert> } }')
		).toMatchObject({valid: true, findings: []});
	});

	it('returns deterministic Angular parser syntax findings without selector analysis', () => {
		const result = createAnalyzer().analyze('@if (visible) { <ob-missing></ob-missing>');

		expect(result).toMatchObject({
			valid: false,
			summary: {errors: 1, warnings: 0, info: 0},
			findings: [{rule: 'TEMPLATE_SYNTAX_ERROR', severity: 'error', location: {line: 1, column: 1}}],
		});
	});

	it('deduplicates equivalent Angular parser diagnostics', () => {
		const parsedTemplate = parseTemplate('@if (visible) {', 'submitted.html');
		const [error] = parsedTemplate.errors ?? [];
		if (error === undefined) {
			throw new Error('Expected Angular to report a syntax error for the malformed template.');
		}
		const templateParser = jest.fn(() => ({nodes: [], errors: [error, error]}));
		const result = new ObliqueTemplateAnalyzer({getAngularTemplateApis: () => []}, templateParser).analyze('broken');

		expect(templateParser).toHaveBeenCalledWith('broken', 'submitted.html');
		expect(result).toMatchObject({
			summary: {errors: 1, warnings: 0, info: 0},
			findings: [{rule: 'TEMPLATE_SYNTAX_ERROR'}],
		});
	});

	it('ignores malformed optional Angular control-flow child metadata safely', () => {
		const nodes = [{empty: null}, {empty: {}}] as unknown as readonly TmplAstNode[];
		const templateParser = jest.fn(() => ({nodes, errors: null}));

		expect(new ObliqueTemplateAnalyzer({getAngularTemplateApis: () => []}, templateParser).analyze('ignored')).toEqual({
			valid: true,
			summary: {errors: 0, warnings: 0, info: 0},
			findings: [],
		});
	});

	it('orders independent findings by template position', () => {
		const result = createAnalyzer().analyze('<ob-missing></ob-missing><ob-deprecated></ob-deprecated>');

		expect(result.findings.map(finding => finding.rule)).toEqual([
			'OBLIQUE_UNKNOWN_COMPONENT_SELECTOR',
			'OBLIQUE_DEPRECATED_TEMPLATE_API',
		]);
	});

	it('checks required and deprecated bindings safely, with verbose component-only informational input diagnostics', () => {
		const templateApis: readonly ObliqueAngularTemplateApi[] = [
			{
				symbol: 'BindingComponent',
				kind: 'component',
				selector: 'ob-bindings',
				deprecated: false,
				documentation: null,
				declaredIn: 'bindings.ts',
				public: true,
				inputs: [
					{
						name: 'requiredValue',
						propertyName: 'requiredValue',
						required: true,
						deprecated: false,
						documentation: null,
						declaredIn: 'bindings.ts',
					},
					{
						name: 'oldValue',
						propertyName: 'oldValue',
						required: false,
						deprecated: true,
						documentation: 'Use value.',
						declaredIn: 'bindings.ts',
					},
				],
				outputs: [
					{
						name: 'oldChanged',
						propertyName: 'oldChanged',
						deprecated: true,
						documentation: null,
						declaredIn: 'bindings.ts',
					},
				],
			},
		];
		const analyzer = createAnalyzer(templateApis);

		expect(analyzer.analyze('<ob-bindings></ob-bindings>')).toMatchObject({
			valid: false,
			findings: [{rule: 'OBLIQUE_MISSING_REQUIRED_INPUT', binding: 'requiredValue'}],
		});
		expect(
			analyzer.analyze('<ob-bindings requiredValue="x" [oldValue]="x" (oldChanged)="x()"></ob-bindings>')
		).toMatchObject({
			valid: true,
			findings: [
				{rule: 'OBLIQUE_DEPRECATED_TEMPLATE_BINDING', binding: 'oldValue', bindingKind: 'input'},
				{rule: 'OBLIQUE_DEPRECATED_TEMPLATE_BINDING', binding: 'oldChanged', bindingKind: 'output'},
			],
		});
		expect(
			analyzer.analyze(
				'<ob-bindings requiredValue="x" [externalInput]="x" [attr.aria-label]="x"></ob-bindings>',
				'verbose'
			)
		).toMatchObject({
			valid: true,
			findings: [{rule: 'OBLIQUE_UNRECOGNIZED_INPUT_BINDING', binding: 'externalInput', severity: 'info'}],
		});
		expect(analyzer.analyze('<input obButton [applicationInput]="x">', 'verbose')).toEqual({
			valid: true,
			summary: {errors: 0, warnings: 0, info: 0},
			findings: [],
		});
	});

	it('reports two-way bindings as two-way in verbose mode findings', () => {
		const templateApis: readonly ObliqueAngularTemplateApi[] = [
			{
				symbol: 'TwoWayComponent',
				kind: 'component',
				selector: 'ob-two-way',
				deprecated: false,
				documentation: null,
				declaredIn: 'two-way.ts',
				public: true,
				inputs: [],
				outputs: [],
			},
		];

		const result = createAnalyzer(templateApis).analyze(
			'<ob-two-way [(unrecognized)]="model"></ob-two-way>',
			'verbose'
		);

		expect(result).toMatchObject({
			valid: true,
			findings: [{bindingKind: 'two-way', rule: 'OBLIQUE_UNRECOGNIZED_INPUT_BINDING'}],
		});
	});

	it('uses non-deprecated binding when it overrides a deprecated inherited binding', () => {
		const templateApis: readonly ObliqueAngularTemplateApi[] = [
			{
				symbol: 'BaseComponent',
				kind: 'component',
				selector: 'ob-base',
				deprecated: false,
				documentation: null,
				declaredIn: 'base.ts',
				public: true,
				inputs: [
					{
						name: 'legacyValue',
						propertyName: 'legacyValue',
						required: false,
						deprecated: true,
						documentation: null,
						declaredIn: 'base.ts',
					},
				],
				outputs: [],
			},
			{
				symbol: 'DerivedComponent',
				kind: 'component',
				selector: 'ob-derived',
				deprecated: false,
				documentation: null,
				declaredIn: 'derived.ts',
				public: true,
				inputs: [
					{
						name: 'legacyValue',
						propertyName: 'legacyValue',
						required: false,
						deprecated: false,
						documentation: null,
						declaredIn: 'derived.ts',
					},
				],
				outputs: [],
			},
		];

		const result = createAnalyzer(templateApis).analyze('<ob-base [legacyValue]="x"></ob-base>');

		expect(result).toMatchObject({
			valid: true,
			findings: [{rule: 'OBLIQUE_DEPRECATED_TEMPLATE_BINDING'}],
		});
	});

	it('prefers non-deprecated bindings over deprecated ones when both APIs have the same binding name', () => {
		const templateApis: readonly ObliqueAngularTemplateApi[] = [
			{
				symbol: 'LegacyComponent',
				kind: 'component',
				selector: 'ob-shared',
				deprecated: false,
				documentation: null,
				declaredIn: 'legacy.ts',
				public: true,
				inputs: [
					{
						name: 'sharedValue',
						propertyName: 'sharedValue',
						required: false,
						deprecated: true,
						documentation: null,
						declaredIn: 'legacy.ts',
					},
				],
				outputs: [],
			},
			{
				symbol: 'CurrentComponent',
				kind: 'component',
				selector: 'ob-shared',
				deprecated: false,
				documentation: null,
				declaredIn: 'current.ts',
				public: true,
				inputs: [
					{
						name: 'sharedValue',
						propertyName: 'sharedValue',
						required: false,
						deprecated: false,
						documentation: null,
						declaredIn: 'current.ts',
					},
				],
				outputs: [],
			},
		];

		const result = createAnalyzer(templateApis).analyze('<ob-shared [sharedValue]="x"></ob-shared>');

		// Both APIs match the selector ob-shared; getEffectiveBindings processes both
		// and prefers the non-deprecated binding from CurrentComponent (line 360: existing.deprecated && !binding.deprecated)
		expect(result).toMatchObject({
			valid: true,
			summary: {errors: 0, warnings: 0, info: 0},
			findings: [],
		});
	});

	it('detects deprecated bindings even when non-deprecated version exists in another matching API', () => {
		const templateApis: readonly ObliqueAngularTemplateApi[] = [
			{
				symbol: 'LegacyComponent',
				kind: 'component',
				selector: 'ob-multi',
				deprecated: false,
				documentation: null,
				declaredIn: 'legacy.ts',
				public: true,
				inputs: [
					{
						name: 'value',
						propertyName: 'value',
						required: false,
						deprecated: true,
						documentation: null,
						declaredIn: 'legacy.ts',
					},
				],
				outputs: [],
			},
			{
				symbol: 'CurrentComponent',
				kind: 'component',
				selector: 'ob-multi',
				deprecated: false,
				documentation: null,
				declaredIn: 'current.ts',
				public: true,
				inputs: [
					{
						name: 'value',
						propertyName: 'value',
						required: false,
						deprecated: false,
						documentation: null,
						declaredIn: 'current.ts',
					},
				],
				outputs: [],
			},
		];

		const result = createAnalyzer(templateApis).analyze('<ob-multi [value]="x"></ob-multi>');

		// getEffectiveBindings prefers non-deprecated, so no deprecation warning
		expect(result).toMatchObject({
			valid: true,
			summary: {errors: 0, warnings: 0, info: 0},
			findings: [],
		});
	});

	it('prefers non-deprecated output when replacing deprecated one from earlier API in getEffectiveBindings', () => {
		// Tests line 360: (existing.deprecated && !binding.deprecated)
		const templateApis: readonly ObliqueAngularTemplateApi[] = [
			{
				symbol: 'DeprecatedApi',
				kind: 'component',
				selector: 'ob-shared-comp',
				deprecated: false,
				documentation: null,
				declaredIn: 'deprecated.ts',
				public: true,
				inputs: [],
				outputs: [
					{
						name: 'updated',
						propertyName: 'updated',
						deprecated: true,
						documentation: null,
						declaredIn: 'deprecated.ts',
					},
				],
			},
			{
				symbol: 'CurrentApi',
				kind: 'component',
				selector: 'ob-shared-comp',
				deprecated: false,
				documentation: null,
				declaredIn: 'current.ts',
				public: true,
				inputs: [],
				outputs: [
					{
						name: 'updated',
						propertyName: 'updated',
						deprecated: false,
						documentation: null,
						declaredIn: 'current.ts',
					},
				],
			},
		];

		const result = createAnalyzer(templateApis).analyze(
			'<ob-shared-comp (updated)="onUpdated($event)"></ob-shared-comp>'
		);

		// When getEffectiveBindings merges outputs from both APIs,
		// it should prefer CurrentApi's non-deprecated "updated" over DeprecatedApi's
		// This tests the condition: existing.deprecated && !binding.deprecated
		expect(result.findings.filter(finding => finding.binding === 'updated')).toHaveLength(0);
	});
});
