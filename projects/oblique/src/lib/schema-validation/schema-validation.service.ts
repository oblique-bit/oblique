import {Injectable} from '@angular/core';
import {draft07Convert} from './draft07-converter.decorator';
import {ObSchemaValidatorInstance} from './schema-validator.instance';

@Injectable({providedIn: 'root'})
export class ObSchemaValidationService {
	@draft07Convert
	compileSchema(schema: any): ObSchemaValidatorInstance {
		return new ObSchemaValidatorInstance(schema);
	}
}
