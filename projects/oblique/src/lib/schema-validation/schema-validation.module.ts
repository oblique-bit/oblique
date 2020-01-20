import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';

import {SchemaValidationDirective} from './schema-validation.directive';
import {SchemaValidateDirective} from './schema-validator';
import {SchemaRequiredDirective} from './schema-required.directive';
import {SchemaValidationService} from './schema-validation.service';
import {TelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {WINDOW, windowProvider} from '../utilities';


export {SchemaValidationDirective} from './schema-validation.directive';
export {SchemaValidateDirective} from './schema-validator';
export {SchemaRequiredDirective} from './schema-required.directive';
export {SchemaValidationService} from './schema-validation.service';
export {SchemaValidatorInstance} from './schema-validator.instance';
export {draft06} from './draft06.decorator';

@NgModule({
	imports: [CommonModule],
	declarations: [SchemaValidateDirective, SchemaValidationDirective, SchemaRequiredDirective],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: WINDOW, useFactory: windowProvider}
	],
	exports: [SchemaValidateDirective, SchemaValidationDirective, SchemaRequiredDirective]
})
export class SchemaValidationModule {
	constructor(telemetry: TelemetryService) {
		requireAndRecordTelemetry(telemetry, SchemaValidationModule);
	}
}
