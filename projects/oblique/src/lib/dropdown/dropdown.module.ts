import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {DropdownComponent} from './dropdown.component';
import {TelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {WINDOW, windowProvider} from '../utilities';

export {DropdownComponent} from './dropdown.component';

@NgModule({
	imports: [CommonModule],
	declarations: [DropdownComponent],
	exports: [DropdownComponent],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }},
		{provide: WINDOW, useFactory: windowProvider}
	]
})
export class DropdownModule {
	constructor(telemetry: TelemetryService) {
		requireAndRecordTelemetry(telemetry, DropdownModule);
	}
}
