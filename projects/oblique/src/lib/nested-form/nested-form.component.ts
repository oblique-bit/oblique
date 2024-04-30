import {AfterViewInit, Component, DestroyRef, HostListener, Input, inject} from '@angular/core';
import {
	AbstractControl,
	ControlValueAccessor,
	NG_VALIDATORS,
	NG_VALUE_ACCESSOR,
	UntypedFormGroup,
	ValidationErrors,
	Validator
} from '@angular/forms';
import {ObParentFormDirective} from './parent-form.directive';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
	selector: 'ob-nested-form',
	exportAs: 'obNestedForm',
	templateUrl: './nested-form.component.html',
	providers: [
		{provide: NG_VALUE_ACCESSOR, multi: true, useExisting: ObNestedFormComponent},
		{provide: NG_VALIDATORS, multi: true, useExisting: ObNestedFormComponent}
	],
	host: {class: 'ob-nested-form'},
	standalone: true
})
export class ObNestedFormComponent implements ControlValueAccessor, Validator, AfterViewInit {
	@Input() nestedForm: UntypedFormGroup;
	private onTouched: () => void;
	private readonly parent = inject(ObParentFormDirective);
	private readonly destroyRef = inject(DestroyRef);

	@HostListener('focusout') onBlur(): void {
		this.onTouched();
	}

	ngAfterViewInit(): void {
		this.parent.submit$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.nestedForm.markAllAsTouched());
		this.parent.reset$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.nestedForm.reset());
	}

	registerOnChange(fn: any): void {
		this.nestedForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(val => fn(val));
	}

	registerOnTouched(fn: () => void): void {
		this.onTouched = fn;
	}

	setDisabledState(isDisabled: boolean): void {
		// eslint-disable-next-line no-unused-expressions
		if (isDisabled) {
			this.nestedForm.disable({emitEvent: false});
		} else {
			this.nestedForm.enable({emitEvent: false});
		}
	}

	writeValue(obj: {field1?: string; field2?: string}): void {
		if (obj) {
			this.nestedForm.patchValue(obj, {emitEvent: false});
		} else {
			this.nestedForm.reset();
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	validate(control: AbstractControl): ValidationErrors | null {
		return this.nestedForm.valid ? null : this.formatErrors(this.nestedForm);
	}

	private formatErrors(form: UntypedFormGroup): ValidationErrors {
		return Object.keys(form.controls)
			.filter(field => form.get(field).errors)
			.reduce((errors, field) => ({...errors, [field]: form.get(field).errors}), {});
	}
}
