import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';

import {ToggleDirective} from './toggle.directive';
import {TelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {WINDOW, windowProvider} from '../utilities';

export {ToggleDirective} from './toggle.directive';

@NgModule({
	imports: [CommonModule],
	declarations: [ToggleDirective],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: WINDOW, useFactory: windowProvider}
	],
	exports: [ToggleDirective]
})
export class ToggleModule {
	constructor(telemetry: TelemetryService) {
		requireAndRecordTelemetry(telemetry, ToggleModule);
	}
}
