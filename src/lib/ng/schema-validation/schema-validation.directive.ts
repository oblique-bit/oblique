import {Directive, Input, OnInit} from '@angular/core';
import {SchemaValidationService} from './schema-validation.service';

@Directive({
	selector: '[orSchemaValidation]',
	providers: [SchemaValidationService]
})
export class SchemaValidationDirective implements OnInit {

	@Input('orSchemaValidation') schema: any;

	constructor(private schemaValidationService: SchemaValidationService) {
	}

	ngOnInit() {
		this.schemaValidationService.compileSchema(this.schema);
	}
}
