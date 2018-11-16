import {NgModule} from '@angular/core';

import {ObliqueHttpInterceptorConfig} from './oblique-http-interceptor.config';
import {ObliqueHttpInterceptor} from './oblique-http-interceptor';

export {ObliqueHttpInterceptorConfig} from './oblique-http-interceptor.config';
export {ObliqueHttpInterceptor, ObliqueRequest} from './oblique-http-interceptor';

@NgModule()
export class ObliqueHttpModule {
}
