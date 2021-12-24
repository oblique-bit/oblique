import {AbstractControl, ValidationErrors} from '@angular/forms';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';

export class ObSchemaValidatorInstance {
	private readonly ajv = new Ajv({allErrors: true, allowUnionTypes: true});
	private readonly schema;

	constructor(schema) {
		addFormats(this.ajv);
		this.addSchema(schema);
		this.schema = schema;
	}

	// eslint-disable-next-line @typescript-eslint/default-param-last
	validate(propertyPath = '', value: any): ValidationErrors {
		if (this.hasRequiredError(propertyPath.split('.'), value)) {
			return {'ajv.required': true};
		}

		if (this.ajv.getSchema(propertyPath)) {
			this.ajv.validate(propertyPath, value);
			if (this.ajv.errors && value != null && value !== '') {
				// when a value is empty, do not check its type
				const key = this.ajv.errors[0].keyword === 'format' && this.ajv.errors[0].params.format === 'date-time' ? '.date' : '';
				return {[`ajv.${this.ajv.errors[0].keyword}${key}`]: this.ajv.errors[0].params};
			}
		}

		return null;
	}

	getValidator(propertyPath: string): (AbstractControl) => ValidationErrors {
		return (control: AbstractControl) => this.validate(propertyPath, control.value);
	}

	isRequired(property: string, path: string[]): boolean {
		let schema = JSON.parse(JSON.stringify(this.schema));
		path.forEach(name => {
			if (schema?.properties[name]) {
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
		Object.keys(schema.properties || {}).forEach(propertyName => {
			const propertyPath = parentPropertyName ? `${parentPropertyName}.${propertyName}` : propertyName;
			if (schema.properties[propertyName].properties) {
				this.addSchema(schema.properties[propertyName], propertyPath);
			} else {
				this.ajv.addSchema(schema.properties[propertyName], propertyPath);
			}
		});
	}
}
