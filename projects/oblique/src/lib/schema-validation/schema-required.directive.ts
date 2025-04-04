import {AfterViewInit, Directive, ElementRef, HostBinding, Input, OnInit, Optional, Renderer2, inject} from '@angular/core';
import {NgModel, NgModelGroup} from '@angular/forms';
import {ObSchemaValidationDirective} from './schema-validation.directive';

@Directive({
	selector: '[obSchemaValidate][ngModel]',
	exportAs: 'obSchemaRequiredValidation',
	host: {class: 'ob-schema-required-validation'},
	standalone: true
})
export class ObSchemaRequiredDirective implements AfterViewInit, OnInit {
	@HostBinding('attr.aria-required') required: boolean;
	/**
	 * @deprecated with Oblique 13.2.0, it will be removed in the next major without replacement
	 */
	@Input() name: string;
	private readonly host = inject(ElementRef);
	private readonly renderer = inject(Renderer2);
	private readonly model = inject(NgModel, {optional: true});

	constructor(
		private readonly schemaValidation: ObSchemaValidationDirective,
		@Optional() private readonly modelGroup: NgModelGroup
	) {}

	ngOnInit(): void {
		this.required = this.schemaValidation.isRequired(this.model.name, this.modelGroup ? this.modelGroup.path : []);
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
