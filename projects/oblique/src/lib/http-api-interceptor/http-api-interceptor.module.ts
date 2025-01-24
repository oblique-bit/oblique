import {NgModule} from '@angular/core';

export {ObHttpApiInterceptorConfig} from './http-api-interceptor.config';
export {ObHttpApiInterceptorEvents} from './http-api-interceptor.events';
export {ObHttpApiInterceptor} from './http-api-interceptor';
export {ObIHttpApiRequest} from './http-api-interceptor.model';

/**
 * Deprecated since Oblique 13.0.0. As this module is now empty and does absolutely nothing, it can safely be removed
 */
@NgModule()
export class ObHttpApiInterceptorModule {}
