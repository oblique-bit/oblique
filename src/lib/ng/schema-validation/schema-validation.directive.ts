import {Directive, Input, OnInit} from '@angular/core';
import {ValidationErrors} from '@angular/forms';
import {SchemaValidationService} from './schema-validation.service';

@Directive({
	selector: '[orSchemaValidation]',
	providers: [SchemaValidationService]
})
export class SchemaValidationDirective implements OnInit {
	@Input('orSchemaValidation') private schema: any;
	private validator;

	constructor(private schemaValidationService: SchemaValidationService) {
	}

	ngOnInit() {
		this.validator = this.schemaValidationService.compileSchema(this.schema);
	}

	isRequired(propertyName: string, path: string[]): boolean {
		return this.validator.isRequired(propertyName, path);
	}

	validate(propertyPath: string, value: any): ValidationErrors {
		return this.validator.validate(propertyPath, value);
	}
}
