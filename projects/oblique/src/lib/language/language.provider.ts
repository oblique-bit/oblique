import {InjectionToken, Provider} from '@angular/core';

export const OB_HAS_LANGUAGE_IN_URL = new InjectionToken<boolean>('Add current language in URL');

export function obProvideLanguageConfiguration(config: boolean): Provider[] {
	return [{provide: OB_HAS_LANGUAGE_IN_URL, useValue: config}];
}

export const obDefaultLanguageInUrl = false;
