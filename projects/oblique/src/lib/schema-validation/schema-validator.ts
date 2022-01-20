import {AfterViewInit, Directive, Inject, Injector} from '@angular/core';
import {FormControl, NG_VALIDATORS, NgControl, ValidationErrors, Validator} from '@angular/forms';
import {ObSchemaValidationDirective} from './schema-validation.directive';
import {WINDOW} from '../utilities';

@Directive({
	selector: '[obSchemaValidate][ngModel],[obSchemaValidate][formControlName]',
	providers: [{provide: NG_VALIDATORS, useExisting: ObSchemaValidateDirective, multi: true}]
})
export class ObSchemaValidateDirective implements AfterViewInit, Validator {
	private propertyName: string;

	constructor(
		private readonly schemaDirective: ObSchemaValidationDirective,
		private readonly injector: Injector,
		@Inject(WINDOW) private readonly window: Window
	) {}

	ngAfterViewInit(): void {
		// TODO: this is a workaround: if NgControl is required in the constructor, we have cyclic dependencies
		const ngControl = this.injector.get(NgControl);
		this.propertyName = ngControl.path.join('.');
		// Force validation for reactive form, but delay it to avoid ExpressionChangedAfterItHasBeenCheckedError
		this.window.setTimeout(() => ngControl.control.updateValueAndValidity());
	}

	validate(formControl: FormControl): ValidationErrors {
		return this.schemaDirective.validate(this.propertyName, formControl.value);
	}
}
