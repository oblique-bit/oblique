import {SchemaValidationConfig} from './schema-validation-config';

// FIXME: workaround as tv4 is global
declare var tv4:any;

/**
 * Adapted from: https://github.com/Textalk/angular-schema-form/blob/development/src/services/validator.js
 */
export class SchemaValidatorService {

	/*@ngInject*/
	constructor(private $translate:ng.translate.ITranslateService,
	            public schemaValidationConfig:SchemaValidationConfig) {
		if (schemaValidationConfig.customErrorReporter) {
			tv4.setErrorReporter(schemaValidationConfig.customErrorReporter);
		}
	}

	/**
	 * Validate a value against its form definition and schema.
	 * The value should either be of proper type or a string, some type
	 * coercion is applied.
	 *
	 * @param {Object} schema the JSON schema definition.
	 * @param {String} propertyPath the property path to validate schema against.
	 * @param {Any} value the value to validate.
	 * @return {Object} a tv4js validation result object.
	 */
	validate(schema, propertyPath:string, value:any) {
		if (!schema) {
			return {valid: true};
		}

		// Input of type text and textareas will give us a viewValue of ''
		// when empty, this is a valid value in a schema and does not count as something
		// that breaks validation of 'required'. But for our own sanity an empty field should
		// not validate if it's required.
		if (value === '' || value === null) {
			value = undefined;
		}

		// Version 4 of JSON Schema has the required property not on the
		// property itself but on the wrapping object. Since we like to test
		// only this property we wrap it in a fake object.
		let wrap = {
			type: 'object',
			'properties': {},
			required: undefined
		};

		wrap.properties[propertyPath] = this.propertySchema(propertyPath, schema);
		if (this.isRequired(propertyPath, schema)) {
			wrap.required = [propertyPath];
		}

		let valueWrap = {};
		if (angular.isDefined(value)) {
			valueWrap[propertyPath] = value;
		}
		tv4.language(this.$translate.use());
		return tv4.validateResult(valueWrap, wrap);
	}

	isRequired(propertyPath, schema) {
		return this.isRequiredJSONSchema3(propertyPath, schema) || this.isRequiredJSONSchema4(propertyPath, schema);
	};

	propertySchema(propertyPath, schema) {
		let properties = schema.properties || [];
		return propertyPath.indexOf('.') ? _.result(properties, propertyPath) : properties[propertyPath];
	};

	/**
	 * JSON schema v4 support for required properties.
	 *
	 * @param propertyPath
	 * @param schema
	 */
	isRequiredJSONSchema4(propertyPath, schema) {
		// propertyName: 'parent.properties.child' -> 'parent.child'
		let propertyName = propertyPath.replace(/\.properties\./g, '.');
		return angular.isArray(schema.required) && schema.required.indexOf(propertyName) !== -1;
	}

	/**
	 * JSON schema v3 support for required properties.
	 *
	 * @param propertyPath
	 * @param schema
	 */
	isRequiredJSONSchema3(propertyPath, schema) {
		// Retrieve the reference schema for the current (sub-)property:
		let propertySchema = this.propertySchema(propertyPath, schema);
		return propertySchema && propertySchema.required;
	}
}
