import {AfterViewInit, Directive, forwardRef, Inject, Injector} from '@angular/core';
import {FormControl, NG_VALIDATORS, NgControl, ValidationErrors, Validator} from '@angular/forms';
import {ObSchemaValidationDirective} from './schema-validation.directive';
import {WINDOW} from '../utilities';

@Directive({
	selector: '[obSchemaValidate][ngModel],[obSchemaValidate][formControlName]',
	providers: [{provide: NG_VALIDATORS, useExisting: forwardRef(() => ObSchemaValidateDirective), multi: true}]
})
export class ObSchemaValidateDirective implements AfterViewInit, Validator {
	private propertyName: string;
	private readonly window: Window;

	constructor(private readonly schemaDirective: ObSchemaValidationDirective, private readonly injector: Injector, @Inject(WINDOW) window: any) {
		this.window = window; // because AoT don't accept interfaces as DI
	}

	ngAfterViewInit(): void {
		//TODO: this is a workaround: if NgControl is required in the constructor, we have cyclic dependencies
		const ngControl = this.injector.get(NgControl);
		this.propertyName = ngControl.path.join('.');
		// Force validation for reactive form, but delay it to avoid ExpressionChangedAfterItHasBeenCheckedError
		this.window.setTimeout(() => ngControl.control.updateValueAndValidity());
	}

	validate(formControl: FormControl): ValidationErrors {
		return this.schemaDirective.validate(this.propertyName, formControl.value);
	}
}
