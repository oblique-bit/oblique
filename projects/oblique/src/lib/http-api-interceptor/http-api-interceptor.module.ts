import {NgModule} from '@angular/core';
import {obliqueProviders} from '../utilities';

export {ObHttpApiInterceptorConfig} from './http-api-interceptor.config';
export {ObHttpApiInterceptorEvents} from './http-api-interceptor.events';
export {ObHttpApiInterceptor} from './http-api-interceptor';
export {ObIHttpApiRequest} from './http-api-interceptor.model';

@NgModule({
	providers: obliqueProviders()
})
export class ObHttpApiInterceptorModule {}
