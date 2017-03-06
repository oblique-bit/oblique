import {LogDecorator} from '../../infrastructure/log-decorator';
import {SchemaValidatorService} from './schema-validator-service';

/**
 * Enables control validation as per JSON schema (needs to be provided by a parent).
 */
export class SchemaValidateDirective implements ng.IDirective {

	restrict = 'A';
	// We want the link function to be *after* the input directives link function so we get access
	// the parsed value, ex. a number instead of a string
	priority = 1000;
	require = ['?ngModel', '^form', '^schemaValidation'];

	constructor(private $log:LogDecorator,
	            private $timeout:ng.ITimeoutService,
	            private schemaValidator:SchemaValidatorService) {
	}

	link = (scope, element, attrs, params) => {
		let ngModel:ng.INgModelController = params[0];
		let form:ng.IFormController = params[1];
		let schema = params[2].schema;
		let name:string = attrs.name;

		if (!name) {
			this.$log.warn(`Schema validation cannot be attached to a form control without a 'name' attribute. Ignoring...`);
		} else if (!schema) {
			this.$log.warn(`Unable to retrieve validation schema for ${name}. Ignoring...`);
		} else {
			let propertyPath:string = _.map(name.split('_'), (part:string) => {
				return _.camelCase(part);
			}).join('.properties.');

			let formControl = form[name];

			// Check and activate mandatory indicator:
			let mandatory = this.isMandatory(name, schema);
			if (mandatory) {
				// Delay mandatory activation to another digest cycle in order to ensure that model has been assigned:
				this.$timeout(() => {
					if (this.isModelEmpty(formControl.$viewValue)) {
						element.parent().addClass('control-mandatory');
					}
				}, 0);
			}

			// Validate against the schema:
			let validate = (viewValue:any) => {

				// Omit TV4 validation
				if (scope.options && scope.options.tv4Validation === false) {
					return viewValue;
				}

				// Toggle the mandatory indicator:
				if (mandatory && !this.isModelEmpty(viewValue)) {
					element.parent().removeClass('control-mandatory');
				} else if (mandatory) {
					element.parent().addClass('control-mandatory');
				}

				let result:any = this.schemaValidator.validate(schema, propertyPath, viewValue);

				// Since we might have different schema errors we must clear all
				// errors that start with 'schema-':
				Object.keys(formControl.$error)
					.filter((k) => {
						return k.indexOf('schema-') === 0;
					})
					.forEach((k) => {
						formControl.$setValidity(k, true);
					});

				let errorId = propertyPath + '-schema-validation-error';
				let control = element.parent().find('[id="' + errorId + '"]');

				if (!result.valid) {
					formControl.$setValidity('schema-' + result.error.code, false);

					if (!control.length) {
						element.parent().append('<span id="' + errorId + '" class="help-block">' + result.error.message + '</span>');
					}

					// It is invalid, return undefined (no model update):
					return undefined;
				} else {
					control.remove();
				}
				return viewValue;
			};

			let revalidate = () => {
				formControl.$setDirty();
				validate(ngModel.$modelValue || ngModel.$viewValue);
			};

			// Get in last of the parses so the parsed value has the correct type.
			// We don't use $validators since we like to set different errors depending tv4 error codes
			formControl.$parsers.push(validate);

			// Listen to an event so we can validate the form control on request:
			scope.$on('schemaValidationEvent', revalidate);

			scope.$root.$on('$translateChangeSuccess', () => {
				if (formControl.$invalid) {
					revalidate();
				}
			});
		}
	};

	private isMandatory(name, schema) {
		let dotIdx = name.indexOf('.');
		if (dotIdx !== -1) {
			return this.isMandatory(name.slice(dotIdx + 1), schema.properties[name.slice(0, dotIdx)]);
		}
		return this.schemaValidator.isRequired(name, schema);
	}


	private isModelEmpty(viewValue) {
		return angular.isUndefined(viewValue) || viewValue === null || viewValue === '';
	}
}
