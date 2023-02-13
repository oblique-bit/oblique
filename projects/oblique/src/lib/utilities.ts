import {HttpClient} from '@angular/common/http';
import {InjectionToken, Optional, Provider} from '@angular/core';
import {DOCUMENT} from '@angular/common';
import {ActivatedRoute} from '@angular/router';
import {TranslateLoader, TranslateModuleConfig} from '@ngx-translate/core';
import {ObMultiTranslateLoader, TRANSLATION_FILES} from './multi-translate-loader/multi-translate-loader';
import {ObITranslationFile} from './multi-translate-loader/multi-translate-loader.model';
import {
	MAT_LEGACY_FORM_FIELD_DEFAULT_OPTIONS as MAT_FORM_FIELD_DEFAULT_OPTIONS,
	MatLegacyFormFieldDefaultOptions as MatFormFieldDefaultOptions
} from '@angular/material/legacy-form-field';
import {
	MAT_LEGACY_CHECKBOX_DEFAULT_OPTIONS as MAT_CHECKBOX_DEFAULT_OPTIONS,
	MatLegacyCheckboxDefaultOptions as MatCheckboxDefaultOptions
} from '@angular/material/legacy-checkbox';
import {
	MAT_LEGACY_RADIO_DEFAULT_OPTIONS as MAT_RADIO_DEFAULT_OPTIONS,
	MatLegacyRadioDefaultOptions as MatRadioDefaultOptions
} from '@angular/material/legacy-radio';
import {
	MAT_LEGACY_SLIDE_TOGGLE_DEFAULT_OPTIONS as MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS,
	MatLegacySlideToggleDefaultOptions as MatSlideToggleDefaultOptions
} from '@angular/material/legacy-slide-toggle';
import {STEPPER_GLOBAL_OPTIONS, StepperOptions} from '@angular/cdk/stepper';
import {ObIBanner, ObIMaterialConfig, ObIPamsConfiguration} from './utilities.model';

export const WINDOW = new InjectionToken<Window>('Window');
export const OB_BANNER = new InjectionToken<ObIBanner>('Banner');
export const OB_ACTIVATE_SERVICE_NAVIGATION = new InjectionToken<boolean>(
	'Indicates whether or not the service navigation component should be used instead of the header controls area.'
);
export const OB_PAMS_CONFIGURATION = new InjectionToken<ObIPamsConfiguration>(
	'Provides the mandatory PAMS environment as well as an optional root url. This is only useful when OB_ACTIVATE_SERVICE_NAVIGATION is enabled.'
);

export function windowProvider(doc: Document): Window {
	return doc.defaultView || ({} as Window);
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

export function slideToggleOptionsProvider(config?: ObIMaterialConfig): MatSlideToggleDefaultOptions {
	return config?.MAT_SLIDE_TOGGLE_OPTIONS || {color: 'primary'};
}

export const OB_MATERIAL_CONFIG = new InjectionToken<ObIMaterialConfig>('ObIMaterialConfig');

export function obliqueProviders(): Provider[] {
	return [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useFactory: matFormFieldDefaultOptionsProvider, deps: [[new Optional(), OB_MATERIAL_CONFIG]]},
		{provide: STEPPER_GLOBAL_OPTIONS, useFactory: stepperOptionsOptionsProvider, deps: [[new Optional(), OB_MATERIAL_CONFIG]]},
		{provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useFactory: checkboxOptionsProvider, deps: [[new Optional(), OB_MATERIAL_CONFIG]]},
		{provide: MAT_RADIO_DEFAULT_OPTIONS, useFactory: radioOptionsProvider, deps: [[new Optional(), OB_MATERIAL_CONFIG]]},
		{provide: MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS, useFactory: slideToggleOptionsProvider, deps: [[new Optional(), OB_MATERIAL_CONFIG]]},
		{provide: WINDOW, useFactory: windowProvider, deps: [DOCUMENT]}
	];
}

// as the Enter key on a button triggers both the click an keyup events, lets ensure the function is called only once
export function isNotKeyboardEventOnButton(event: MouseEvent | KeyboardEvent): boolean {
	return !event || event instanceof MouseEvent || (event.target as HTMLElement).nodeName !== 'BUTTON';
}

export function getRootRoute(route: ActivatedRoute): ActivatedRoute {
	return route.firstChild ? getRootRoute(route.firstChild) : route;
}
