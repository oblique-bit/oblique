import {Injectable} from '@angular/core';
import {SchemaValidatorInstance} from '../schema-validator.instance';

@Injectable()
export class MockSchemaValidationService {
	compileSchema(schema: any): SchemaValidatorInstance {
		return {} as SchemaValidatorInstance;
	}
}
