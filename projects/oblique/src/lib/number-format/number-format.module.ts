import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material';

import {NumberFormatDirective} from './number-format.directive';
import { TelemetryService } from '../telemetry/telemetry.service';
import { requireAndRecordTelemetry } from '../telemetry/telemetry-require';

export {NumberFormatDirective} from './number-format.directive';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [NumberFormatDirective],
	providers: [{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}],
	exports: [NumberFormatDirective]
})
export class NumberFormatModule {
	constructor(telemetry: TelemetryService) {
		requireAndRecordTelemetry(telemetry, NumberFormatModule);
	}
}
