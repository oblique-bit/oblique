import {InjectionToken, Provider} from '@angular/core';
import {ObLanguageConfigWithDefault} from './language.model';

export const OB_HAS_LANGUAGE_IN_URL = new InjectionToken<boolean>('Add current language in URL');

export function obProvideLanguageConfiguration(config: ObLanguageConfigWithDefault): Provider[] {
	return [{provide: OB_HAS_LANGUAGE_IN_URL, useValue: config.hasLanguageInUrl}];
}

export const obDefaultLanguageConfiguration: ObLanguageConfigWithDefault = {
	hasLanguageInUrl: false,
};
