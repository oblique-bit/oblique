import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

import {SpinnerComponent} from './spinner.component';
import {SpinnerService} from './spinner.service';
import {TelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {WINDOW, windowProvider} from '../utilities';

export {SpinnerComponent} from './spinner.component';
export {SpinnerService} from './spinner.service';
export {SpinnerEvent} from './spinner-event';

@NgModule({
	imports: [CommonModule],
	declarations: [SpinnerComponent],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }},
		{provide: WINDOW, useFactory: windowProvider}
	],
	exports: [SpinnerComponent]
})
export class SpinnerModule {
	constructor(telemetry: TelemetryService) {
		requireAndRecordTelemetry(telemetry, SpinnerModule);
	}
}
