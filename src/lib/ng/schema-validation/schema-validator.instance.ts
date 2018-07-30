import {AbstractControl, ValidationErrors} from '@angular/forms';
import * as Ajv from 'ajv';

export class SchemaValidatorInstance {
	private readonly ajv = new Ajv({allErrors: true});
	private readonly schema;

	constructor(schema) {
		this.addSchema(schema);
		this.schema = schema;
	}

	validate(propertyPath: string, value: any): ValidationErrors {
		if (this.hasRequiredError(propertyPath.split('.'), value)) {
			return {required: true};
		}

		this.ajv.validate(propertyPath, value);
		if (this.ajv.errors && value != null && value !== '') {	// when a value is empty, do not check its type
			return {[this.ajv.errors[0].keyword]: this.ajv.errors[0].params};
		}

		return null;
	}

	getValidator(propertyPath: string): (AbstractControl) => ValidationErrors {
		return (control: AbstractControl) => this.validate(propertyPath, control.value);
	}

	isRequired(property: string, path: string[]): boolean {
		let schema = JSON.parse(JSON.stringify(this.schema));
		path.forEach((name) => {
			if (schema.properties && schema.properties[name]) {
				schema = schema.properties[name];
			}
		});
		return (schema.required || []).indexOf(property) > -1;
	}

	private hasRequiredError(path: string[], value): boolean {
		const propertyName = path.pop();
		return !value && this.isRequired(propertyName, path);
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
