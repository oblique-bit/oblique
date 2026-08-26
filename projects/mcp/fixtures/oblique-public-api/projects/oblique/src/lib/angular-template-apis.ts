/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 8 public Angular template API reader test fixture
 */

import {
	Component as AngularComponent,
	Directive as AngularDirective,
	Inject as AngularInject,
	Input as AngularInput,
	Output as AngularOutput,
	input as angularInput,
	model as angularModel,
	output as angularOutput,
} from '@angular/core';

@AngularComponent({selector: 'ob-public-fixture'})
export class PublicFixtureComponent {}

@AngularDirective({selector: '[obPublicFixture]'})
export class PublicFixtureDirective {}

@AngularComponent({selector: getDynamicSelector()})
export class DynamicFixtureComponent {}

const computedMetadata = {selector: 'ob-computed-metadata-fixture'};

@AngularComponent(computedMetadata)
export class ComputedMetadataFixtureComponent {}

@AngularComponent()
export class MissingMetadataFixtureComponent {}

@AngularComponent
export class NonCallDecoratorFixtureComponent {}

@AngularComponent({selector: ''})
export class EmptySelectorFixtureComponent {}

@AngularComponent({selector: 'ob-string-key-fixture'})
export class StringKeySelectorFixtureComponent {}

@AngularComponent({123: 'ob-numeric-key-fixture'})
export class NumericKeySelectorFixtureComponent {}

@AngularInject('fixture')
export class AngularNonTemplateDecoratorFixture {}

@AngularComponent({selector: 'ob-internal-fixture'})
export class InternalFixtureComponent {}

@AngularDirective({selector: '[obInternalFixture]'})
export class InternalFixtureDirective {}

function Component(_metadata: unknown): ClassDecorator {
	return () => undefined;
}

function Directive(_metadata: unknown): ClassDecorator {
	return () => undefined;
}

function Injectable(_metadata?: unknown): ClassDecorator {
	return () => undefined;
}

function NgModule(_metadata: unknown): ClassDecorator {
	return () => undefined;
}

function Pipe(_metadata: unknown): ClassDecorator {
	return () => undefined;
}

@Component({selector: 'ob-fake'})
export class LocalComponentDecoratorFixture {}

@Directive({selector: '[obFake]'})
export class LocalDirectiveDecoratorFixture {}

@Injectable()
export class LocalInjectableDecoratorFixture {}

@NgModule({})
export class LocalNgModuleDecoratorFixture {}

@Pipe({name: 'obFake'})
export class LocalPipeDecoratorFixture {}

@AngularDirective()
class InternalHostDirectiveFixture {
	@AngularInput() hiddenInput = '';
	@AngularInput() exposedInput = '';
	@AngularOutput() hiddenOutput = angularOutput();
	@AngularOutput() exposedOutput = angularOutput();
}

@AngularDirective()
class BindingBaseFixture {
	@AngularInput() baseInput = '';
	@AngularOutput() baseOutput = angularOutput();
	baseSignal = angularInput('');
}

@AngularComponent({
	selector: 'ob-binding-fixture',
	hostDirectives: [
		InternalHostDirectiveFixture,
		{
			directive: InternalHostDirectiveFixture,
			inputs: ['exposedInput: hostInput'],
			outputs: ['exposedOutput: hostOutput'],
		},
	],
})
export class BindingFixtureComponent extends BindingBaseFixture {
	@AngularInput('aliasInput') aliasedInput = '';
	@AngularInput({required: true}) requiredInput = '';
	@AngularInput({transform: Boolean}) transformedInput = false;
	@AngularOutput('aliasOutput') aliasedOutput = angularOutput();
	@AngularOutput() output = angularOutput();
	date = angularInput.required<string>();
	format = angularInput('short', {alias: 'publicFormat'});
	closed = angularOutput({alias: 'publicClosed'});
	/** @deprecated Use currentInput. */
	@AngularInput() oldInput = '';
	/** @deprecated Use currentOutput. */
	@AngularOutput() oldOutput = angularOutput();
	@AngularInput('baseInput') override baseInput = '';
}

@AngularComponent({
	selector: 'ob-binding-coverage-fixture',
	hostDirectives: [
		{},
		{inputs: []},
		{directive: getUnknownHostDirective()},
		{directive: InternalHostDirectiveFixture},
		{
			directive: InternalHostDirectiveFixture,
			inputs: getNonStaticHostInputs(),
			outputs: ['missingOutput'],
		},
		{directive: InternalHostDirectiveFixture, inputs: ['missingInput', 'exposedInput:'], outputs: ['exposedOutput']},
	],
})
export class BindingCoverageFixtureComponent {
	@AngularInput configuredPlain = '';
	@AngularInput({alias: 'configuredAlias', required: true}) configuredInput = '';
	@AngularInput({required: false}) explicitlyOptionalInput = '';
	@AngularInput(getDynamicAlias()) dynamicInput = '';
	@AngularInput dynamicDecoratorInput = '';
	@AngularOutput() readonly plainOutput = angularOutput();
	@AngularOutput('outputAlias') readonly internalOutput = angularOutput();
	plainSignal = angularInput<string>();
	requiredSignal = angularInput.required<string>();
	dynamicSignal = angularInput('', getDynamicOptions());
	signalOutput = angularOutput();
	dynamicSignalOutput = angularOutput(getDynamicOptions());
	value = angularModel<string>();
	requiredValue = angularModel.required<string>();
	aliasedValue = angularModel('', {alias: 'publicValue'});
}

function Input(): PropertyDecorator {
	return () => undefined;
}

function Output(): PropertyDecorator {
	return () => undefined;
}

function input(): unknown {
	return undefined;
}

function output(): unknown {
	return undefined;
}

function getDynamicAlias(): unknown {
	return undefined;
}

function getDynamicOptions(): unknown {
	return undefined;
}

function getUnknownHostDirective(): unknown {
	return undefined;
}

function getNonStaticHostInputs(): string[] {
	return ['not-an-array'];
}

/* eslint-disable @angular-eslint/prefer-signals, @angular-eslint/prefer-output-emitter-ref */
@AngularComponent({selector: 'ob-local-bindings'})
export class LocalBindingFixtureComponent {
	@Input() fakeInput = '';
	@Output() readonly fakeOutput = undefined;
	readonly fakeSignalInput = input();
	readonly fakeSignalOutput = output();
}
/* eslint-enable @angular-eslint/prefer-signals, @angular-eslint/prefer-output-emitter-ref */

@AngularComponent({selector: 'ob-accessor-fixture'})
export class AccessorFixtureComponent {
	@AngularOutput() readonly valueChanged = angularOutput<string>();
	private valueInternal = '';

	@AngularInput()
	get value(): string {
		return this.valueInternal;
	}

	set value(val: string) {
		this.valueInternal = val;
	}
}

@AngularDirective()
class DeprecatedInheritedDirective {
	/** @deprecated Use value. */
	@AngularInput() deprecatedValue = '';
}

@AngularComponent({selector: 'ob-override-deprecated-fixture'})
export class OverrideDeprecatedFixtureComponent extends DeprecatedInheritedDirective {
	@AngularInput() deprecatedValue = '';
}

@AngularComponent({selector: 'ob-signal-edge-cases'})
export class SignalEdgeCasesComponent {
	dynamicOptionSignal = angularInput('default', {
		alias: getAlias(),
	});
}

@AngularComponent({selector: 'ob-exported-base'})
export class ExportedBaseComponent {
	@AngularInput() baseInput = '';
	@AngularOutput() baseOutput = angularOutput();
}

@AngularComponent({
	selector: 'ob-inherited-from-exported',
	hostDirectives: [
		{
			directive: InternalHostDirectiveFixture,
			inputs: getHostEdgeInputs(),
			outputs: ['exposedOutput'],
		},
	],
})
export class InheritedFromExportedComponent extends ExportedBaseComponent {
	@AngularInput() childInput = '';
}

function getDynamicSelector(): string {
	return 'ob-dynamic-fixture';
}

function getAlias(): unknown {
	return undefined;
}

function getHostEdgeInputs(): string[] {
	return ['exposedInput: hostEdgeInput', 'not-a-real-binding'];
}
