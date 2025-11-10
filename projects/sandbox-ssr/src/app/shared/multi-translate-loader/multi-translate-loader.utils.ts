import {HttpClient} from '@angular/common/http';
import {TranslateLoader, type TranslateModuleConfig} from '@ngx-translate/core';
import {ObMultiTranslateLoader} from './multi-translate-loader';

/**
 * Since Sandbox-SSR enforces stricter TypeScript rules than the Oblique library, it cannot import anything directly
 * from Oblique without causing numerous transpilation errors. Sandbox-SSR would apply its strict type checking to
 * Oblique’s code, which leads to these transpilation errors.
 * Therefore, the translation handling code must be duplicated within Sandbox-SSR to avoid these issues.
 */

function getTranslateLoader(http: HttpClient): ObMultiTranslateLoader {
	return new ObMultiTranslateLoader(http, [
		{
			prefix: './assets/i18n/oblique-',
			suffix: '.json',
		},
		...[{prefix: './assets/i18n/', suffix: '.json'}],
	]);
}

export function multiTranslateLoader(config: TranslateModuleConfig = {}): TranslateModuleConfig {
	return {
		...config,
		loader: {
			provide: TranslateLoader,
			useFactory: getTranslateLoader,
			deps: [HttpClient],
		},
	};
}
