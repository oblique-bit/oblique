import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {NestedFormCodeExamplesComponent} from './nested-form-code-examples.component';
import {By} from '@angular/platform-browser';
import {NestedFormExampleReactivePreviewComponent} from './previews/reactive/nested-form-example-reactive-preview.component';
import {NestedFormExampleTemplateDrivenPreviewComponent} from './previews/template-driven/nested-form-example-template-driven-preview.component';
import {ObNestedFormComponent, ObParentFormDirective} from '@oblique/oblique';
import {MatFormField} from '@angular/material/form-field';
import {NestedFormExampleReactivePreviewChildComponent} from './previews/reactive/child/nested-form-example-reactive-preview-child.component';
import {NestedFormExampleReactivePreviewGrandchildComponent} from './previews/reactive/grandchild/nested-form-example-reactive-preview-grandchild.component';
import {NestedFormExampleTemplateDrivenPreviewChildComponent} from './previews/template-driven/child/nested-form-example-template-driven-preview-child.component';
import {NestedFormExampleTemplateDrivenPreviewGrandchildComponent} from './previews/template-driven/grandchild/nested-form-example-template-driven-preview-grandchild.component';
import {TranslateModule} from '@ngx-translate/core';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe(NestedFormCodeExamplesComponent.name, () => {
	let component: NestedFormCodeExamplesComponent;
	let fixture: ComponentFixture<NestedFormCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [
				CodeExampleComponent,
				CommonModule,
				IdPipe,
				NestedFormCodeExamplesComponent,
				NoopAnimationsModule,
				TranslateModule.forRoot()
			]
		}).compileComponents();

		fixture = TestBed.createComponent(NestedFormCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 2 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(2);
	});

	test(`that there is 1 ${NestedFormExampleReactivePreviewComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(NestedFormExampleReactivePreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${NestedFormExampleReactivePreviewChildComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(NestedFormExampleReactivePreviewChildComponent)).length).toBe(1);
	});

	test(`that there is 1 ${NestedFormExampleReactivePreviewGrandchildComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(NestedFormExampleReactivePreviewGrandchildComponent)).length).toBe(1);
	});

	test(`that there is 1 ${NestedFormExampleTemplateDrivenPreviewComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(NestedFormExampleTemplateDrivenPreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${NestedFormExampleTemplateDrivenPreviewChildComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(NestedFormExampleTemplateDrivenPreviewChildComponent)).length).toBe(1);
	});

	test(`that there is 1 ${NestedFormExampleTemplateDrivenPreviewGrandchildComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(NestedFormExampleTemplateDrivenPreviewGrandchildComponent)).length).toBe(1);
	});

	test(`that there are 4 ${ObNestedFormComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(ObNestedFormComponent)).length).toBe(4);
	});

	test(`that there are 2 forms`, () => {
		expect(fixture.debugElement.queryAll(By.css('form')).length).toBe(2);
	});

	test(`that there are 2 ${ObParentFormDirective.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(ObParentFormDirective)).length).toBe(2);
	});

	test(`that there are 10 ${MatFormField.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(MatFormField)).length).toBe(10);
	});
});
