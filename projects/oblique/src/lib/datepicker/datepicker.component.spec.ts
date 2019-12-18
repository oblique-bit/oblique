import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import {DatepickerComponent} from 'oblique';

@Component({
	template: `
		<or-date-picker [formControl]="model"></or-date-picker>`
})
class TestComponent {
	model = new FormControl();
}

describe('DatepickerComponent', () => {
	let fixture: ComponentFixture<TestComponent>;
	let component: TestComponent;
	let datepicker: DatepickerComponent;
	let button: DebugElement;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [TestComponent, DatepickerComponent],
			imports: [ReactiveFormsModule, NgbDatepickerModule],
			schemas: [
				CUSTOM_ELEMENTS_SCHEMA,
				NO_ERRORS_SCHEMA
			]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TestComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
		button = fixture.debugElement.query(By.css('button'));
		datepicker = fixture.debugElement.query(By.directive(DatepickerComponent)).injector.get(DatepickerComponent);
	});

	it('should toggle the NgbDatepicker on button click', () => {
		spyOn(datepicker.ngbDatePicker, 'toggle').and.callThrough();

		button.nativeElement.click();

		expect(datepicker.ngbDatePicker.toggle).toHaveBeenCalled();
	});

	it('should disable the button, if disable gets set to true', () => {
		datepicker.setDisabledState(true);

		fixture.detectChanges();

		expect(button.properties['disabled']).toBeTruthy();
	});

	it('should disable the input, if disable gets set to true', () => {
		datepicker.setDisabledState(true);

		fixture.detectChanges();

		expect(fixture.debugElement.query(By.css('input')).properties['disabled']).toBeTruthy();
	});
});
