import {SchemaValidationDirectiveController} from './schema-validation-directive-controller';

/**
 * Adapted from: https://github.com/Textalk/angular-schema-form/blob/development/src/directives/schema-validate.js
 */
export class SchemaValidationDirective implements ng.IDirective {
	restrict = 'A';
	require = ['^form'];
	scope = {};
	bindToController = {
		schema: '=schemaValidation'
	};
	controller = SchemaValidationDirectiveController;
	controllerAs = 'orSchemaValidationCtrl';
}
