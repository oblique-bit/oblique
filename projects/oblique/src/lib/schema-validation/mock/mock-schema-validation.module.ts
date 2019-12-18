import {NgModule} from '@angular/core';

import {SchemaValidationService} from '../schema-validation.module';
import {MockSchemaValidationDirective} from './mock-schema-validation.directive';
import {MockSchemaRequiredDirective} from './mock-schema-required.directive';
import {MockSchemaValidateDirective} from './mock-schema-validator';
import {MockSchemaValidationService} from './mock-schema-validation.service';

export {MockSchemaValidationDirective} from './mock-schema-validation.directive';
export {MockSchemaRequiredDirective} from './mock-schema-required.directive';
export {MockSchemaValidateDirective} from './mock-schema-validator';
export {MockSchemaValidationService} from './mock-schema-validation.service';

@NgModule({
	exports: [
		MockSchemaValidateDirective,
		MockSchemaValidationDirective,
		MockSchemaRequiredDirective
	],
	declarations: [
		MockSchemaValidateDirective,
		MockSchemaValidationDirective,
		MockSchemaRequiredDirective
	],
	providers: [
		{provide: SchemaValidationService, useClass: MockSchemaValidationService}
	]
})
export class MockSchemaValidationModule {
}
