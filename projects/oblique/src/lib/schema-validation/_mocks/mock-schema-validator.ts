import {Directive} from '@angular/core';
import {NG_VALIDATORS, UntypedFormControl, ValidationErrors, Validator} from '@angular/forms';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Directive({
	selector: '[obSchemaValidate][ngModel],[obSchemaValidate][formControlName]',
	standalone: true,
	providers: [{provide: NG_VALIDATORS, useExisting: ObMockSchemaValidateDirective, multi: true}],
})
export class ObMockSchemaValidateDirective implements Validator {
	validate(formControl: UntypedFormControl): ValidationErrors {
		return null;
	}
}
