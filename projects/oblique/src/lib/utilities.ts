import {
	EnvironmentProviders,
	InjectionToken,
	Provider,
	inject,
	makeEnvironmentProviders,
	provideAppInitializer,
} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TranslateLoader, provideTranslateService} from '@ngx-translate/core';

import {
	DeepPartial,
	ObIObliqueConfiguration,
	ObIObliqueConfigurationWithDefaults,
	ObIObliqueTestingConfiguration,
	ObIPamsConfiguration,
} from './utilities.model';
import {ObIconService} from './icon/icon.service';
import {ObRouterService} from '../lib/router/ob-router.service';
import {ObLanguageService} from './language/language.service';
import {of} from 'rxjs';
import {ObILocale} from './language/language.model';
import {
	obDefaultAccessibilityStatement,
	obDefaultHistoryState,
	obProvideAccessibilityStatement,
} from './accessibility-statement/accessibility-statement.provider';
import {ObWindow} from './window/window.provider.model';
import {WINDOW, obProvideWindow} from './window/window.provider';
import {obDefaultMaterialProviders, obProvideMaterial} from './material/material.providers';
import {
	OB_TRANSLATION_CONFIGURATION,
	defaultTranslationConfig,
	provideObliqueTranslations,
} from './translation/translation.providers';
import {obProvideDate} from './language/date.provider';
import {obDefaultConsoleConfiguration, obProvideConsole} from './console/ob-console.provider';
import {OB_HISTORY_STATE} from './accessibility-statement/accessibility-statement.provider';
import {obDefaultLanguageInUrl, obProvideLanguageConfiguration} from './language/language.provider';

export const OB_PAMS_CONFIGURATION = new InjectionToken<ObIPamsConfiguration>(
	'Provides the mandatory PAMS environment as well as an optional root url.'
);

export const OB_MAT_ERROR_PREFIX = new InjectionToken<string>(
	'Prefix for the translation keys of custom error messages.'
);

const defaultLocalesConfiguration: ObILocale = {
	locales: ['de-CH', 'fr-CH', 'it-CH'],
	defaultLanguage: 'de',
	disabled: false,
	languages: {de: 'Deutsch', fr: 'Francais', it: 'Italiano', en: 'English'},
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
	accessibilityStatement: obDefaultAccessibilityStatement,
	historyState: obDefaultHistoryState,
	material: obDefaultMaterialProviders,
	icon: {registerObliqueIcons: true},
	translate: defaultTranslationConfig,
	hasLanguageInUrl: obDefaultLanguageInUrl,
	consoleConfiguration: obDefaultConsoleConfiguration,
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
		obProvideWindow(),
		obProvideAccessibilityStatement(mergedConfig.accessibilityStatement, mergedConfig.historyState),
		obProvideLanguageConfiguration(mergedConfig.hasLanguageInUrl),
		obProvideDate(),
		obProvideConsole(mergedConfig.consoleConfiguration),
		obProvideMaterial(mergedConfig.material),
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
		obProvideDate(),
	]);
}

export function getLocalesConfiguration(config: ObIObliqueConfigurationWithDefaults): ObILocale {
	return config.translate?.locales ?? defaultLocalesConfiguration;
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
