import {HttpClient} from '@angular/common/http';
import {DOCUMENT, EnvironmentProviders, InjectionToken, inject, makeEnvironmentProviders, provideAppInitializer} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TranslateLoader, provideTranslateService} from '@ngx-translate/core';
import {ObMultiTranslateLoader} from './multi-translate-loader/multi-translate-loader';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {MAT_CHECKBOX_DEFAULT_OPTIONS} from '@angular/material/checkbox';
import {MAT_RADIO_DEFAULT_OPTIONS} from '@angular/material/radio';
import {MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS} from '@angular/material/slide-toggle';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {
	ObIAccessibilityStatementConfiguration,
	ObIBanner,
	ObIObliqueConfiguration,
	ObIPamsConfiguration,
	ObITranslateConfig,
	ObITranslateConfigInternal
} from './utilities.model';
import {MAT_TABS_CONFIG} from '@angular/material/tabs';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {ObPaginatorService} from './paginator/ob-paginator.service';
import {ObTIconConfig, defaultIconConfig} from './icon/icon.model';
import {ObIconService} from './icon/icon.service';
import {MatStepperIntl} from '@angular/material/stepper';
import {ObStepperIntlService} from './stepper/ob-stepper.service';
import {MatDatepickerIntl} from '@angular/material/datepicker';
import {ObDatepickerIntlService} from './datepicker/ob-datepicker.service';
import {ObRouterService} from '../lib/router/ob-router.service';

export const WINDOW = new InjectionToken<Window>('Window');
export const OB_BANNER = new InjectionToken<ObIBanner>('Banner');
export const OB_TRANSLATION_CONFIGURATION = new InjectionToken<ObITranslateConfigInternal>('Translation configuration');
export const OB_PAMS_CONFIGURATION = new InjectionToken<ObIPamsConfiguration>(
	'Provides the mandatory PAMS environment as well as an optional root url.'
);
export const OB_ACCESSIBILITY_STATEMENT_CONFIGURATION = new InjectionToken<ObIAccessibilityStatementConfiguration>(
	'AccessibilityStatementConfiguration'
);
export const OB_HAS_LANGUAGE_IN_URL = new InjectionToken<boolean>('Add current language in URL');

export function windowProvider(doc: Document): Window {
	return doc.defaultView || ({} as Window);
}

const materialProviders = {
	MAT_FORM_FIELD_DEFAULT_OPTIONS: {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
	STEPPER_GLOBAL_OPTIONS: {provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}},
	MAT_CHECKBOX_OPTIONS: {provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: {color: 'primary'}},
	MAT_RADIO_OPTIONS: {provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: {color: 'primary'}},
	MAT_SLIDE_TOGGLE_OPTIONS: {provide: MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS, useValue: {color: 'primary'}},
	MAT_TABS_CONFIG: {provide: MAT_TABS_CONFIG, useValue: {stretchTabs: false}}
};

export function provideObliqueConfiguration(config: ObIObliqueConfiguration): EnvironmentProviders {
	return makeEnvironmentProviders([
		provideAppInitializer(() => {
			inject(ObIconService).registerOnAppInit({...defaultIconConfig, ...config.icon});
			inject(ObRouterService).initialize();
		}),
		provideObliqueTranslations(config.translate),
		{provide: WINDOW, useFactory: windowProvider, deps: [DOCUMENT]},
		{provide: MatPaginatorIntl, useClass: ObPaginatorService},
		{provide: MatStepperIntl, useClass: ObStepperIntlService},
		{provide: MatDatepickerIntl, useClass: ObDatepickerIntlService},
		{provide: ObTIconConfig, useValue: {...defaultIconConfig, ...config.icon}},
		{provide: OB_ACCESSIBILITY_STATEMENT_CONFIGURATION, useValue: config.accessibilityStatement},
		{provide: OB_HAS_LANGUAGE_IN_URL, useValue: config.hasLanguageInUrl || false},
		Object.entries(materialProviders).map(([provider, token]) => ({
			provide: token.provide,
			useValue: {...token.useValue, ...config.material?.[provider]}
		}))
	]);
}

export function provideObliqueTranslations(configuration: ObITranslateConfig = {}): EnvironmentProviders {
	const {config, flatten, additionalFiles} = configuration;
	return makeEnvironmentProviders([
		provideTranslateService({
			...config,
			loader: {
				provide: TranslateLoader,
				useFactory: getTranslateLoader,
				deps: [HttpClient, OB_TRANSLATION_CONFIGURATION]
			}
		}),
		{provide: OB_TRANSLATION_CONFIGURATION, useValue: {flatten: flatten ?? true, additionalFiles}}
	]);
}

function getTranslateLoader(http: HttpClient, config: ObITranslateConfigInternal): ObMultiTranslateLoader {
	const {additionalFiles, flatten} = config;
	return new ObMultiTranslateLoader(
		http,
		[
			{
				prefix: './assets/i18n/oblique-',
				suffix: '.json'
			},
			...(additionalFiles || [{prefix: './assets/i18n/', suffix: '.json'}])
		],
		flatten
	);
}

// as the Enter key on a button triggers both the click an keyup events, lets ensure the function is called only once
export function isNotKeyboardEventOnButton(event: MouseEvent | KeyboardEvent): boolean {
	return !event || event instanceof MouseEvent || (event.target as HTMLElement).nodeName !== 'BUTTON';
}

export function getRootRoute(route: ActivatedRoute): ActivatedRoute {
	return route.firstChild ? getRootRoute(route.firstChild) : route;
}

export function obFocusWithOutline(doc: Document, focusableElement: HTMLElement): void {
	doc.body.classList.add('ob-outline');

	const {contentEditable} = focusableElement;
	focusableElement.contentEditable = 'true';

	focusableElement.focus();
	focusableElement.contentEditable = contentEditable;
}
