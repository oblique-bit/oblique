/*
 * AI GENERATED CODE
 * Model: GPT-5
 * Prompt: Oblique MCP Phase 8 public Angular template API reader test fixture
 */

import {Component as AngularComponent, Directive as AngularDirective, Inject as AngularInject} from '@angular/core';

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

function getDynamicSelector(): string {
	return 'ob-dynamic-fixture';
}
