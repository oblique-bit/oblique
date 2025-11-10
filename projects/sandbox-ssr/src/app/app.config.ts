import type {ApplicationConfig} from '@angular/core';
import {provideRouter} from '@angular/router';

import {routes} from './app.routes';
import {provideClientHydration} from '@angular/platform-browser';
import {provideTranslateService} from '@ngx-translate/core';
import {provideHttpClient, withFetch} from '@angular/common/http';
/**
 * Since Sandbox-SSR enforces stricter TypeScript rules than the Oblique library, it cannot import anything directly
 * from Oblique without causing numerous transpilation errors. Sandbox-SSR would apply its strict type checking to
 * Oblique’s code, which leads to these transpilation errors.
 * Therefore, the translation handling code must be duplicated within Sandbox-SSR to avoid these issues.
 */
import {multiTranslateLoader} from './shared/multi-translate-loader/multi-translate-loader.utils';

export const appConfig: ApplicationConfig = {
	providers: [
		provideRouter(routes),
		provideHttpClient(withFetch()),
		provideTranslateService(multiTranslateLoader()),
		provideClientHydration(),
	],
};
