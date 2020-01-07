import {HttpClient} from '@angular/common/http';
import {InjectionToken} from '@angular/core';
import {TranslateLoader, TranslateModuleConfig} from '@ngx-translate/core';
import {MultiTranslateLoader} from './multi-translate-loader/multi-translate-loader';

export const WINDOW = new InjectionToken<Window>('Window');

export function windowProvider(): Window {
	return window || {} as Window;
}

export function multiTranslateLoader(
	files: { prefix: string, suffix: string }[] = [{prefix: './assets/i18n/', suffix: '.json'}],
	config: TranslateModuleConfig = {}
): TranslateModuleConfig {
	return {
		...config,
		loader: {
			provide: TranslateLoader,
			useFactory: (http: HttpClient) => new MultiTranslateLoader(http, [
				{prefix: './assets/styles/i18n/', suffix: '.json'},
				...files
			]),
			deps: [HttpClient]
		}
	};
}
