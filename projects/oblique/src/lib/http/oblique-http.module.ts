import {NgModule} from '@angular/core';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material';

export {ObliqueHttpInterceptorConfig} from './oblique-http-interceptor.config';
export {ObliqueHttpInterceptorEvents} from './oblique-http-interceptor.events';
export {ObliqueHttpInterceptor, ObliqueRequest} from './oblique-http-interceptor';

@NgModule({
	providers: [{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}]
})
export class ObliqueHttpModule {
}
