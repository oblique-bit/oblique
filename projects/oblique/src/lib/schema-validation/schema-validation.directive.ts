import {Directive, Input, OnInit} from '@angular/core';
import {ValidationErrors} from '@angular/forms';
import {ObSchemaValidationService} from './schema-validation.service';

@Directive({
	selector: '[obSchemaValidation]',
	providers: [ObSchemaValidationService]
})
export class ObSchemaValidationDirective implements OnInit {
	@Input('obSchemaValidation') private readonly schema: any;
	private validator;

	constructor(private readonly schemaValidationService: ObSchemaValidationService) {
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
