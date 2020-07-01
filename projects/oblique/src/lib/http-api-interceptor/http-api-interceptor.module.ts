import {NgModule} from '@angular/core';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {obliqueProviders} from '../utilities';

export {ObHttpApiInterceptorConfig} from './http-api-interceptor.config';
export {ObHttpApiInterceptorEvents} from './http-api-interceptor.events';
export {ObHttpApiInterceptor} from './http-api-interceptor';
export {ObIHttpApiRequest} from './http-api-interceptor.events';

@NgModule({
	providers: obliqueProviders()
})
export class ObHttpApiInterceptorModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObHttpApiInterceptorModule);
	}
}
