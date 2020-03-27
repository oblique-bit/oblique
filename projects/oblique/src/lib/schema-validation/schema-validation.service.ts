import {Injectable} from '@angular/core';
import {draft06} from './draft06.decorator';
import {ObSchemaValidatorInstance} from './schema-validator.instance';

@Injectable({providedIn: 'root'})
export class ObSchemaValidationService {
	@draft06
	compileSchema(schema: any): ObSchemaValidatorInstance {
		return new ObSchemaValidatorInstance(schema);
	}
}
