import {WINDOW} from '@oblique/oblique';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {NumberFormatExampleOtherOptionsPreviewComponent} from './previews/other-options/number-format-example-other-options-preview.component';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {By} from '@angular/platform-browser';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {NumberFormatCodeExamplesComponent} from './number-format-code-examples.component';
import {NumberFormatExampleDefaultWithTemplateFromPreviewComponent} from './previews/default-with-template-from/number-format-example-default-with-template-from-preview.component';
import {NumberFormatExampleDefaultWithReactiveFormPreviewComponent} from './previews/default-with-reactive-form/number-format-example-default-with-reactive-form-preview.component';

describe(NumberFormatCodeExamplesComponent.name, () => {
	let component: NumberFormatCodeExamplesComponent;
	let fixture: ComponentFixture<NumberFormatCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [NumberFormatCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent, NoopAnimationsModule],
			providers: [{provide: WINDOW, useValue: window}]
		}).compileComponents();

		fixture = TestBed.createComponent(NumberFormatCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 3 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(3);
	});

	test(`that there is 1 ${NumberFormatExampleDefaultWithReactiveFormPreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(NumberFormatExampleDefaultWithReactiveFormPreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${NumberFormatExampleDefaultWithTemplateFromPreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(NumberFormatExampleDefaultWithTemplateFromPreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${NumberFormatExampleOtherOptionsPreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(NumberFormatExampleOtherOptionsPreviewComponent)).length).toBe(1);
	});
});
