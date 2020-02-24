import {NgModule} from '@angular/core';
import {MockHttpApiInterceptor} from './mock-http-api-interceptor';
import {MockHttpApiInterceptorEvents} from './mock-http-api-interceptor.events';
import {MockHttpApiInterceptorConfig} from './mock-http-api-interceptor.config';
import {HttpApiInterceptor, HttpApiInterceptorConfig, HttpApiInterceptorEvents} from '../http-api-interceptor.module';

export {MockHttpApiInterceptor} from './mock-http-api-interceptor';
export {MockHttpApiInterceptorEvents} from './mock-http-api-interceptor.events';
export {MockHttpApiInterceptorConfig} from './mock-http-api-interceptor.config';

@NgModule({
	providers: [
		{provide: HttpApiInterceptorConfig, useClass: MockHttpApiInterceptorConfig},
		{provide: HttpApiInterceptorEvents, useClass: MockHttpApiInterceptorEvents},
		{provide: HttpApiInterceptor, useClass: MockHttpApiInterceptor}
	]
})
export class MockHttpApiInterceptorModule {
}
