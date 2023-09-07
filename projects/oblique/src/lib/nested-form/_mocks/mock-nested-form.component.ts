import {Component, Input} from '@angular/core';
import {
	AbstractControl,
	ControlValueAccessor,
	NG_VALIDATORS,
	NG_VALUE_ACCESSOR,
	UntypedFormGroup,
	ValidationErrors,
	Validator
} from '@angular/forms';

@Component({
	selector: 'ob-nested-form',
	exportAs: 'obNestedForm',
	template: '',
	providers: [
		{provide: NG_VALUE_ACCESSOR, multi: true, useExisting: ObMockNestedFormComponent},
		{provide: NG_VALIDATORS, multi: true, useExisting: ObMockNestedFormComponent}
	],
	host: {class: 'ob-nested-form'},
	standalone: true
})
export class ObMockNestedFormComponent implements ControlValueAccessor, Validator {
	@Input() nestedForm: UntypedFormGroup;

	registerOnChange(fn: any): void {}

	registerOnTouched(fn: any): void {}

	setDisabledState(isDisabled: boolean): void {}

	writeValue(obj: {field1?: string; field2?: string}): void {}

	validate(control: AbstractControl): ValidationErrors | null {
		return null;
	}
}
