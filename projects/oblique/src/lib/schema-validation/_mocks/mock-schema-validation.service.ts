import {Injectable} from '@angular/core';
import {ObSchemaValidatorInstance} from '../schema-validator.instance';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@Injectable()
export class ObMockSchemaValidationService {
	compileSchema(schema: any): ObSchemaValidatorInstance {
		return {} as ObSchemaValidatorInstance;
	}
}
