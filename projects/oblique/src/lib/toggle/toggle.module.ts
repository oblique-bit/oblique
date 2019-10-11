import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material';

import {ToggleDirective} from './toggle.directive';
import { TelemetryService } from '../telemetry/telemetry.service';
import { requireAndRecordTelemetry } from '../telemetry/telemetry-require';

export {ToggleDirective} from './toggle.directive';

@NgModule({
	imports: [CommonModule],
	declarations: [ToggleDirective],
	providers: [{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}],
	exports: [ToggleDirective]
})
export class ToggleModule {
	constructor(telemetry: TelemetryService) {
		requireAndRecordTelemetry(telemetry, ToggleModule);
	}
}
