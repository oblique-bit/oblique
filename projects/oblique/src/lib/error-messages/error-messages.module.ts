import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

import {ObMatErrorDirective} from './mat-error.directive';
import {ObErrorMessagesDirective} from './error-messages.directive';
import {ObTranslateParamsModule} from '../translate-params/translate-params.module';
import {ObFormControlStateModule} from '../form-control-state/form-control-state.module';
import {ObErrorMessagesComponent} from './error-messages.component';
import {ObErrorMessagesService} from './error-messages.service';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {WINDOW, windowProvider} from '../utilities';

export {ObErrorMessagesComponent} from './error-messages.component';
export {ObErrorMessagesService} from './error-messages.service';
export {ObMatErrorDirective} from './mat-error.directive';
export {ObErrorMessagesDirective} from './error-messages.directive';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		TranslateModule,
		ObFormControlStateModule,
		ObTranslateParamsModule
	],
	declarations: [ObErrorMessagesComponent, ObMatErrorDirective, ObErrorMessagesDirective],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}},
		{provide: WINDOW, useFactory: windowProvider}
	],
	exports: [ObErrorMessagesComponent, ObMatErrorDirective, ObErrorMessagesDirective]
})
export class ObErrorMessagesModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObErrorMessagesModule);
	}
}
