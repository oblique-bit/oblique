import {AppComponent} from './app/app.component';
import {provideObliqueConfiguration} from '@oblique/oblique';
import {bootstrapApplication} from '@angular/platform-browser';
import {HttpApiInterceptor} from './app/shared/http-api-interceptor/http-api-interceptor';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, withXhr} from '@angular/common/http';
import {LOCALE_ID, provideZoneChangeDetection} from '@angular/core';
import {PreloadAllModules, provideRouter, withPreloading} from '@angular/router';
import {appRoutes} from './app.routes';
import {UploadInterceptor} from './app/code-examples/code-examples/file-upload/file-upload-simulate-interceptor';
// provideDate is not public and not meant to be, but still necessary in SDS because provideObliqueConfiguration can't be used
import {obProvideDate} from '../../oblique/src/lib/language/date.provider';

export const uploadInterceptor = new UploadInterceptor();

bootstrapApplication(AppComponent, {
	providers: [
		provideZoneChangeDetection(),
		{provide: LOCALE_ID, useValue: 'en-CH'},
		obProvideDate(),
		{
			provide: HTTP_INTERCEPTORS,
			useValue: uploadInterceptor,
			multi: true,
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: HttpApiInterceptor,
			multi: true,
		},
		provideRouter(appRoutes, withPreloading(PreloadAllModules)),
		provideHttpClient(withXhr(), withInterceptorsFromDi()),
		provideObliqueConfiguration({
			accessibilityStatement: {
				applicationName: 'SDS',
				applicationOperator: 'Federal Office of Information Technology, Systems and Telecommunication FOITT',
				conformity: 'full',
				contact: [{url: 'https://oblique.bit.admin.ch'}],
				createdOn: new Date(),
			},
			translate: {
				locales: {
					locales: ['en'],
					defaultLanguage: 'en',
					disabled: false,
					languages: {
						en: 'English',
					},
				},
			},
		}),
	],
}).catch((err: unknown) => console.error(err));
