import {Injectable} from '@angular/core';
import {ObSchemaValidatorInstance} from '../schema-validator.instance';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Injectable()
export class ObMockSchemaValidationService {
	compileSchema(schema: any): ObSchemaValidatorInstance {
		return {} as ObSchemaValidatorInstance;
	}
}
