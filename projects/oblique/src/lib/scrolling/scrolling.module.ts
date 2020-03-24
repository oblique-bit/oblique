import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {TranslateModule} from '@ngx-translate/core';

import {ObTopControlComponent} from './top-control.component';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {WINDOW, windowProvider} from '../utilities';

export {ObTopControlComponent} from './top-control.component';
export {ObScrollingEvents} from './scrolling-events';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule
	],
	declarations: [ObTopControlComponent],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}},
		{provide: WINDOW, useFactory: windowProvider}
	],
	exports: [ObTopControlComponent]
})
export class ObScrollingModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObScrollingModule);
	}
}
