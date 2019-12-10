import {NgModule} from '@angular/core';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material';
import {TelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {WINDOW, windowProvider} from '../utilities';

export {ObliqueHttpInterceptorConfig} from './oblique-http-interceptor.config';
export {ObliqueHttpInterceptorEvents} from './oblique-http-interceptor.events';
export {ObliqueHttpInterceptor, ObliqueRequest} from './oblique-http-interceptor';

@NgModule({
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: WINDOW, useFactory: windowProvider}
	]
})
export class ObliqueHttpModule {
	constructor(telemetry: TelemetryService) {
		requireAndRecordTelemetry(telemetry, ObliqueHttpModule);
	}
}
