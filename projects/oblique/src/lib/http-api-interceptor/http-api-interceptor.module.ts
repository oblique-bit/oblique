import {NgModule} from '@angular/core';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {TelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {WINDOW, windowProvider} from '../utilities';

export {HttpApiInterceptorConfig} from './http-api-interceptor.config';
export {HttpApiInterceptorEvents} from './http-api-interceptor.events';
export {HttpApiInterceptor, HttpApiRequest} from './http-api-interceptor';

@NgModule({
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }},
		{provide: WINDOW, useFactory: windowProvider}
	]
})
export class HttpApiInterceptorModule {
	constructor(telemetry: TelemetryService) {
		requireAndRecordTelemetry(telemetry, HttpApiInterceptorModule);
	}
}
