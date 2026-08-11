import {InjectionToken, Provider} from '@angular/core';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {ObIPamsConfiguration} from './service-navigation.model';
import {ObEportalCsrfInterceptor} from './eportal-csrf-interceptor/eportal-csrf-interceptor';

/**
 * @deprecated since 16.0.0, will be removed with version 17. Use provideObliqueConfiguration.pams instead
 */
export const OB_PAMS_CONFIGURATION = new InjectionToken<ObIPamsConfiguration>(
	'Provides the mandatory PAMS environment as well as an optional root url.'
);

export function obProvideServiceNavigation(pamsConfig: ObIPamsConfiguration | undefined): Provider[] {
	return pamsConfig
		? [
				{provide: OB_PAMS_CONFIGURATION, useValue: pamsConfig},
				{
					provide: HTTP_INTERCEPTORS,
					useClass: ObEportalCsrfInterceptor,
					multi: true,
				},
			]
		: [];
}
