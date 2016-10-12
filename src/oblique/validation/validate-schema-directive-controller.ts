import {LogDecorator} from '../infrastructure/log-decorator';

export class ValidateSchemaDirectiveController {
	schema;

	/*@ngInject*/
	constructor($log:LogDecorator) {
		if (!this.schema || !angular.isObject(this.schema)) {
			$log.error('Provided schema could not be found or is invalid!');
		}
	}
}
