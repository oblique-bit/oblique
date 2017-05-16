import {Injectable} from '@angular/core';
import * as Ajv from 'ajv';

@Injectable()
export class SchemaValidationService {
	//TODO: required validation: should this even be here?

	private ajv = new Ajv({allErrors: true});

	compileSchema(schema: any, parentPropertyName?) {
		Object.keys(schema.properties).forEach((propertyName) => {
			const propertyPath = parentPropertyName ? `${parentPropertyName}.${propertyName}` : propertyName;
			if (schema.properties[propertyName].properties) {
				this.compileSchema(schema.properties[propertyName], propertyPath);
			} else {
				this.ajv.addSchema(schema.properties[propertyName], propertyPath);
			}
		});
	}

	validate(propertyPath: string, value: any): null|{[errorKey: string]: {[params: string]: any}} {
		this.ajv.validate(propertyPath, value);

		return this.ajv.errors === null ? null : {
			[this.ajv.errors[0].keyword]: this.ajv.errors[0].params
		};

	}
}
