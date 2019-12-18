import {Directive, forwardRef} from '@angular/core';
import {FormControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';

@Directive({
	selector: '[orSchemaValidate][ngModel],[orSchemaValidate][formControlName]',
	providers: [
		{provide: NG_VALIDATORS, useExisting: forwardRef(() => MockSchemaValidateDirective), multi: true}
	]
})
export class MockSchemaValidateDirective implements Validator {
	validate(formControl: FormControl): ValidationErrors {
		return null;
	}
}
