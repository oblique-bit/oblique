import {Directive, AfterViewInit, forwardRef, Injector} from '@angular/core';
import {NG_VALIDATORS, FormControl, NgControl, Validator, ValidationErrors} from '@angular/forms';
import {SchemaValidationDirective} from './schema-validation.directive';

@Directive({
	selector: '[orSchemaValidate][ngModel],[orSchemaValidate][formControl]',
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
		this.propertyName = this.injector.get(NgControl).path.join('.');
	}

	validate(formControl: FormControl): ValidationErrors {
		return this.schemaDirective.validate(this.propertyName, formControl.value);
	}
}
