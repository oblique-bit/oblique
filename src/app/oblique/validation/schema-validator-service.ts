// fixme Workaround
import {SchemaValidateConfig} from './schema-validate-config';
declare var tv4 : any;

/**
 * Adapted from: https://github.com/Textalk/angular-schema-form/blob/development/src/services/validator.js
 */
export class SchemaValidatorService {

    /*@ngInject*/
    constructor (private $translate:ng.translate.ITranslateService,
                 public schemaValidateConfig:SchemaValidateConfig) {
        if(schemaValidateConfig.customErrorReporter) {
            tv4.setErrorReporter(schemaValidateConfig.customErrorReporter);
        }
    }

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
    validate(schema, propName:string, value:any) {
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

        wrap.properties[propName] = _.result(schema.properties, propName);
        if (angular.isArray(schema.required) && schema.required.indexOf(propName) !== -1) {
            wrap.required = [propName];
        } else {
            // Normalize empty values for optional properties:
            /*if(wrap.properties[propName].format === 'date-time' && value === null) {
             value = '';
             } else if (wrap.properties[propName].type === 'integer' && value === null) {
             value = undefined;
             }*/
        }

        let valueWrap = {};
        if (angular.isDefined(value)) {
            valueWrap[propName] = value;
        }
        tv4.language(this.$translate.use());
        //TODO: use this instead of the messageParsers? We can add custom messages
        /*tv4.setErrorReporter((error, data, scema) => {
            return 'Error code: ' + error.code;
        });*/
        return tv4.validateResult(valueWrap, wrap);
    }
}
