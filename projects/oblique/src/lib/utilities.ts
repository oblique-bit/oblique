import {HttpClient} from '@angular/common/http';
import {
	ClassProvider,
	DOCUMENT,
	EnvironmentProviders,
	InjectionToken,
	inject,
	makeEnvironmentProviders,
	provideAppInitializer,
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {
	MissingTranslationHandler,
	TranslateCompiler,
	TranslateLoader,
	TranslateModuleConfig,
	TranslateParser,
	provideTranslateService,
} from '@ngx-translate/core';
import {ObMultiTranslateLoader} from './multi-translate-loader/multi-translate-loader';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {MAT_CHECKBOX_DEFAULT_OPTIONS} from '@angular/material/checkbox';
import {MAT_RADIO_DEFAULT_OPTIONS} from '@angular/material/radio';
import {MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS} from '@angular/material/slide-toggle';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {
	DeepPartial,
	ObIAccessibilityStatementConfiguration,
	ObIBanner,
	ObIHistoryState,
	ObIMaterialProviders,
	ObIObliqueConfiguration,
	ObIObliqueConfigurationWithDefaults,
	ObIObliqueTestingConfiguration,
	ObIPamsConfiguration,
	ObITranslateConfig,
	ObITranslateConfigInternal,
	ObMaterialProvider,
	ObTBanner,
} from './utilities.model';
import {MAT_TABS_CONFIG} from '@angular/material/tabs';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {ObPaginatorService} from './paginator/ob-paginator.service';
import {ObIconService} from './icon/icon.service';
import {MatStepperIntl} from '@angular/material/stepper';
import {ObStepperIntlService} from './stepper/ob-stepper.service';
import {MatDatepickerIntl} from '@angular/material/datepicker';
import {ObDatepickerIntlService} from './datepicker/ob-datepicker.service';
import {ObRouterService} from '../lib/router/ob-router.service';
import {ObLanguageService} from './language/language.service';
import {of} from 'rxjs';
import {ObMasterLayoutConfig} from './master-layout/master-layout.config';
import {ObILocale} from './master-layout/master-layout.model';

export const WINDOW = new InjectionToken<Window>('Window');
export const OB_BANNER = new InjectionToken<ObIBanner & ObTBanner>('Banner');
export const OB_TRANSLATION_CONFIGURATION = new InjectionToken<ObITranslateConfigInternal>('Translation configuration');
export const OB_PAMS_CONFIGURATION = new InjectionToken<ObIPamsConfiguration>(
	'Provides the mandatory PAMS environment as well as an optional root url.'
);
export const OB_ACCESSIBILITY_STATEMENT_CONFIGURATION = new InjectionToken<ObIAccessibilityStatementConfiguration>(
	'AccessibilityStatementConfiguration'
);
export const OB_HAS_LANGUAGE_IN_URL = new InjectionToken<boolean>('Add current language in URL');
export const OB_MAT_ERROR_PREFIX = new InjectionToken<string>(
	'Prefix for the translation keys of custom error messages.'
);
export const OB_HISTORY_STATE = new InjectionToken<ObIHistoryState>('History state');

export function windowProvider(doc: Document): Window {
	return doc.defaultView || ({} as Window);
}

const materialProviders: ObIMaterialProviders = {
	MAT_FORM_FIELD_DEFAULT_OPTIONS: {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
	STEPPER_GLOBAL_OPTIONS: {provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}},
	MAT_CHECKBOX_OPTIONS: {provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: {color: 'primary'}},
	MAT_RADIO_OPTIONS: {provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: {color: 'primary'}},
	MAT_SLIDE_TOGGLE_OPTIONS: {provide: MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS, useValue: {color: 'primary'}},
	MAT_TABS_CONFIG: {provide: MAT_TABS_CONFIG, useValue: {stretchTabs: false}},
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return false;
	}
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
}

export function mergeDeep<Type>(base: Type, override: DeepPartial<Type>): Type {
	if (!isPlainObject(base) || !isPlainObject(override)) {
		return override as Type;
	}

	const merged = {...base} as Record<string, unknown>;
	Object.keys(override).forEach(key => {
		const overrideValue = override[key];
		if (overrideValue === undefined) {
			return;
		}

		const baseValue = merged[key];
		merged[key] =
			isPlainObject(baseValue) && isPlainObject(overrideValue) ? mergeDeep(baseValue, overrideValue) : overrideValue;
	});

	return merged as Type;
}

const defaultObliqueConfiguration: ObIObliqueConfigurationWithDefaults = {
	accessibilityStatement: {
		applicationName: 'Test application',
		createdOn: new Date('2025-01-01'),
		conformity: 'none',
		applicationOperator: 'Test operator',
		contact: [{email: 'test@example.com'}],
	},
	material: {
		MAT_FORM_FIELD_DEFAULT_OPTIONS: materialProviders.MAT_FORM_FIELD_DEFAULT_OPTIONS.useValue,
		STEPPER_GLOBAL_OPTIONS: materialProviders.STEPPER_GLOBAL_OPTIONS.useValue,
		MAT_CHECKBOX_OPTIONS: materialProviders.MAT_CHECKBOX_OPTIONS.useValue,
		MAT_RADIO_OPTIONS: materialProviders.MAT_RADIO_OPTIONS.useValue,
		MAT_SLIDE_TOGGLE_OPTIONS: materialProviders.MAT_SLIDE_TOGGLE_OPTIONS.useValue,
		MAT_TABS_CONFIG: materialProviders.MAT_TABS_CONFIG.useValue,
	},
	icon: {registerObliqueIcons: true},
	translate: {flatten: true},
	hasLanguageInUrl: false,
} as const;

function mergeWithDefaultObliqueConfiguration(
	config: DeepPartial<ObIObliqueConfiguration>
): ObIObliqueConfigurationWithDefaults {
	return mergeDeep(defaultObliqueConfiguration, {...config});
}

export function provideObliqueConfiguration(config: ObIObliqueConfiguration): EnvironmentProviders {
	const mergedConfig = mergeWithDefaultObliqueConfiguration(config);

	return makeEnvironmentProviders([
		provideAppInitializer(() => {
			const localesConfiguration = getLocalesConfiguration(mergedConfig);
			inject(ObIconService).registerOnAppInit(mergedConfig.icon);
			inject(ObLanguageService).initialize(localesConfiguration);
			inject(ObRouterService).initialize();
			inject(OB_HISTORY_STATE).initialLength = inject(WINDOW).history.length;
		}),
		provideObliqueTranslations(mergedConfig.translate),
		{provide: WINDOW, useFactory: windowProvider, deps: [DOCUMENT]},
		{provide: OB_HISTORY_STATE, useValue: {initialLength: 0}},
		{provide: MatPaginatorIntl, useClass: ObPaginatorService},
		{provide: MatStepperIntl, useClass: ObStepperIntlService},
		{provide: MatDatepickerIntl, useClass: ObDatepickerIntlService},
		{provide: OB_ACCESSIBILITY_STATEMENT_CONFIGURATION, useValue: mergedConfig.accessibilityStatement},
		{provide: OB_HAS_LANGUAGE_IN_URL, useValue: mergedConfig.hasLanguageInUrl},
		(Object.entries(materialProviders) as [ObMaterialProvider, ObIMaterialProviders[ObMaterialProvider]][]).map(
			([provider, token]) => ({
				provide: token.provide,
				useValue: mergedConfig.material[provider],
			})
		),
	]);
}
/* eslint-disable max-lines-per-function */
export function provideObliqueTestingConfiguration(config: ObIObliqueTestingConfiguration = {}): EnvironmentProviders {
	const mergedConfig = mergeWithDefaultObliqueConfiguration(config);

	return makeEnvironmentProviders([
		provideAppInitializer(() => {
			const localesConfiguration = getLocalesConfiguration(mergedConfig);
			inject(ObIconService).registerOnAppInit(mergedConfig.icon);
			inject(ObLanguageService).initialize(localesConfiguration);
			inject(ObRouterService).initialize();
			inject(OB_HISTORY_STATE).initialLength = inject(WINDOW).history.length;
		}),
		provideTranslateService({
			...mergedConfig.translate,
			loader: {
				provide: TranslateLoader,
				useValue: {getTranslation: () => of({})},
			},
		}),
		{
			provide: OB_TRANSLATION_CONFIGURATION,
			useValue: {
				additionalFiles: mergedConfig.translate.additionalFiles,
				flatten: mergedConfig.translate.flatten,
			},
		},
		{provide: WINDOW, useValue: window},
		{provide: OB_HISTORY_STATE, useValue: {initialLength: 0}},
		{provide: MatPaginatorIntl, useClass: ObPaginatorService},
		{provide: MatStepperIntl, useClass: ObStepperIntlService},
		{provide: MatDatepickerIntl, useClass: ObDatepickerIntlService},
		{provide: OB_ACCESSIBILITY_STATEMENT_CONFIGURATION, useValue: mergedConfig.accessibilityStatement},
		{provide: OB_HAS_LANGUAGE_IN_URL, useValue: mergedConfig.hasLanguageInUrl},
		(Object.entries(materialProviders) as [ObMaterialProvider, ObIMaterialProviders[ObMaterialProvider]][]).map(
			([provider, token]) => ({
				provide: token.provide,
				useValue: mergedConfig.material[provider],
			})
		),
	]);
}

export function getLocalesConfiguration(config: ObIObliqueConfigurationWithDefaults): ObILocale {
	const masterLayoutConfig = inject(ObMasterLayoutConfig);
	return config.translate?.locales ?? masterLayoutConfig.locale;
}

export function provideObliqueTranslations(configuration: ObITranslateConfig = {}): EnvironmentProviders {
	const {config, flatten, additionalFiles} = configuration;
	return makeEnvironmentProviders([
		provideTranslateService({
			loader: {
				provide: TranslateLoader,
				useFactory: getTranslateLoader,
				deps: [HttpClient, OB_TRANSLATION_CONFIGURATION],
			},
			...addProviders(config),
		}),
		{provide: OB_TRANSLATION_CONFIGURATION, useValue: {additionalFiles, flatten: flatten ?? true}},
	]);
}

function getTranslateLoader(http: HttpClient, config: ObITranslateConfigInternal): ObMultiTranslateLoader {
	const {additionalFiles, flatten} = config;
	return new ObMultiTranslateLoader(
		http,
		[
			{
				prefix: './assets/i18n/oblique-',
				suffix: '.json',
			},
			...(additionalFiles || [{prefix: './assets/i18n/', suffix: '.json'}]),
		],
		flatten
	);
}

function addProviders(config: TranslateModuleConfig = {}): TranslateModuleConfig {
	const providers = {
		compiler: TranslateCompiler,
		loader: TranslateLoader,
		parser: TranslateParser,
		missingTranslationHandler: MissingTranslationHandler,
	} as const;
	const configWithProviders = {};
	Object.keys(config).forEach(option => {
		configWithProviders[option] =
			providers[option] && config[option] instanceof Function
				? ({provide: providers[option], useClass: config[option]} as ClassProvider)
				: config[option];
	});
	return configWithProviders;
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
