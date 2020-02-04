import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {TranslateModule} from '@ngx-translate/core';

import {TextControlClearDirective} from './text-control-clear.directive';
import {TelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {WINDOW, windowProvider} from '../utilities';

export {TextControlClearDirective} from './text-control-clear.directive';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule,
		FormsModule
	],
	declarations: [
		TextControlClearDirective
	],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }},
		{provide: WINDOW, useFactory: windowProvider}
	],
	exports: [
		TextControlClearDirective
	]
})
export class TextControlClearModule {
	constructor(telemetry: TelemetryService) {
		requireAndRecordTelemetry(telemetry, TextControlClearModule);
	}
}
