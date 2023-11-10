import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {SchemaValidationCodeExamplesComponent} from './schema-validation-code-examples.component';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {By} from '@angular/platform-browser';
import {SchemaValidationExampleReactiveFormPreviewComponent} from './previews/reactive-form/schema-validation-example-reactive-form-preview.component';
import {SchemaValidationExampleTemplateDrivenFormPreviewComponent} from './previews/template-driven-form/schema-validation-example-template-driven-form-preview.component';
import {ObMockTranslateService} from '@oblique/oblique';
import {TranslateService} from '@ngx-translate/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe(SchemaValidationCodeExamplesComponent.name, () => {
	let component: SchemaValidationCodeExamplesComponent;
	let fixture: ComponentFixture<SchemaValidationCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				NoopAnimationsModule,
				SchemaValidationCodeExamplesComponent,
				CommonModule,
				IdPipe,
				CodeExampleComponent,
				SchemaValidationExampleReactiveFormPreviewComponent,
				SchemaValidationExampleTemplateDrivenFormPreviewComponent
			],
			providers: [{provide: TranslateService, useClass: ObMockTranslateService}]
		}).compileComponents();

		fixture = TestBed.createComponent(SchemaValidationCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 2 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(2);
	});

	test(`that there is 1 ${SchemaValidationExampleReactiveFormPreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(SchemaValidationExampleReactiveFormPreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${SchemaValidationExampleTemplateDrivenFormPreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(SchemaValidationExampleTemplateDrivenFormPreviewComponent)).length).toBe(1);
	});
});
