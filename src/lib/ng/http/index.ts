export * from './oblique-http.module';
export * from './oblique-http-interceptor';
export * from './oblique-http-interceptor.config';

import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { ObliqueHttpInterceptor } from './oblique-http-interceptor';

/** Http interceptor providers in outside-in order */
export const ObliqueHttpInterceptorProviders = [
	{
		provide: HTTP_INTERCEPTORS,
		useClass:
		ObliqueHttpInterceptor,
		multi: true
	}
];
