import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

import {ObSchemaValidationDirective} from './schema-validation.directive';
import {ObSchemaValidateDirective} from './schema-validator';
import {ObSchemaRequiredDirective} from './schema-required.directive';
import {ObSchemaValidationService} from './schema-validation.service';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {WINDOW, windowProvider} from '../utilities';

export {ObSchemaValidationDirective} from './schema-validation.directive';
export {ObSchemaValidateDirective} from './schema-validator';
export {ObSchemaRequiredDirective} from './schema-required.directive';
export {ObSchemaValidationService} from './schema-validation.service';
export {ObSchemaValidatorInstance} from './schema-validator.instance';
export {draft06} from './draft06.decorator';

@NgModule({
	imports: [CommonModule],
	declarations: [ObSchemaValidateDirective, ObSchemaValidationDirective, ObSchemaRequiredDirective],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }},
		{provide: WINDOW, useFactory: windowProvider}
	],
	exports: [ObSchemaValidateDirective, ObSchemaValidationDirective, ObSchemaRequiredDirective]
})
export class ObSchemaValidationModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObSchemaValidationModule);
	}
}
