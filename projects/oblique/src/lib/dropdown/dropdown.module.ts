import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {ObDropdownComponent} from './dropdown.component';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {WINDOW, windowProvider} from '../utilities';

export {ObDropdownComponent} from './dropdown.component';

@NgModule({
	imports: [CommonModule],
	declarations: [ObDropdownComponent],
	exports: [ObDropdownComponent],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }},
		{provide: WINDOW, useFactory: windowProvider}
	]
})
export class ObDropdownModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObDropdownModule);
	}
}
