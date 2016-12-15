import {LogDecorator} from '../../infrastructure/log-decorator';

/**
 * Directive controller for JSON v4 schema validation.
 *
 * @see http://json-schema.org/
 */
export class SchemaValidationDirectiveController implements ng.IComponentController {
	/**
	 * A JSON v4 schema as specified on http://json-schema.org/documentation.html.
	 */
	schema;

	/*@ngInject*/
	constructor(private $log:LogDecorator) {
	}

	$onInit() {
		if (!this.schema || !angular.isObject(this.schema)) {
			this.$log.error('Provided schema could not be found or is invalid!');
		}
	}
}
