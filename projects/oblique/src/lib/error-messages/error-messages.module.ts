import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

import {MatErrorDirective} from './mat-error.directive';
import {ErrorMessagesDirective} from './error-messages.directive';
import {TranslateParamsModule} from '../translate-params/translate-params.module';
import {FormControlStateModule} from '../form-control-state/form-control-state.module';
import {ErrorMessagesComponent} from './error-messages.component';
import {ErrorMessagesService} from './error-messages.service';
import {TelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {WINDOW, windowProvider} from '../utilities';

export {ErrorMessagesComponent} from './error-messages.component';
export {ErrorMessagesService} from './error-messages.service';
export {MatErrorDirective} from './mat-error.directive';
export {ErrorMessagesDirective} from './error-messages.directive';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		TranslateModule,
		FormControlStateModule,
		TranslateParamsModule
	],
	declarations: [ErrorMessagesComponent, MatErrorDirective, ErrorMessagesDirective],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: WINDOW, useFactory: windowProvider}
	],
	exports: [ErrorMessagesComponent, MatErrorDirective, ErrorMessagesDirective]
})
export class ErrorMessagesModule {
	constructor(telemetry: TelemetryService) {
		requireAndRecordTelemetry(telemetry, ErrorMessagesModule);
	}
}
