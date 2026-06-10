import {HttpClient} from '@angular/common/http';
import {
	ClassProvider,
	EnvironmentProviders,
	InjectionToken,
	Provider,
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

import {
	DeepPartial,
	ObIBanner,
	ObIHistoryState,
	ObIObliqueConfiguration,
	ObIObliqueConfigurationWithDefaults,
	ObIObliqueTestingConfiguration,
	ObIPamsConfiguration,
	ObITranslateConfig,
	ObITranslateConfigInternal,
	ObTBanner,
} from './utilities.model';
import {ObIconService} from './icon/icon.service';
import {ObRouterService} from '../lib/router/ob-router.service';
import {ObLanguageService} from './language/language.service';
import {of} from 'rxjs';
import {ObMasterLayoutConfig} from './master-layout/master-layout.config';
import {ObILocale} from './master-layout/master-layout.model';
import {
	defaultAccessibilityStatement,
	provideAccessibilityStatement,
} from './accessibility-statement/accessibility-statement.provider';
import {ObWindow} from './window/window.provider.model';
import {WINDOW, provideWindow} from './window/window.provider';
import {defaultMaterialProviders, provideMaterial} from './material/material.providers';

export const OB_BANNER = new InjectionToken<ObIBanner & ObTBanner>('Banner');
export const OB_TRANSLATION_CONFIGURATION = new InjectionToken<ObITranslateConfigInternal>('Translation configuration');
export const OB_PAMS_CONFIGURATION = new InjectionToken<ObIPamsConfiguration>(
	'Provides the mandatory PAMS environment as well as an optional root url.'
);

export const OB_HAS_LANGUAGE_IN_URL = new InjectionToken<boolean>('Add current language in URL');
export const OB_MAT_ERROR_PREFIX = new InjectionToken<string>(
	'Prefix for the translation keys of custom error messages.'
);
export const OB_HISTORY_STATE = new InjectionToken<ObIHistoryState>('History state');

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
	accessibilityStatement: defaultAccessibilityStatement,
	material: defaultMaterialProviders,
	icon: {registerObliqueIcons: true},
	translate: {flatten: true},
	hasLanguageInUrl: false,
} as const;

function mergeWithDefaultObliqueConfiguration(
	config: DeepPartial<ObIObliqueConfiguration>
): ObIObliqueConfigurationWithDefaults {
	return mergeDeep(defaultObliqueConfiguration, {...config});
}

function getAppInitializer(mergedConfig: ObIObliqueConfigurationWithDefaults): () => void {
	return () => {
		const localesConfiguration = getLocalesConfiguration(mergedConfig);
		inject(ObIconService).registerOnAppInit(mergedConfig.icon);
		inject(ObLanguageService).initialize(localesConfiguration);
		inject(ObRouterService).initialize();
		inject(OB_HISTORY_STATE).initialLength = inject<ObWindow>(WINDOW).history.length;
	};
}

function getDefaultObliqueProviders(
	mergedConfig: ObIObliqueConfigurationWithDefaults
): (Provider | EnvironmentProviders)[] {
	return [
		provideWindow(),
		{provide: OB_HISTORY_STATE, useValue: {initialLength: 0}},
		provideAccessibilityStatement(mergedConfig.accessibilityStatement),
		{provide: OB_HAS_LANGUAGE_IN_URL, useValue: mergedConfig.hasLanguageInUrl},
		provideMaterial(mergedConfig.material),
	];
}

export function provideObliqueConfiguration(config: ObIObliqueConfiguration): EnvironmentProviders {
	const mergedConfig = mergeWithDefaultObliqueConfiguration(config);

	return makeEnvironmentProviders([
		provideAppInitializer(getAppInitializer(mergedConfig)),
		provideObliqueTranslations(mergedConfig.translate),
		...getDefaultObliqueProviders(mergedConfig),
	]);
}

export function provideObliqueTestingConfiguration(config: ObIObliqueTestingConfiguration = {}): EnvironmentProviders {
	const mergedConfig = mergeWithDefaultObliqueConfiguration(config);

	return makeEnvironmentProviders([
		provideAppInitializer(getAppInitializer(mergedConfig)),
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
		...getDefaultObliqueProviders(mergedConfig),
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
