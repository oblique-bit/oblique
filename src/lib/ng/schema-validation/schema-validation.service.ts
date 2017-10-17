import {Injectable} from '@angular/core';
import {AbstractControl} from '@angular/forms';
import * as Ajv from 'ajv';
import {draft06} from './draft06.decorator';

@Injectable()
export class SchemaValidationService {
	private ajv = new Ajv({allErrors: true});
	private currentSchema;

	@draft06
	compileSchema(schema: any): void {
		if (JSON.stringify(this.currentSchema) !== JSON.stringify(schema)) {
			this.addSchema(schema);
			this.currentSchema = schema;
		}
	}

	validate(propertyPath: string, value: any): { [errorKey: string]: { [params: string]: any } } | { required: boolean } {
		this.ajv.validate(propertyPath, value);

		if (this.ajv.errors) {
			return {
				[this.ajv.errors[0].keyword]: this.ajv.errors[0].params
			};
		}

		return !value
			? this.requiredError(propertyPath.split('.'))
			: null;
	}

	getValidator(propertyPath: string): (AbstractControl) => { [errorKey: string]: { [params: string]: any } } | { required: boolean } {
		return (control: AbstractControl) => this.validate(propertyPath, control.value);
	}

	isRequired(property: string, path: string[]): boolean {
		let schema = JSON.parse(JSON.stringify(this.currentSchema));
		path.forEach((name) => {
			if (schema.properties && schema.properties[name]) {
				schema = schema.properties[name];
			}
		});
		return (schema.required || []).indexOf(property) > -1;
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

	private requiredError(path: string[]): { required: boolean } {
		const propertyName = path.pop();
		return this.isRequired(propertyName, path)
			? {required: true}
			: null;
	}
}
