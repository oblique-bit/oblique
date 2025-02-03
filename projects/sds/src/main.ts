import {AppComponent} from './app/app.component';
import {provideObliqueConfiguration} from '@oblique/oblique';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';
import {HttpApiInterceptor} from './app/shared/http-api-interceptor/http-api-interceptor';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {LOCALE_ID} from '@angular/core';
import {PreloadAllModules, provideRouter, withPreloading} from '@angular/router';
import {APP_ROUTES} from './app.routes';
import {UploadInterceptor} from './app/code-examples/code-examples/file-upload/file-upload-simulate-interceptor';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';

export const uploadInterceptor = new UploadInterceptor();

bootstrapApplication(AppComponent, {
	providers: [
		{provide: LOCALE_ID, useValue: 'en-CH'},
		provideMomentDateAdapter({
			parse: {
				dateInput: 'DD.MM.YYYY'
			},
			display: {
				dateInput: 'DD.MM.YYYY',
				monthYearLabel: 'MMM YYYY',
				dateA11yLabel: 'LL',
				monthYearA11yLabel: 'MMMM YYYY'
			}
		}),
		{
			provide: HTTP_INTERCEPTORS,
			useValue: uploadInterceptor,
			multi: true
		},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: HttpApiInterceptor,
			multi: true
		},
		provideRouter(APP_ROUTES, withPreloading(PreloadAllModules)),
		provideAnimations(),
		provideHttpClient(withInterceptorsFromDi()),
		provideObliqueConfiguration()
	]
}).catch((err: unknown) => console.error(err));
