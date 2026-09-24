import {HttpClient} from '@angular/common/http';
import {type RootTranslateServiceConfig, provideTranslateLoader} from '@ngx-translate/core';
import {ObMultiTranslateLoader} from './multi-translate-loader';
import {inject} from '@angular/core';

/**
 * Since Sandbox-SSR enforces stricter TypeScript rules than the Oblique library, it cannot import anything directly
 * from Oblique without causing numerous transpilation errors. Sandbox-SSR would apply its strict type checking to
 * Oblique’s code, which leads to these transpilation errors.
 * Therefore, the translation handling code must be duplicated within Sandbox-SSR to avoid these issues.
 */

function getTranslateLoader(): ObMultiTranslateLoader {
	return new ObMultiTranslateLoader(inject(HttpClient), [
		{
			prefix: './assets/i18n/oblique-',
			suffix: '.json',
		},
		...[{prefix: './assets/i18n/', suffix: '.json'}],
	]);
}

export function multiTranslateLoader(config: RootTranslateServiceConfig = {}): RootTranslateServiceConfig {
	return {
		...config,
		loader: provideTranslateLoader(getTranslateLoader),
	};
}
