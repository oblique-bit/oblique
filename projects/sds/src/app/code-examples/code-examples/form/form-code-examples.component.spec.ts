import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {FormCodeExamplesComponent} from './form-code-examples.component';
import {By} from '@angular/platform-browser';
import {MatFormField} from '@angular/material/form-field';
import {MatCheckbox} from '@angular/material/checkbox';
import {MatRadioButton, MatRadioGroup} from '@angular/material/radio';
import {MatInput} from '@angular/material/input';
import {MatSelect} from '@angular/material/select';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormExampleSizesPreviewComponent} from './previews/sizes/form-example-sizes-preview.component';
import {FormExampleStatesPreviewComponent} from './previews/states/form-example-states-preview.component';
import {FormExampleHorizontalPreviewComponent} from './previews/horizontal/form-example-horizontal-preview.component';
import {FormExampleInputClearPreviewComponent} from './previews/input-clear/form-example-input-clear-preview.component';
import {FormExampleInputPrefixesAndSuffixesPreviewComponent} from './previews/input-prefixes-and-suffixes/form-example-input-prefixes-and-suffixes-preview.component';

describe(FormCodeExamplesComponent.name, () => {
	let component: FormCodeExamplesComponent;
	let fixture: ComponentFixture<FormCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [CodeExampleComponent, CommonModule, FormCodeExamplesComponent, IdPipe, NoopAnimationsModule]
		}).compileComponents();

		fixture = TestBed.createComponent(FormCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 5 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(5);
	});

	test(`that there is 1 ${FormExampleSizesPreviewComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(FormExampleSizesPreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${FormExampleStatesPreviewComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(FormExampleStatesPreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${FormExampleHorizontalPreviewComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(FormExampleHorizontalPreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${FormExampleInputClearPreviewComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(FormExampleInputClearPreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${FormExampleInputPrefixesAndSuffixesPreviewComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(FormExampleInputClearPreviewComponent)).length).toBe(1);
	});

	test(`that there are 30 ${MatFormField.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(MatFormField)).length).toBe(30);
	});

	test(`that there are 23 ${MatInput.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(MatInput)).length).toBe(23);
	});

	test(`that there are 2 ${MatCheckbox.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(MatCheckbox)).length).toBe(2);
	});

	test(`that there are 2 ${MatRadioGroup.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(MatRadioGroup)).length).toBe(2);
	});

	test(`that there are 2 ${MatRadioButton.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(MatRadioButton)).length).toBe(2);
	});

	test(`that there are 7 ${MatSelect.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(MatSelect)).length).toBe(7);
	});

	test(`that there are 7 textareas`, () => {
		expect(fixture.debugElement.queryAll(By.css('textarea')).length).toBe(7);
	});

	test(`that there are 4 forms`, () => {
		expect(fixture.debugElement.queryAll(By.css('form')).length).toBe(4);
	});
});
