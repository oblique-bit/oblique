import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {StickyComponent} from './sticky.component';
import {TelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {WINDOW, windowProvider} from '../utilities';

export {StickyComponent}  from './sticky.component';

@NgModule({
	imports: [CommonModule],
	declarations: [StickyComponent],
	exports: [StickyComponent],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: WINDOW, useFactory: windowProvider}
	]
})
export class StickyModule {
	constructor(telemetry: TelemetryService) {
		requireAndRecordTelemetry(telemetry, StickyModule);
	}
}
