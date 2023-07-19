import {AppComponent} from './app/app.component';
import {TranslateModule} from '@ngx-translate/core';
import {ObIconModule, multiTranslateLoader} from '@oblique/oblique';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideAnimations} from '@angular/platform-browser/animations';
import {HttpApiInterceptor} from './app/shared/http-api-interceptor/http-api-interceptor';
import {HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {LOCALE_ID, importProvidersFrom} from '@angular/core';
import {PreloadAllModules, provideRouter, withPreloading} from '@angular/router';
import {APP_ROUTES} from './app.routes';

bootstrapApplication(AppComponent, {
	providers: [
		importProvidersFrom(ObIconModule.forRoot(), TranslateModule.forRoot(multiTranslateLoader())),
		{provide: LOCALE_ID, useValue: 'en-US'},
		{
			provide: HTTP_INTERCEPTORS,
			useClass: HttpApiInterceptor,
			multi: true
		},
		provideRouter(APP_ROUTES, withPreloading(PreloadAllModules)),
		provideAnimations(),
		provideHttpClient(withInterceptorsFromDi())
	]
}).catch(err => console.error(err));
