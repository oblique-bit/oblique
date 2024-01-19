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

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@NgModule({
	imports: [ObMockSchemaRequiredDirective, ObMockSchemaValidateDirective, ObMockSchemaValidationDirective],
	exports: [ObMockSchemaRequiredDirective, ObMockSchemaValidateDirective, ObMockSchemaValidationDirective],
	providers: [{provide: ObSchemaValidationService, useClass: ObMockSchemaValidationService}]
})
export class ObMockSchemaValidationModule {}
