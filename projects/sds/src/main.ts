import {AppComponent} from './app/app.component';
import {provideTranslateService} from '@ngx-translate/core';
import {ObIconModule, WINDOW, multiTranslateLoader} from '@oblique/oblique';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';
import {HttpApiInterceptor} from './app/shared/http-api-interceptor/http-api-interceptor';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {LOCALE_ID, importProvidersFrom} from '@angular/core';
import {PreloadAllModules, provideRouter, withPreloading} from '@angular/router';
import {APP_ROUTES} from './app.routes';
import {UploadInterceptor} from './app/code-examples/code-examples/file-upload/file-upload-simulate-interceptor';
import {provideMomentDateAdapter} from '@angular/material-moment-adapter';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MAT_CHECKBOX_DEFAULT_OPTIONS} from '@angular/material/checkbox';
import {MAT_RADIO_DEFAULT_OPTIONS} from '@angular/material/radio';
import {MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS} from '@angular/material/slide-toggle';
import {MAT_TABS_CONFIG} from '@angular/material/tabs';

export const uploadInterceptor = new UploadInterceptor();

bootstrapApplication(AppComponent, {
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}},
		{provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: {color: 'primary'}},
		{provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: {color: 'primary'}},
		{provide: MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS, useValue: {color: 'primary'}},
		{provide: MAT_TABS_CONFIG, useValue: {stretchTabs: false}},
		{provide: WINDOW, useValue: window},
		importProvidersFrom(ObIconModule.forRoot()),
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
		provideTranslateService(multiTranslateLoader()),
		provideRouter(APP_ROUTES, withPreloading(PreloadAllModules)),
		provideAnimations(),
		provideHttpClient(withInterceptorsFromDi())
	]
}).catch((err: unknown) => console.error(err));
