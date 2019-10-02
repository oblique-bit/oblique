import {Directive, AfterViewInit, forwardRef, Injector} from '@angular/core';
import {NG_VALIDATORS, FormControl, NgControl, Validator, ValidationErrors} from '@angular/forms';
import {SchemaValidationDirective} from './schema-validation.directive';

@Directive({
	selector: '[orSchemaValidate][ngModel],[orSchemaValidate][formControlName]',
	providers: [
		{provide: NG_VALIDATORS, useExisting: forwardRef(() => SchemaValidateDirective), multi: true}
	]
})
export class SchemaValidateDirective implements AfterViewInit, Validator {

	private propertyName: string;

	constructor(private readonly schemaDirective: SchemaValidationDirective,
				private readonly injector: Injector) {
	}

	ngAfterViewInit(): void {
		//TODO: this is a workaround: if NgControl is required in the constructor, we have cyclic dependencies
		const ngControl = this.injector.get(NgControl);
		this.propertyName = ngControl.path.join('.');
		// Force validation for reactive form, but delay it to avoid ExpressionChangedAfterItHasBeenCheckedError
		setTimeout(() => ngControl.control.updateValueAndValidity());
	}

	validate(formControl: FormControl): ValidationErrors {
		return this.schemaDirective.validate(this.propertyName, formControl.value);
	}
}
