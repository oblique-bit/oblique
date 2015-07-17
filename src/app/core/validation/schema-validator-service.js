/* global tv4 */
/**
 * Adapted from: https://github.com/Textalk/angular-schema-form/blob/development/src/services/validator.js
 */
(function () {
	'use strict';
	/*  Common code for validating a value against its form and schema definition */
	angular.module('__MODULE__.core')
		.factory('schemaValidator', function ($filter) {

			var validator = {};

			/**
			 * Validate a value against its form definition and schema.
			 * The value should either be of proper type or a string, some type
			 * coercion is applied.
			 *
			 * @param {Object} schema the JSON schema definition.
			 * @param {String} propName the property name to validate schema against.
			 * @param {Any} value the value to validate.
			 * @return {Object} a tv4js validation result object.
			 */
			validator.validate = function (schema, propName, value) {
				if (!schema) {
					return {valid: true};
				}

				// Input of type text and textareas will give us a viewValue of ''
				// when empty, this is a valid value in a schema and does not count as something
				// that breaks validation of 'required'. But for our own sanity an empty field should
				// not validate if it's required.
				if (value === '') {
					value = undefined;
				}

				// Version 4 of JSON Schema has the required property not on the
				// property itself but on the wrapping object. Since we like to test
				// only this property we wrap it in a fake object.
				var wrap = {type: 'object', 'properties': {}};

				wrap.properties[propName] = schema.properties[propName];
				if (angular.isArray(schema.required) && schema.required.indexOf(propName) !== -1) {
					wrap.required = [propName];
				}

				var valueWrap = {};
				if (angular.isDefined(value)) {
					valueWrap[propName] = value;
				}
				return tv4.validateResult(valueWrap, wrap);
			};

			return validator;
		});
}());
