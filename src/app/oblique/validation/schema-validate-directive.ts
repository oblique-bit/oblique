import {LogDecorator} from '../infrastructure/log-decorator';
import {SchemaValidatorService} from './schema-validator-service';
/**
 * Adapted from: https://github.com/Textalk/angular-schema-form/blob/development/src/directives/schema-validate.js
 */
export const SCHEMA_VALIDATE_CONFIG = {
    messageParsers: [] // [function(name, value, error, message) {/* ...*/ return message;}]
};

export class ValidationSchemaDirective implements ng.IDirective {
    restrict = 'A';
    require = ['^form'];
    scope = {};
    bindToController:{
        schema:'=validationSchema'
    };
    controller = ValidationSchemaDirectiveController;
}

export class ValidationSchemaDirectiveController {
    schema;

    /*@ngInject*/
    constructor($log:LogDecorator) {
        if (!this.schema || !angular.isObject(this.schema)) {
            $log.error('Provided schema could not be found or is invalid!');
        }
    }
}

export class ValidationBusinessDirective implements ng.IDirective {
    restrict = 'A';
    require = '^form';

    constructor(private $log:LogDecorator) {

    }

    link = (scope, element, attrs, form:ng.IFormController) => {
        scope.$on('validationBusinessEvent', (event, errors) => {
            _.forEach(errors || [], (error) => {
                let formKey = error.parent ? error.parent + (error.index ? '_' + error.index : '') : null;
                let targetForm = formKey ? form[formKey] : form;
                let formControl = targetForm[error.property || error.name];
                if (formControl) {
                    formControl.$setValidity('business', false);
                    formControl.$errorMessage = error.message;
                } else {
                    this.$log.warn('Unable to map business error with form control. Ignoring...', error);
                }
            });
        });
    }
}

export class SchemaValidateDirective implements ng.IDirective {

    restrict = 'A';
    // We want the link function to be *after* the input directives link function so we get access
    // the parsed value, ex. a number instead of a string
    priority = 1000;
    require = ['?ngModel', '^form', '^validationSchema'];

    constructor(private $log:LogDecorator,
                private $timeout:ng.ITimeoutService,
                private schemaValidator:SchemaValidatorService,
                private schemaValidateConfig) {
    }

    link = (scope, element, attrs, params) => {
        let ngModel = params[0];
        let form = params[1];
        let schema = params[2].schema;
        let name = attrs.name;

        if (!name) {
            this.$log.warn(`Schema validation cannot be attached to a form control without a 'name' attribute. Ignoring...`);
        } else if (!schema) {
            this.$log.warn(`Unable to retrieve validation schema for ${name}. Ignoring...`);
        } else {
            let schemaPath = _.map(name.split('_'), (part: string) => {
                return _.camelCase(part);
            }).join('.properties.');

            let formControl = form[name];

            // Check and activate mandatory indicator:
            let mandatory = this.isMandatory(name, schema);
            if (mandatory) {
                // Delay mandatory activation to another digest cycle in order to ensure that model has been assigned:
                this.$timeout(() => {
                    if (this.isModelEmpty(ngModel.$viewValue)) {
                        element.parent().addClass('control-mandatory');
                    }
                }, 0);
            }

            // Validate against the schema:
            let validate = (viewValue) => {

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

                let result:any = this.schemaValidator.validate(schema, schemaPath, viewValue);

                // Clear business errors, if any:
                ngModel.$setValidity('business', true);

                // Since we might have different schema errors we must clear all
                // errors that start with 'schema-':
                Object.keys(ngModel.$error)
                    .filter((k) => {
                        return k.indexOf('schema-') === 0;
                    })
                    .forEach((k) => {
                        ngModel.$setValidity(k, true);
                    });

                if (!result.valid) {
                    ngModel.$setValidity('schema-' + result.error.code, false);

                    // Build error messages through external parsers, if any:
                    let message = result.error.message;
                    _.forEach(this.schemaValidateConfig.messageParsers, (parser) => {
                        if (angular.isFunction(parser)) {
                            message = parser(schemaPath, viewValue, result.error, schema);
                        }
                    });
                    formControl.$errorMessage = message;

                    // It is invalid, return undefined (no model update):
                    return undefined;
                }
                return viewValue;
            };

            // Get in last of the parses so the parsed value has the correct type.
            // We don't use $validators since we like to set different errors depending tv4 error codes
            ngModel.$parsers.push(validate);

            // Listen to an event so we can validate the form control on request:
            scope.$on('validationSchemaEvent', () => {
                if (ngModel.$setDirty) {
                    // Angular 1.3+
                    ngModel.$setDirty();
                    validate(ngModel.$modelValue);
                } else {
                    // Angular 1.2
                    ngModel.$setViewValue(ngModel.$viewValue);
                }
            });
        }
    };

    private isMandatory(name, schema) {
        let dotIdx = name.indexOf('.');
        if (dotIdx !== -1) {
            return this.isMandatory(name.slice(dotIdx + 1), schema.properties[name.slice(0, dotIdx)]);
        }
        return angular.isArray(schema.required) && schema.required.indexOf(name.replace('_selectedCode', '')) !== -1;
    }


    private isModelEmpty(viewValue) {
        return angular.isUndefined(viewValue) || viewValue === null || viewValue === '';
    }


}

