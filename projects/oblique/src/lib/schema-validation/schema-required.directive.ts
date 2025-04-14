import {Directive, HostBinding, Input, OnInit, Optional} from '@angular/core';
import {NgModelGroup} from '@angular/forms';
import {ObSchemaValidationDirective} from './schema-validation.directive';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '[ngModel]',
	exportAs: 'obSchemaRequiredValidation',
	host: {class: 'ob-schema-required-validation'},
	standalone: true
})
export class ObSchemaRequiredDirective implements OnInit {
	@HostBinding('attr.aria-required') required: boolean;
	@Input() name: string;

	constructor(
		@Optional() private readonly schemaValidation: ObSchemaValidationDirective,
		@Optional() private readonly modelGroup: NgModelGroup
	) {}

	ngOnInit(): void {
		if (this.schemaValidation) {
			this.required = this.schemaValidation.isRequired(this.name, this.modelGroup ? this.modelGroup.path : []) || undefined;
		}
	}
}
