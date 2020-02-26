import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {WINDOW, windowProvider} from '../utilities';
import {ObCollapseComponent} from './collapse.component';

export {ObCollapseComponent, OBLIQUE_COLLAPSE_ACTIVE} from './collapse.component';

@NgModule({
	imports: [CommonModule],
	declarations: [
		ObCollapseComponent
	],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: WINDOW, useFactory: windowProvider}
	],
	exports: [
		ObCollapseComponent
	]
})
export class ObCollapseModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObCollapseModule);
	}
}
