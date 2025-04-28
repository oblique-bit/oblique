import {HttpClient} from '@angular/common/http';
import {TranslateLoader, type TranslateModuleConfig} from '@ngx-translate/core';
import {ObMultiTranslateLoader} from './multi-translate-loader';

function getTranslateLoader(http: HttpClient): ObMultiTranslateLoader {
	return new ObMultiTranslateLoader(http, [
		{
			prefix: './assets/i18n/oblique-',
			suffix: '.json'
		},
		...[{prefix: './assets/i18n/', suffix: '.json'}]
	]);
}

export function multiTranslateLoader(config: TranslateModuleConfig = {}): TranslateModuleConfig {
	return {
		...config,
		loader: {
			provide: TranslateLoader,
			useFactory: getTranslateLoader,
			deps: [HttpClient]
		}
	};
}
