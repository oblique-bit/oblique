import {HttpClient} from '@angular/common/http';
import {InjectionToken, Optional, Provider} from '@angular/core';
import {TranslateLoader, TranslateModuleConfig} from '@ngx-translate/core';
import {ObITranslationFile, ObMultiTranslateLoader, TRANSLATION_FILES} from './multi-translate-loader/multi-translate-loader';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions} from '@angular/material/form-field';
import {STEPPER_GLOBAL_OPTIONS, StepperOptions} from '@angular/cdk/stepper';

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
	return new ObMultiTranslateLoader(http, [
		{
			prefix: './assets/styles/i18n/',
			suffix: '.json'
		},
		...(files || [{prefix: './assets/i18n/', suffix: '.json'}])
	]);
}

export function matFormFieldDefaultOptionsProvider(config?: ObIMaterialConfig): MatFormFieldDefaultOptions {
	return config?.MAT_FORM_FIELD_DEFAULT_OPTIONS || {appearance: 'outline'};
}

export function stepperOptionsOptionsProvider(config?: ObIMaterialConfig): StepperOptions {
	return config?.STEPPER_GLOBAL_OPTIONS || {displayDefaultIndicatorType: false};
}

export interface ObIMaterialConfig {
	MAT_FORM_FIELD_DEFAULT_OPTIONS?: MatFormFieldDefaultOptions;
	STEPPER_GLOBAL_OPTIONS?: StepperOptions;
}

export const OB_MATERIAL_CONFIG = new InjectionToken<ObIMaterialConfig>('ObIMaterialConfig');

export function obliqueProviders(): Provider[] {
	return [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useFactory: matFormFieldDefaultOptionsProvider, deps: [[new Optional(), OB_MATERIAL_CONFIG]]},
		{provide: STEPPER_GLOBAL_OPTIONS, useFactory: stepperOptionsOptionsProvider, deps: [[new Optional(), OB_MATERIAL_CONFIG]]},
		{provide: WINDOW, useFactory: windowProvider}
	];
}
