import {NgModule, ModuleWithProviders} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SchemaValidationDirective} from './schema-validation.directive';
import {SchemaValidateDirective} from './schema-validator';
import {SchemaRequiredDirective} from './schema-required.directive';
import {SchemaValidationService} from './schema-validation.service';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [SchemaValidateDirective, SchemaValidationDirective, SchemaRequiredDirective],
	exports: [SchemaValidateDirective, SchemaValidationDirective, SchemaRequiredDirective]
})
export class SchemaValidationModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: SchemaValidationModule,
			providers: [SchemaValidationService]
		};
	}
}
