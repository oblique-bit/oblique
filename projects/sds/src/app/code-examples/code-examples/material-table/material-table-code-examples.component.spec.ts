import {type ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {MaterialTableCodeExamplesComponent} from './material-table-code-examples.component';
import {provideObliqueTestingConfiguration} from '@oblique/oblique';
import {By} from '@angular/platform-browser';
import {MaterialTableExampleDefaultPreviewComponent} from './previews/default/material-table-example-default-preview.component';
import {MaterialTableExampleEditablePreviewComponent} from './previews/editable/material-table-example-editable-preview.component';
import {MaterialTableExampleSelectablePreviewComponent} from './previews/selectable/material-table-example-selectable-preview.component';
import {MaterialTableExampleSizesPreviewComponent} from './previews/sizes/material-table-example-sizes-preview.component';
import {MaterialTableExampleStylesPreviewComponent} from './previews/styles/material-table-example-styles-preview.component';
import {MaterialTableExampleSortablePreviewComponent} from './previews/sortable/material-table-example-sortable-preview.component';

describe(MaterialTableCodeExamplesComponent.name, () => {
	let component: MaterialTableCodeExamplesComponent;
	let fixture: ComponentFixture<MaterialTableCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [MaterialTableCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent],
			providers: [provideObliqueTestingConfiguration()],
		}).compileComponents();

		fixture = TestBed.createComponent(MaterialTableCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('should create', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 6 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(6);
	});

	test(`that there is 1 ${MaterialTableExampleDefaultPreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(MaterialTableExampleDefaultPreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${MaterialTableExampleEditablePreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(MaterialTableExampleEditablePreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${MaterialTableExampleSelectablePreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(MaterialTableExampleSelectablePreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${MaterialTableExampleSizesPreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(MaterialTableExampleSizesPreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${MaterialTableExampleStylesPreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(MaterialTableExampleStylesPreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${MaterialTableExampleSortablePreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(MaterialTableExampleSortablePreviewComponent)).length).toBe(1);
	});
});
