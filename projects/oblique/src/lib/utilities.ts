import {HttpClient} from '@angular/common/http';
import {InjectionToken} from '@angular/core';
import {MultiTranslateHttpLoader} from 'ngx-translate-multi-http-loader';

export function createTranslateLoader(http: HttpClient) {
	return new MultiTranslateHttpLoader(http, [
		{prefix: './assets/i18n/', suffix: '.json'},
		{prefix: './assets/styles/i18n/', suffix: '.json'},
	]);
}

export const WINDOW = new InjectionToken<Window>('Window');

export function windowProvider(): Window {
	return window || {} as Window;
}
