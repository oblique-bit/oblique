import {Directive} from '@angular/core';
import {ValidationErrors} from '@angular/forms';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Directive({
	selector: '[obSchemaValidation]',
	exportAs: 'obSchemaValidation',
	standalone: true
})
export class ObMockSchemaValidationDirective {
	isRequired(propertyName: string, path: string[]): boolean {
		return true;
	}

	validate(propertyPath: string, value: any): ValidationErrors {
		return null;
	}
}
