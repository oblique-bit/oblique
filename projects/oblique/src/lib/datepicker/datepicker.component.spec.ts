import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {CUSTOM_ELEMENTS_SCHEMA, Component, DebugElement, NO_ERRORS_SCHEMA} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {By} from '@angular/platform-browser';
import {NgbDatepickerModule} from '@ng-bootstrap/ng-bootstrap';
import {ObDatepickerComponent} from './datepicker.component';

@Component({
	template: ` <ob-date-picker [formControl]="model"></ob-date-picker>`
})
class TestComponent {
	model = new FormControl();
}

describe('DatepickerComponent', () => {
	let fixture: ComponentFixture<TestComponent>;
	let datepicker: ObDatepickerComponent;
	let button: DebugElement;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [TestComponent, ObDatepickerComponent],
			imports: [ReactiveFormsModule, NgbDatepickerModule],
			schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TestComponent);
		fixture.detectChanges();
		button = fixture.debugElement.query(By.css('button'));
		datepicker = fixture.debugElement.query(By.directive(ObDatepickerComponent)).injector.get(ObDatepickerComponent);
	});

	it('should toggle the NgbDatepicker on button click', () => {
		jest.spyOn(datepicker.ngbDatePicker, 'toggle');

		button.nativeElement.click();

		expect(datepicker.ngbDatePicker.toggle).toHaveBeenCalled();
	});

	it('should disable the button, if disable gets set to true', () => {
		datepicker.setDisabledState(true);

		fixture.detectChanges();

		expect(button.properties.disabled).toBeTruthy();
	});

	it('should disable the input, if disable gets set to true', () => {
		datepicker.setDisabledState(true);

		fixture.detectChanges();

		expect(fixture.debugElement.query(By.css('input')).properties.disabled).toBeTruthy();
	});
});
