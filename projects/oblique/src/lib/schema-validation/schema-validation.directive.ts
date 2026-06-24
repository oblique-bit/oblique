import {Directive, OnInit, inject, input} from '@angular/core';
import {ValidationErrors} from '@angular/forms';
import {ObSchemaValidationService} from './schema-validation.service';
import {ObSchemaValidatorInstance} from './schema-validator.instance';

@Directive({
	selector: '[obSchemaValidation]',
	providers: [ObSchemaValidationService],
	host: {class: 'ob-schema-validation'},
	exportAs: 'obSchemaValidation',
})
export class ObSchemaValidationDirective implements OnInit {
	readonly schema = input<any>(undefined, {alias: 'obSchemaValidation'});
	private validator: ObSchemaValidatorInstance;
	private readonly schemaValidationService = inject(ObSchemaValidationService);

	ngOnInit(): void {
		this.validator = this.schemaValidationService.compileSchema(this.schema());
	}

	isRequired(propertyName: string, path: string[]): boolean {
		return this.validator.isRequired(propertyName, path);
	}

	validate(propertyPath: string, value: any): ValidationErrors {
		return this.validator.validate(propertyPath, value);
	}
}
