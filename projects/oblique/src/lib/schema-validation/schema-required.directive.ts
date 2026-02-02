import {AfterViewInit, Directive, ElementRef, OnInit, Renderer2, inject} from '@angular/core';
import {FormControlName, NgModel, NgModelGroup} from '@angular/forms';
import {ObSchemaValidationDirective} from './schema-validation.directive';

@Directive({
	selector: '[obSchemaValidate][ngModel],[obSchemaValidate][formControlName]',
	standalone: true,
	host: {
		'[attr.aria-required]': 'required',
		class: 'ob-schema-required-validation',
	},
	exportAs: 'obSchemaRequiredValidation',
})
export class ObSchemaRequiredDirective implements AfterViewInit, OnInit {
	required: boolean;

	private readonly host = inject(ElementRef);
	private readonly renderer = inject(Renderer2);
	private readonly model = inject(NgModel, {optional: true});
	private readonly formControlName = inject(FormControlName, {optional: true});
	private readonly modelGroup = inject(NgModelGroup, {optional: true});
	private readonly schemaValidation = inject(ObSchemaValidationDirective);

	ngOnInit(): void {
		const control = this.formControlName ?? this.model;
		this.required = this.schemaValidation.isRequired(control.name as string, this.modelGroup?.path ?? []);
	}

	ngAfterViewInit(): void {
		if (this.required) {
			this.insertRequiredMarkerInLabel();
		}
	}

	// mimics the behavior of Material for required fields
	private insertRequiredMarkerInLabel(): void {
		const matFormField = this.host.nativeElement.closest('.mat-mdc-form-field');
		if (matFormField) {
			const label = matFormField.querySelector('label');
			if (label) {
				const span = this.renderer.createElement('span');
				span.setAttribute('class', 'mat-mdc-form-field-required-marker mdc-floating-label--required');
				span.setAttribute('aria-hidden', 'true');
				this.renderer.appendChild(label, span);
			}
		}
	}
}
