import {EnvironmentProviders, Provider, inject, makeEnvironmentProviders, provideAppInitializer} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {TranslateLoader, provideTranslateService} from '@ngx-translate/core';

import {
	DeepPartial,
	ObIObliqueConfiguration,
	ObIObliqueConfigurationWithDefaults,
	ObIObliqueTestingConfiguration,
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
import {obDefaultLanguageConfiguration, obProvideLanguageConfiguration} from './language/language.provider';
import {obDefaultBannerConfiguration, obProvideBanner} from './banner';
import {obProvideServiceNavigation} from './service-navigation/service-navigation.provider';

const defaultLocalesConfiguration: ObILocale = {
	locales: ['de-CH', 'fr-CH', 'it-CH'],
	defaultLanguage: 'de',
	disabled: false,
};

function isPlainObject(value: unknown): value is Record<string, unknown> {
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		return false;
	}
	const prototype = Object.getPrototypeOf(value);
	return prototype === Object.prototype || prototype === null;
}

/**
 * Options controlling how {@link mergeDeep} applies override values.
 */
export interface ObMergeDeepOptions {
	/**
	 * Whether undefined override values should be ignored. Defaults to true.
	 * Set to false to explicitly clear existing properties.
	 */
	ignoreUndefined?: boolean;
}

/**
 * Recursively merges plain object properties from an override into a base object.
 *
 * Existing properties are preserved when the override does not provide a value.
 * By default, undefined override values are ignored; pass `{ignoreUndefined: false}`
 * when undefined should replace an existing property.
 *
 * Arrays and non-plain objects are replaced by the override value.
 */
export function mergeDeep<Type>(
	base: Type,
	override: DeepPartial<Type>,
	{ignoreUndefined = true}: ObMergeDeepOptions = {}
): Type {
	if (!isPlainObject(base) || !isPlainObject(override)) {
		return override as Type;
	}

	const merged = {...base} as Record<string, unknown>;
	Object.keys(override).forEach(key => {
		const overrideValue = override[key];
		if (overrideValue === undefined && ignoreUndefined) {
			return;
		}

		const baseValue = merged[key];
		merged[key] =
			isPlainObject(baseValue) && isPlainObject(overrideValue)
				? mergeDeep(baseValue, overrideValue, {ignoreUndefined})
				: overrideValue;
	});

	return merged as Type;
}

const defaultObliqueConfiguration: ObIObliqueConfigurationWithDefaults = {
	accessibilityStatement: obDefaultAccessibilityStatement,
	historyState: obDefaultHistoryState,
	banner: obDefaultBannerConfiguration,
	material: obDefaultMaterialProviders,
	icon: {registerObliqueIcons: true},
	translate: defaultTranslationConfig,
	language: obDefaultLanguageConfiguration,
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
		obProvideLanguageConfiguration(mergedConfig.language),
		obProvideBanner(mergedConfig.banner),
		obProvideDate(),
		obProvideConsole(mergedConfig.consoleConfiguration),
		obProvideMaterial(mergedConfig.material),
		obProvideServiceNavigation(mergedConfig.pams),
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
