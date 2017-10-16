import {Injectable} from '@angular/core';
import {AbstractControl} from '@angular/forms';
import * as Ajv from 'ajv';
import {draft06} from './draft06.decorator';

@Injectable()
export class SchemaValidationService {
	private ajv = new Ajv({allErrors: true});
	private currentSchema: string;
	private required: string[];

	@draft06
	compileSchema(schema: any): void {
		const newSchema = JSON.stringify(schema);
		if (this.currentSchema !== newSchema) {
			this.required = schema.required || [];
			this.addSchema(schema);
			this.currentSchema = newSchema;
		}
	}

	validate(propertyPath: string, value: any): { [errorKey: string]: { [params: string]: any } } | {required: boolean} {
		this.ajv.validate(propertyPath, value);

		if (this.ajv.errors) {
			return {
				[this.ajv.errors[0].keyword]: this.ajv.errors[0].params
			};
		}

		if (!value && this.required.indexOf(propertyPath) > -1) {
			return {required: true};
		}

		return null;
	}

	getValidator(propertyPath: string): (AbstractControl) => { [errorKey: string]: { [params: string]: any } } | {required: boolean} {
		return (control: AbstractControl) => this.validate(propertyPath, control.value);
	}

	private addSchema(schema: any, parentPropertyName?): void {
		Object.keys(schema.properties).forEach((propertyName) => {
			const propertyPath = parentPropertyName ? `${parentPropertyName}.${propertyName}` : propertyName;
			if (schema.properties[propertyName].properties) {
				this.addSchema(schema.properties[propertyName], propertyPath);
			} else {
				this.ajv.addSchema(schema.properties[propertyName], propertyPath);
			}
		});
	}
}
