import {NgModule} from '@angular/core';

import {obliqueProviders} from '../utilities';
import {ObSchemaRequiredDirective} from './schema-required.directive';
import {ObSchemaValidationDirective} from './schema-validation.directive';
import {ObSchemaValidateDirective} from './schema-validator';

export {draft07Convert} from './draft07-converter.decorator';
export {ObSchemaRequiredDirective} from './schema-required.directive';
export {ObSchemaValidationDirective} from './schema-validation.directive';
export {ObSchemaValidationService} from './schema-validation.service';
export {ObSchemaValidateDirective} from './schema-validator';
export {ObSchemaValidatorInstance} from './schema-validator.instance';

@NgModule({
	imports: [ObSchemaRequiredDirective, ObSchemaValidateDirective, ObSchemaValidationDirective],
	providers: obliqueProviders(),
	exports: [ObSchemaRequiredDirective, ObSchemaValidateDirective, ObSchemaValidationDirective]
})
export class ObSchemaValidationModule {}
