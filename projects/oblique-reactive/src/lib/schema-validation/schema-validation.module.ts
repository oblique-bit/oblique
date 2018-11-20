import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SchemaValidationDirective} from './schema-validation.directive';
import {SchemaValidateDirective} from './schema-validator';
import {SchemaRequiredDirective} from './schema-required.directive';
import {SchemaValidationService} from './schema-validation.service';

export {SchemaValidationDirective} from './schema-validation.directive';
export {SchemaValidateDirective} from './schema-validator';
export {SchemaRequiredDirective} from './schema-required.directive';
export {SchemaValidationService} from './schema-validation.service';
export {SchemaValidatorInstance} from './schema-validator.instance';
export {draft06} from './draft06.decorator';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [SchemaValidateDirective, SchemaValidationDirective, SchemaRequiredDirective],
	exports: [SchemaValidateDirective, SchemaValidationDirective, SchemaRequiredDirective]
})
export class SchemaValidationModule {
}
