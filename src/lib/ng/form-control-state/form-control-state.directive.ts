import {
	Directive, HostBinding, ContentChild, AfterViewInit, Input, Optional, ElementRef,
	Renderer2
} from '@angular/core';
import {NgControl, NgForm, FormGroupDirective} from '@angular/forms';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/observable/merge';
import {SchemaValidationDirective} from '../schema-validation/schema-validation.directive';

@Directive({
	selector: '[orFormControlState]'
})
export class FormControlStateDirective implements AfterViewInit {

	@Input() pristineValidation = false;
	@Input() mandatory;

	@HostBinding('class.has-error') hasErrorClass = false;

	@ContentChild(NgControl) ngControl: NgControl;

	private form: NgForm | FormGroupDirective;
	private inputContainer;

	constructor(@Optional() ngForm: NgForm,
				@Optional() formGroupDirective: FormGroupDirective,
				@Optional() private schemaValidation: SchemaValidationDirective,
				private elementRef: ElementRef,
				private renderer: Renderer2) {
		this.form = ngForm || formGroupDirective;

		if (!this.form) {
			throw new Error('You need either a NgForm or a FormGroupDirective for the FormControlStateDirective!');
		}
	}

	ngAfterViewInit() {
		if (!this.ngControl) {
			throw new Error('You need to provide an NgControl for the FormControlStateDirective!');
		}

		let inputElement = this.elementRef.nativeElement.querySelector('[ngModel], [ngModelChange], [formControlName]');
		if (!inputElement) {
			throw new Error('you need to provide either a ngModel, ngModelChange or formControlName for the FormControlStateDirective!');
		}
		this.inputContainer = inputElement.parentElement;
		this.mandatory = this.mandatory
			|| this.hasRequiredValidator()
			|| this.hasRequiredAttribute(inputElement)
			|| this.isJsonSchemaFieldRequired();

		Observable.merge(
			this.form.ngSubmit,
			this.ngControl.statusChanges
		).subscribe(() => this.generateState());

		this.delayStateGenerationForReactiveForms();
	}

	private delayStateGenerationForReactiveForms() {
		// Reactive forms instantiate the view only after the model is ready. Thus modifying this.errors in the same
		// tick as ngAfterViewInit will trigger an ExpressionChangedAfterItHasBeenCheckedError
		if (this.form instanceof FormGroupDirective) {
			setTimeout(() => this.generateState(), 0);
		}
	}

	private generateState() {
		if (this.form.submitted || !this.ngControl.pristine || this.pristineValidation) {
			this.hasErrorClass = this.ngControl.invalid;
		}

		if (this.mandatory) {
			if (this.ngControl.value) {
				this.renderer.removeClass(this.inputContainer, 'control-mandatory');
			} else {
				this.renderer.addClass(this.inputContainer, 'control-mandatory');
			}
		}
	}

	private hasRequiredValidator(): boolean {
		// used by model driven forms
		return this.ngControl.errors && this.ngControl.errors.required;
	}

	// noinspection JSMethodCanBeStatic
	private hasRequiredAttribute(inputElement: Element): boolean {
		// used by template driven forms
		return inputElement.hasAttribute('required')
	}

	private isJsonSchemaFieldRequired(): boolean {
		return this.schemaValidation
			&& this.schemaValidation.schema.required
			&& Array.isArray(this.schemaValidation.schema.required)
			&& this.schemaValidation.schema.required.includes(this.ngControl.name);
	}
}
