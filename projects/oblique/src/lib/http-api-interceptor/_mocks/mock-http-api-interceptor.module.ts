import {NgModule} from '@angular/core';
import {ObMockHttpApiInterceptor} from './mock-http-api-interceptor';
import {ObMockHttpApiInterceptorEvents} from './mock-http-api-interceptor.events';
import {ObMockHttpApiInterceptorConfig} from './mock-http-api-interceptor.config';
import {ObHttpApiInterceptor, ObHttpApiInterceptorConfig, ObHttpApiInterceptorEvents} from '../';

export {ObMockHttpApiInterceptor} from './mock-http-api-interceptor';
export {ObMockHttpApiInterceptorEvents} from './mock-http-api-interceptor.events';
export {ObMockHttpApiInterceptorConfig} from './mock-http-api-interceptor.config';

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@NgModule({
	providers: [
		{provide: ObHttpApiInterceptorConfig, useClass: ObMockHttpApiInterceptorConfig},
		{provide: ObHttpApiInterceptorEvents, useClass: ObMockHttpApiInterceptorEvents},
		{provide: ObHttpApiInterceptor, useClass: ObMockHttpApiInterceptor}
	]
})
export class ObMockHttpApiInterceptorModule {}
