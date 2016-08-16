/**
 * Adapted from: https://github.com/Textalk/angular-schema-form/blob/development/src/directives/schema-validate.js
 */
(function () {
	'use strict';
	angular.module('__MODULE__.oblique')
	.constant('schemaValidateConfig', {
		messageParsers: [] // [function(name, value, error, message) {/* ...*/ return message;}]
	})
	.directive('validationSchema', function ($log) {
		return {
			restrict: 'A',
			require: ['^form'],
			scope: {
				validationSchema: '='
			},
			controller: function ($scope) {
				this.schema = $scope.validationSchema;

				if (!this.schema || !angular.isObject(this.schema)) {
					$log.error('Provided schema could not be found or is invalid!');
				}
			}
		};
	})
	.directive('validationBusiness', function ($log) {
		return {
			restrict: 'A',
			require: ['^form'],
			link: function (scope, element, attrs, params) {
				var form = params[0];
				scope.$on('validationBusinessEvent', function (event, errors) {
					_.forEach(errors || [], function (error) {
						var formKey = error.parent ? error.parent + (error.index ? '_' + error.index : '') : null;
						var targetForm = formKey ? form[formKey] : form;
						var formControl = targetForm[error.property || error.name];
						if (formControl) {
							formControl.$setValidity('business', false);
							formControl.$errorMessage = error.message;
						} else {
							$log.warn("Unable to map business error with form control. Ignoring...", error);
						}
					});
				});
			}
		};
	})
	.directive('schemaValidate', function ($log, $timeout, schemaValidator, schemaValidateConfig) {
		function isMandatory(name, schema) {
			var dotIdx = name.indexOf('.');
			if (dotIdx !== -1) {
				return isMandatory(name.slice(dotIdx + 1), schema.properties[name.slice(0, dotIdx)]);
			}
			return angular.isArray(schema.required) && schema.required.indexOf(name.replace('_selectedCode', '')) !== -1;
		}

		var isModelEmpty = function (viewValue) {
			return angular.isUndefined(viewValue) || viewValue === null || viewValue === "";
		};

		return {
			restrict: 'A',
			// We want the link function to be *after* the input directives link function so we get access
			// the parsed value, ex. a number instead of a string
			priority: 1000,
			require: ['?ngModel', '^form', '^validationSchema'],
			link: function (scope, element, attrs, params) {
				var ngModel = params[0];
				var form = params[1];
				var schema = params[2].schema;
				var name = attrs.name;
				if (!name) {
					$log.warn("Schema validation cannot be attached to a form control without a 'name' attribute. Ignoring...");
				} else if (!schema) {
					$log.warn("Unable to retrieve validation schema for '%s'. Ignoring...", name);
				} else {
					var schemaPath = _.map(name.split('_'), function (part) {
						return _.camelCase(part);
					}).join('.properties.');

					var formControl = form[name];

					// Check and activate mandatory indicator:
					var mandatory = isMandatory(name, schema);
					if (mandatory) {
						// Delay mandatory activation to another digest cycle in order to ensure that model has been assigned:
						$timeout(function () {
							if (isModelEmpty(ngModel.$viewValue)) {
								element.parent().addClass('control-mandatory');
							}
						}, 0);
					}

					// Validate against the schema:
					var validate = function (viewValue) {

						// Omit TV4 validation
						if (scope.options && scope.options.tv4Validation === false) {
							return viewValue;
						}

						// Toggle the mandatory indicator:
						if (mandatory && !isModelEmpty(viewValue)) {
							element.parent().removeClass('control-mandatory');
						} else if (mandatory) {
							element.parent().addClass('control-mandatory');
						}

						var result = schemaValidator.validate(schema, schemaPath, viewValue);

						// Clear business errors, if any:
						ngModel.$setValidity('business', true);

						// Since we might have different schema errors we must clear all
						// errors that start with 'schema-':
						Object.keys(ngModel.$error)
							.filter(function (k) {
								return k.indexOf('schema-') === 0;
							})
							.forEach(function (k) {
								ngModel.$setValidity(k, true);
							});

						if (!result.valid) {
							ngModel.$setValidity('schema-' + result.error.code, false);

							// Build error messages through external parsers, if any:
							var message = result.error.message;
							_.forEach(schemaValidateConfig.messageParsers, function (parser) {
								angular.isFunction(parser) && (message = parser(schemaPath, viewValue, result.error, schema));
							});
							formControl.$errorMessage = message;

							// It is invalid, return undefined (no model update):
							return undefined;
						}
						return viewValue;
					};
					var revalidate = function () {
						if (ngModel.$setDirty) {
							// Angular 1.3+
							ngModel.$setDirty();
							validate(ngModel.$viewValue);
						} else {
							// Angular 1.2
							ngModel.$setViewValue(ngModel.$viewValue);
						}
					};
					// Get in last of the parses so the parsed value has the correct type.
					// We don't use $validators since we like to set different errors depending tv4 error codes
					ngModel.$parsers.push(validate);

					// Listen to an event so we can validate the form control on request:
					scope.$on('validationSchemaEvent', function () {
						revalidate();
					});
					// Listen to the translation change event and revalidate to force the language specific validation messages
					scope.$root.$on('$translateChangeSuccess', function() {
						// revalidate only in case of previous failure
						if (ngModel.$invalid) {
							revalidate();
						}
					});
				}
			}
		};
	});
}());
