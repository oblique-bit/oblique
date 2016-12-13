import {LogDecorator} from '../../infrastructure/log-decorator';

/**
 * Directive controller for JSON v4 schema vaqlidation.
 *
 * @see http://json-schema.org/
 */
export class SchemaValidationDirectiveController {
	/**
	 * A JSON v4 schema as specified on http://json-schema.org/documentation.html.
	 */
	schema;

	/*@ngInject*/
	constructor($log:LogDecorator) {
		if (!this.schema || !angular.isObject(this.schema)) {
			$log.error('Provided schema could not be found or is invalid!');
		}
	}
}
