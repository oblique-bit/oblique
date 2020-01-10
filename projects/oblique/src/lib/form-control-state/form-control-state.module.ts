import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';

import {FormControlStateDirective} from './form-control-state.directive';
import {TelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {WINDOW, windowProvider} from '../utilities';

export {FormControlStateDirective} from './form-control-state.directive';

@NgModule({
	imports: [
		CommonModule,
		FormsModule
	],
	declarations: [FormControlStateDirective],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: WINDOW, useFactory: windowProvider}
	],
	exports: [FormControlStateDirective]
})
export class FormControlStateModule {
	constructor(telemetry: TelemetryService) {
		requireAndRecordTelemetry(telemetry, FormControlStateModule);
	}
}
