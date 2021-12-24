import {Component, Input, forwardRef} from '@angular/core';
import {AbstractControl, ControlValueAccessor, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator} from '@angular/forms';

@Component({
	selector: 'ob-nested-form',
	exportAs: 'obNestedForm',
	template: '',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			useExisting: forwardRef(() => ObMockNestedFormComponent)
		},
		{
			provide: NG_VALIDATORS,
			multi: true,
			useExisting: forwardRef(() => ObMockNestedFormComponent)
		}
	],
	host: {class: 'ob-nested-form'}
})
export class ObMockNestedFormComponent implements ControlValueAccessor, Validator {
	@Input() nestedForm: FormGroup;

	registerOnChange(fn: any): void {}

	registerOnTouched(fn: any): void {}

	setDisabledState(isDisabled: boolean): void {}

	writeValue(obj: {field1?: string; field2?: string}): void {}

	validate(control: AbstractControl): ValidationErrors | null {
		return null;
	}
}
