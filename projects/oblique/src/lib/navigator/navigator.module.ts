import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material';

import {NavigatorComponent} from './navigator.component';
import {TelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {WINDOW, windowProvider} from '../utilities';

export {NavigatorComponent} from './navigator.component';

@NgModule({
	imports: [
		RouterModule
	],
	declarations: [
		NavigatorComponent
	],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
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

