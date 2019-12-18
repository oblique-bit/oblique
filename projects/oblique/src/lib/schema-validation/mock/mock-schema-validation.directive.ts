import {Directive} from '@angular/core';
import {ValidationErrors} from '@angular/forms';

@Directive({
	selector: '[orSchemaValidation]'
})
export class MockSchemaValidationDirective {
	isRequired(propertyName: string, path: string[]): boolean {
		return true;
	}

	validate(propertyPath: string, value: any): ValidationErrors {
		return null;
	}
}
