import {ValidationSchemaDirectiveController} from './validation-schema-directive-controller';
/**
 * Adapted from: https://github.com/Textalk/angular-schema-form/blob/development/src/directives/schema-validate.js
 */
export class ValidationSchemaDirective implements ng.IDirective {
    restrict = 'A';
    require = ['^form'];
    scope = {};
    bindToController = {
        schema:'=validationSchema'
    };
    controller = ValidationSchemaDirectiveController;
    controllerAs = 'ctrl';
}