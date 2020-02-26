import {NgModule} from '@angular/core';

import {ObSchemaValidationService} from '../schema-validation.module';
import {ObMockSchemaValidationDirective} from './mock-schema-validation.directive';
import {ObMockSchemaRequiredDirective} from './mock-schema-required.directive';
import {ObMockSchemaValidateDirective} from './mock-schema-validator';
import {ObMockSchemaValidationService} from './mock-schema-validation.service';

export {ObMockSchemaValidationDirective} from './mock-schema-validation.directive';
export {ObMockSchemaRequiredDirective} from './mock-schema-required.directive';
export {ObMockSchemaValidateDirective} from './mock-schema-validator';
export {ObMockSchemaValidationService} from './mock-schema-validation.service';

@NgModule({
	exports: [
		ObMockSchemaValidateDirective,
		ObMockSchemaValidationDirective,
		ObMockSchemaRequiredDirective
	],
	declarations: [
		ObMockSchemaValidateDirective,
		ObMockSchemaValidationDirective,
		ObMockSchemaRequiredDirective
	],
	providers: [
		{provide: ObSchemaValidationService, useClass: ObMockSchemaValidationService}
	]
})
export class ObMockSchemaValidationModule {
}
