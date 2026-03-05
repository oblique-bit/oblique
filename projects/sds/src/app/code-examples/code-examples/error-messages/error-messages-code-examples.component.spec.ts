import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {ErrorMessagesCodeExamplesComponent} from './error-messages-code-examples.component';
import {By} from '@angular/platform-browser';
import {ErrorMessagesExampleReactiveFormPreviewComponent} from './previews/reactive-form/error-messages-example-reactive-form-preview.component';
import {ErrorMessagesExampleTemplateDrivenFormPreviewComponent} from './previews/template-driven-form/error-messages-example-template-driven-form-preview.component';
import {ErrorMessagesExampleCustomErrorMessagePreviewComponent} from './previews/custom-error-message/error-messages-example-custom-error-message-preview.component';
import {TranslateService} from '@ngx-translate/core';
import {ObMockTranslateService} from '@oblique/oblique';

describe(ErrorMessagesCodeExamplesComponent.name, () => {
	let component: ErrorMessagesCodeExamplesComponent;
	let fixture: ComponentFixture<ErrorMessagesCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ErrorMessagesCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent],
			providers: [{provide: TranslateService, useClass: ObMockTranslateService}],
		}).compileComponents();

		fixture = TestBed.createComponent(ErrorMessagesCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('should create', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 3 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(3);
	});

	test(`that there is 1 ${ErrorMessagesExampleReactiveFormPreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(ErrorMessagesExampleReactiveFormPreviewComponent)).length).toBe(
			1
		);
	});

	test(`that there is 1 ${ErrorMessagesExampleTemplateDrivenFormPreviewComponent.name}`, () => {
		expect(
			fixture.debugElement.queryAll(By.directive(ErrorMessagesExampleTemplateDrivenFormPreviewComponent)).length
		).toBe(1);
	});

	test(`that there is 1 ${ErrorMessagesExampleCustomErrorMessagePreviewComponent.name}`, () => {
		expect(
			fixture.debugElement.queryAll(By.directive(ErrorMessagesExampleCustomErrorMessagePreviewComponent)).length
		).toBe(1);
	});
});
