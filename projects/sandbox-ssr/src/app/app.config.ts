import type {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration} from '@angular/platform-browser';
import {provideTranslateService} from '@ngx-translate/core';
import {multiTranslateLoader} from './shared/multi-translate-loader/multi-translate-loader.utils';
import {provideHttpClient, withFetch} from '@angular/common/http';

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes),
		provideHttpClient(withFetch()),
		provideTranslateService(multiTranslateLoader()),
		provideClientHydration()
	]
};
