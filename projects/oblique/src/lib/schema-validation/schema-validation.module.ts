import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ObSchemaValidationDirective} from './schema-validation.directive';
import {ObSchemaValidateDirective} from './schema-validator';
import {ObSchemaRequiredDirective} from './schema-required.directive';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {obliqueProviders} from '../utilities';

export {ObSchemaValidationDirective} from './schema-validation.directive';
export {ObSchemaValidateDirective} from './schema-validator';
export {ObSchemaRequiredDirective} from './schema-required.directive';
export {ObSchemaValidationService} from './schema-validation.service';
export {ObSchemaValidatorInstance} from './schema-validator.instance';
export {draft07Convert} from './draft07-converter.decorator';

@NgModule({
	imports: [CommonModule],
	declarations: [ObSchemaValidateDirective, ObSchemaValidationDirective, ObSchemaRequiredDirective],
	providers: obliqueProviders(),
	exports: [ObSchemaValidateDirective, ObSchemaValidationDirective, ObSchemaRequiredDirective]
})
export class ObSchemaValidationModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObSchemaValidationModule);
	}
}
