import {Directive, Input, AfterViewInit, OnInit} from '@angular/core';
import {SchemaValidationService} from './schema-validation.service';

@Directive({
	selector: '[orSchemaValidation]',
	providers: [SchemaValidationService]
})
export class SchemaValidationDirective implements OnInit, AfterViewInit {

	@Input('orSchemaValidation') schema: any;

	constructor(private schemaValidationService: SchemaValidationService) {

	}

	ngOnInit(): void {
		this.transformsIntoDraft06Schema();
	}


	ngAfterViewInit(): void {
		this.schemaValidationService.compileSchema(this.schema);
	}

	private transformsIntoDraft06Schema(): void {
		if (this.schema.id) {
			this.schema.$id = this.schema.id;
			delete this.schema.id;
		}

		if (!this.schema.required) {
			this.schema.required = [];
			Object.keys(this.schema.properties).forEach((property) => {
				if (this.schema.properties[property].required) {
					this.schema.required.push(property);
					delete this.schema.properties[property].required;
				}
			});
		}
	}

}
