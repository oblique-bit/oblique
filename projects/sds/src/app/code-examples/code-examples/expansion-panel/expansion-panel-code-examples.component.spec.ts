import {ComponentFixture, TestBed} from '@angular/core/testing';
import {CommonModule} from '@angular/common';
import {IdPipe} from '../../../shared/id/id.pipe';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {ExpansionPanelCodeExamplesComponent} from './expansion-panel-code-examples.component';
import {By} from '@angular/platform-browser';
import {ExpansionPanelExampleBasicPreviewComponent} from './previews/basic/expansion-panel-example-basic-preview.component';
import {ExpansionPanelExampleTogglePreviewComponent} from './previews/toggle/expansion-panel-example-toggle-preview.component';
import {ExpansionPanelExampleOtherOptionsPreviewComponent} from './previews/other-options/expansion-panel-example-other-options-preview.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe(ExpansionPanelCodeExamplesComponent.name, () => {
	let component: ExpansionPanelCodeExamplesComponent;
	let fixture: ComponentFixture<ExpansionPanelCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [ExpansionPanelCodeExamplesComponent, CommonModule, IdPipe, CodeExampleComponent, NoopAnimationsModule]
		}).compileComponents();

		fixture = TestBed.createComponent(ExpansionPanelCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 3 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(3);
	});

	test(`that there is 1 ${ExpansionPanelExampleBasicPreviewComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(ExpansionPanelExampleBasicPreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${ExpansionPanelExampleTogglePreviewComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(ExpansionPanelExampleTogglePreviewComponent)).length).toBe(1);
	});

	test(`that there is 1 ${ExpansionPanelExampleOtherOptionsPreviewComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(ExpansionPanelExampleOtherOptionsPreviewComponent)).length).toBe(1);
	});
});
