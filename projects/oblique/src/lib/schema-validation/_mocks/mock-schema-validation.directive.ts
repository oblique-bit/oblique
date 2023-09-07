import {Directive} from '@angular/core';
import {ValidationErrors} from '@angular/forms';

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
