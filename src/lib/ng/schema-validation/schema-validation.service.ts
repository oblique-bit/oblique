import {Injectable} from '@angular/core';
import * as Ajv from 'ajv';

@Injectable()
export class SchemaValidationService {

	private ajv = new Ajv({allErrors: true});
	private required: string[];

	compileSchema(schema: any) {
		this.required = schema.required || [];
		this.addSchema(schema);
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
