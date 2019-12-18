import {Component, Input} from '@angular/core';
import {NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {AbstractControl, FormControl, ValidationErrors} from '@angular/forms';
import {DatepickerOptions} from '../datepicker-config.service';

@Component({
	selector: 'or-date-picker',
	exportAs: 'orDatePicker',
	template: ''
})
export class MockDatepickerComponent {
	datePicker = new FormControl();
	opts = {} as DatepickerOptions;

	@Input() maxDate;
	@Input() minDate;
	@Input() startDate;
	@Input() placeholder: string;
	@Input() options = {} as DatepickerOptions;
	ngbDatePicker: NgbInputDatepicker;
	disabled = false;

	writeValue(obj: any): void {
	}

	registerOnChange(fn: any): void {
	}

	registerOnTouched(fn: any): void {
	}

	setDisabledState(isDisabled: boolean): void {
	}

	validate(control: AbstractControl): ValidationErrors | null {
		return null;
	}

	onKeydown($event) {
	}
}
