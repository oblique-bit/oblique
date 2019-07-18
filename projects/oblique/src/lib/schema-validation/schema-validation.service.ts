import {Injectable} from '@angular/core';
import {draft06} from './draft06.decorator';
import {SchemaValidatorInstance} from './schema-validator.instance';

@Injectable({providedIn: 'root'})
export class SchemaValidationService {

	@draft06
	compileSchema(schema: any): SchemaValidatorInstance {
		return new SchemaValidatorInstance(schema);
	}
}
