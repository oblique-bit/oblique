import {AfterViewInit, Component, forwardRef, Input} from '@angular/core';
import {AbstractControl, ControlValueAccessor, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator} from '@angular/forms';
import {ParentFormDirective} from './parent-form.directive';

@Component({
	selector: 'or-nested-form',
	exportAs: 'orNestedForm',
	templateUrl: './nested-form.component.html',
	providers: [
		{
			provide: NG_VALUE_ACCESSOR,
			multi: true,
			useExisting: forwardRef(() => NestedFormComponent)
		},
		{
			provide: NG_VALIDATORS,
			multi: true,
			useExisting: forwardRef(() => NestedFormComponent)
		}
	]
})
export class NestedFormComponent implements ControlValueAccessor, Validator, AfterViewInit {
	@Input() nestedForm: FormGroup;

	constructor(private readonly parent: ParentFormDirective) {
	}

	ngAfterViewInit() {
		this.parent.submit$.subscribe(() => this.nestedForm.markAllAsTouched());
		this.parent.reset$.subscribe(() => this.nestedForm.reset());
	}

	registerOnChange(fn: any): void {
		this.nestedForm.valueChanges.subscribe(val => fn(val));
	}

	registerOnTouched(fn: any): void {
	}

	setDisabledState(isDisabled: boolean): void {
		isDisabled ? this.nestedForm.disable() : this.nestedForm.enable();
	}

	writeValue(obj: { field1?: string, field2?: string }): void {
		obj ? this.nestedForm.patchValue(obj) : this.nestedForm.reset();
	}

	validate(control: AbstractControl): ValidationErrors | null {
		return this.nestedForm.valid ? null : this.formatErrors(this.nestedForm);
	}

	private formatErrors(form: FormGroup): ValidationErrors {
		return Object.keys(form.controls)
			.filter(field => form.get(field).errors)
			.reduce((errors, field) => ({...errors, [field]: form.get(field).errors}), {});
	}
}
