import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

import {NavigatorComponent} from './navigator.component';
import {TelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {WINDOW, windowProvider} from '../utilities';

export {NavigatorComponent} from './navigator.component';
/**
 * @deprecated since version 4.0.0. This module is neither useful nor used and will be removed in future versions
 */
@NgModule({
	imports: [
		RouterModule
	],
	declarations: [
		NavigatorComponent
	],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }},
		{provide: WINDOW, useFactory: windowProvider}
	],
	exports: [
		NavigatorComponent
	]
})
export class NavigatorModule {
	constructor(telemetry: TelemetryService) {
		requireAndRecordTelemetry(telemetry, NavigatorModule);
	}
}

