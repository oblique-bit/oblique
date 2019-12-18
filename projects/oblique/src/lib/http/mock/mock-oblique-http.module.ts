import {NgModule} from '@angular/core';
import {MockObliqueHttpInterceptor} from './mock-oblique-http-interceptor';
import {MockObliqueHttpInterceptorEvents} from './mock-oblique-http-interceptor.events';
import {MockObliqueHttpInterceptorConfig} from './mock-oblique-http-interceptor.config';
import {ObliqueHttpInterceptor, ObliqueHttpInterceptorConfig, ObliqueHttpInterceptorEvents} from '../oblique-http.module';

export {MockObliqueHttpInterceptor} from './mock-oblique-http-interceptor';
export {MockObliqueHttpInterceptorEvents} from './mock-oblique-http-interceptor.events';
export {MockObliqueHttpInterceptorConfig} from './mock-oblique-http-interceptor.config';

@NgModule({
	providers: [
		{provide: ObliqueHttpInterceptorConfig, useClass: MockObliqueHttpInterceptorConfig},
		{provide: ObliqueHttpInterceptorEvents, useClass: MockObliqueHttpInterceptorEvents},
		{provide: ObliqueHttpInterceptor, useClass: MockObliqueHttpInterceptor}
	]
})
export class MockObliqueHttpModule {
}
