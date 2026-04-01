import {AfterViewInit, Directive, Injector, inject} from '@angular/core';
import {NG_VALIDATORS, NgControl, UntypedFormControl, ValidationErrors, Validator} from '@angular/forms';
import {ObSchemaValidationDirective} from './schema-validation.directive';
import {WINDOW} from '../utilities';

@Directive({
	selector: '[obSchemaValidate][ngModel],[obSchemaValidate][formControlName]',
	providers: [{provide: NG_VALIDATORS, useExisting: ObSchemaValidateDirective, multi: true}],
})
export class ObSchemaValidateDirective implements AfterViewInit, Validator {
	private propertyName: string;
	private readonly window = inject<Window>(WINDOW);
	private readonly schemaDirective = inject(ObSchemaValidationDirective);
	private readonly injector = inject(Injector);

	ngAfterViewInit(): void {
		// TODO: this is a workaround: if NgControl is required in the constructor, we have cyclic dependencies
		const ngControl = this.injector.get(NgControl);
		this.propertyName = ngControl.path.join('.');
		// Force validation for reactive form, but delay it to avoid ExpressionChangedAfterItHasBeenCheckedError
		this.window.setTimeout(() => ngControl.control.updateValueAndValidity());
	}

	validate(formControl: UntypedFormControl): ValidationErrors {
		return this.schemaDirective.validate(this.propertyName, formControl.value);
	}
}
