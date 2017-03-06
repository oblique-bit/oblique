import {SchemaValidatorService} from './schema-validator-service';
import {SchemaValidationConfig} from './schema-validation-config';
import {SchemaValidationDirective} from './schema-validation-directive';
import {SchemaValidateDirective} from './schema-validate-directive';

export const ORSchemaValidationModule = 'oblique-reactive.schemaValidation';

angular.module(ORSchemaValidationModule, [])
    .service('schemaValidator', SchemaValidatorService)
    .constant('schemaValidationConfig', new SchemaValidationConfig())
    .directive('schemaValidation', ()=> new SchemaValidationDirective())
    .directive('schemaValidate', ($log,
                                  $timeout: ng.ITimeoutService,
                                  schemaValidator: SchemaValidatorService) => new SchemaValidateDirective($log, $timeout, schemaValidator));