import {Directive} from '@angular/core';
import {ValidationErrors} from '@angular/forms';

@Directive({
	selector: '[obSchemaValidation]'
})
export class ObMockSchemaValidationDirective {
	isRequired(propertyName: string, path: string[]): boolean {
		return true;
	}

	validate(propertyPath: string, value: any): ValidationErrors {
		return null;
	}
}
