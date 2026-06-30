import {NgModule} from '@angular/core';

import {ObSchemaRequiredDirective} from './schema-required.directive';
import {ObSchemaValidationDirective} from './schema-validation.directive';
import {ObSchemaValidateDirective} from './schema-validator';

@NgModule({
	imports: [ObSchemaRequiredDirective, ObSchemaValidateDirective, ObSchemaValidationDirective],
	exports: [ObSchemaRequiredDirective, ObSchemaValidateDirective, ObSchemaValidationDirective],
})
export class ObSchemaValidationModule {}
