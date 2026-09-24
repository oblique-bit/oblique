import {Directive, input} from '@angular/core';
import {ValidationErrors} from '@angular/forms';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Directive({
	selector: '[obSchemaValidation]',
	exportAs: 'obSchemaValidation',
})
export class ObMockSchemaValidationDirective {
	readonly schema = input<any>(undefined, {alias: 'obSchemaValidation'});

	isRequired(propertyName: string, path: string[]): boolean {
		return true;
	}

	validate(propertyPath: string, value: any): ValidationErrors {
		return null;
	}
}
