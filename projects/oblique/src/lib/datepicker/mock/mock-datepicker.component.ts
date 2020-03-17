import {Component, forwardRef, Input} from '@angular/core';
import {NgbInputDatepicker} from '@ng-bootstrap/ng-bootstrap';
import {AbstractControl, ControlValueAccessor, FormControl, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator} from '@angular/forms';
import {ObIDatepickerOptions} from '../datepicker-config.service';

@Component({
	selector: 'ob-date-picker',
	exportAs: 'obDatePicker',
	template: '',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			useExisting: forwardRef(() => ObMockDatepickerComponent)
		}, {
			provide: NG_VALIDATORS,
			multi: true,
			useExisting: forwardRef(() => ObMockDatepickerComponent)
		}
	]
})
export class ObMockDatepickerComponent implements ControlValueAccessor, Validator {
	datePicker = new FormControl();
	opts = {} as ObIDatepickerOptions;

	@Input() maxDate;
	@Input() minDate;
	@Input() startDate;
	@Input() placeholder: string;
	@Input() options = {} as ObIDatepickerOptions;
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
