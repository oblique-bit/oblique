import {
	Directive, HostBinding, Input, OnInit, Optional
} from '@angular/core';
import {SchemaValidationDirective} from './schema-validation.directive';
import {NgModelGroup} from '@angular/forms';

@Directive({
	selector: '[ngModel]',
})
export class SchemaRequiredDirective implements OnInit {

	@HostBinding('attr.required') required: boolean;
	@Input('name') name: string;

	constructor(@Optional() private schemaValidation: SchemaValidationDirective,
				@Optional() private modelGroup: NgModelGroup) {
	}

	ngOnInit() {
		if (this.schemaValidation) {
			this.required = this.schemaValidation.isRequired(this.name, this.modelGroup ? this.modelGroup.path : []) || undefined;
		}
	}
}
