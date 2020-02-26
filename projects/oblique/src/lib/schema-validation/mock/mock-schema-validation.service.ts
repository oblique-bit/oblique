import {Injectable} from '@angular/core';
import {ObSchemaValidatorInstance} from '../schema-validator.instance';

@Injectable()
export class ObMockSchemaValidationService {
	compileSchema(schema: any): ObSchemaValidatorInstance {
		return {} as ObSchemaValidatorInstance;
	}
}
