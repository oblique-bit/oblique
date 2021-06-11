import {HttpClient} from '@angular/common/http';
import {InjectionToken, Optional, Provider} from '@angular/core';
import {TranslateLoader, TranslateModuleConfig} from '@ngx-translate/core';
import {ObMultiTranslateLoader, TRANSLATION_FILES} from './multi-translate-loader/multi-translate-loader';
import {ObITranslationFile} from './multi-translate-loader/multi-translate-loader.model';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldDefaultOptions} from '@angular/material/form-field';
import {MAT_CHECKBOX_DEFAULT_OPTIONS, MatCheckboxDefaultOptions} from '@angular/material/checkbox';
import {MAT_RADIO_DEFAULT_OPTIONS, MatRadioDefaultOptions} from '@angular/material/radio';
import {STEPPER_GLOBAL_OPTIONS, StepperOptions} from '@angular/cdk/stepper';
import {ObIBanner, ObIMaterialConfig} from './utilities.model';

export const WINDOW = new InjectionToken<Window>('Window');
export const OB_BANNER = new InjectionToken<ObIBanner>('Banner');

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
			prefix: './assets/i18n/oblique-',
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

export function checkboxOptionsProvider(config?: ObIMaterialConfig): MatCheckboxDefaultOptions {
	return config?.MAT_CHECKBOX_OPTIONS || {color: 'primary'};
}

export function radioOptionsProvider(config?: ObIMaterialConfig): MatRadioDefaultOptions {
	return config?.MAT_RADIO_OPTIONS || {color: 'primary'};
}

export const OB_MATERIAL_CONFIG = new InjectionToken<ObIMaterialConfig>('ObIMaterialConfig');

export function obliqueProviders(): Provider[] {
	return [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useFactory: matFormFieldDefaultOptionsProvider, deps: [[new Optional(), OB_MATERIAL_CONFIG]]},
		{provide: STEPPER_GLOBAL_OPTIONS, useFactory: stepperOptionsOptionsProvider, deps: [[new Optional(), OB_MATERIAL_CONFIG]]},
		{provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useFactory: checkboxOptionsProvider, deps: [[new Optional(), OB_MATERIAL_CONFIG]]},
		{provide: MAT_RADIO_DEFAULT_OPTIONS, useFactory: radioOptionsProvider, deps: [[new Optional(), OB_MATERIAL_CONFIG]]},
		// TODO add slideToggle with Angular 12
		{provide: WINDOW, useFactory: windowProvider}
	];
}
