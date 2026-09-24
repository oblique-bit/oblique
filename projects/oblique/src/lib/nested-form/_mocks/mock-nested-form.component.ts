import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {
	AbstractControl,
	ControlValueAccessor,
	NG_VALIDATORS,
	NG_VALUE_ACCESSOR,
	UntypedFormGroup,
	ValidationErrors,
	Validator,
} from '@angular/forms';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Component({
	selector: 'ob-nested-form',
	template: '',
	providers: [
		{provide: NG_VALUE_ACCESSOR, multi: true, useExisting: ObMockNestedFormComponent},
		{provide: NG_VALIDATORS, multi: true, useExisting: ObMockNestedFormComponent},
	],
	changeDetection: ChangeDetectionStrategy.Eager,
	host: {class: 'ob-nested-form'},
	exportAs: 'obNestedForm',
})
export class ObMockNestedFormComponent implements ControlValueAccessor, Validator {
	readonly nestedForm = input<UntypedFormGroup>(undefined);

	registerOnChange(fn: any): void {}

	registerOnTouched(fn: any): void {}

	setDisabledState(isDisabled: boolean): void {}

	writeValue(obj: {field1?: string; field2?: string}): void {}

	validate(control: AbstractControl): ValidationErrors | null {
		return null;
	}
}
