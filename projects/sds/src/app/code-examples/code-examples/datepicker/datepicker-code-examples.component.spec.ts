import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {DatepickerCodeExamplesComponent} from './datepicker-code-examples.component';
import {CodeExampleComponent} from '../../code-example/code-example.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {DatepickerExampleDefaultComponent} from './previews/default/datepicker-example-default.component';
import {MatDatepicker} from '@angular/material/datepicker';
import {DatepickerExampleOtherOptionsPreviewComponent} from './previews/other-options/datepicker-example-other-options-preview.component';

describe(DatepickerCodeExamplesComponent.name, () => {
	let component: DatepickerCodeExamplesComponent;
	let fixture: ComponentFixture<DatepickerCodeExamplesComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [DatepickerCodeExamplesComponent, NoopAnimationsModule]
		}).compileComponents();

		fixture = TestBed.createComponent(DatepickerCodeExamplesComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	test('that creation works', () => {
		expect(component).toBeTruthy();
	});

	test(`that there are 2 ${CodeExampleComponent.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(CodeExampleComponent)).length).toBe(2);
	});

	test(`that there is 1 ${DatepickerExampleDefaultComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(DatepickerExampleDefaultComponent)).length).toBe(1);
	});

	test(`that there is 1 ${DatepickerExampleOtherOptionsPreviewComponent.name}`, () => {
		expect(fixture.debugElement.queryAll(By.directive(DatepickerExampleOtherOptionsPreviewComponent)).length).toBe(1);
	});

	test(`that there are 8 ${MatDatepicker.name}s`, () => {
		expect(fixture.debugElement.queryAll(By.directive(MatDatepicker)).length).toBe(8);
	});
});
