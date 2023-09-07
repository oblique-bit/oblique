import {Directive} from '@angular/core';
import {NG_VALIDATORS, UntypedFormControl, ValidationErrors, Validator} from '@angular/forms';

@Directive({
	selector: '[obSchemaValidate][ngModel],[obSchemaValidate][formControlName]',
	providers: [{provide: NG_VALIDATORS, useExisting: ObMockSchemaValidateDirective, multi: true}],
	standalone: true
})
export class ObMockSchemaValidateDirective implements Validator {
	validate(formControl: UntypedFormControl): ValidationErrors {
		return null;
	}
}
