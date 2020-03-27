import {HttpClient} from '@angular/common/http';
import {InjectionToken, Optional} from '@angular/core';
import {TranslateLoader, TranslateModuleConfig} from '@ngx-translate/core';
import {ObMultiTranslateLoader, TRANSLATION_FILES, ObITranslationFile} from './multi-translate-loader/multi-translate-loader';

export const WINDOW = new InjectionToken<Window>('Window');

export function windowProvider(): Window {
	return window || ({} as Window);
}

export function multiTranslateLoader(config: TranslateModuleConfig = {}): TranslateModuleConfig {
	return {
		...config,
		loader: {
			provide: TranslateLoader,
			useFactory: getTranslateLoader,
			deps: [HttpClient, [new Optional(), TRANSLATION_FILES]]
		}
	};
}

export function getTranslateLoader(http: HttpClient, files: ObITranslationFile[]): ObMultiTranslateLoader {
	return new ObMultiTranslateLoader(http, [{prefix: './assets/styles/i18n/', suffix: '.json'}, ...(files || [{prefix: './assets/i18n/', suffix: '.json'}])]);
}
