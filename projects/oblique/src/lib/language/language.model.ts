export interface ObLanguageConfig {
	hasLanguageInUrl?: boolean;
}

export type ObLanguageConfigWithDefault = Required<NonNullable<ObLanguageConfig>>;

export interface ObILocale {
	locales: (string | ObILocaleObject)[];
	defaultLanguage: string;
	disabled: boolean;
}

export interface ObILocaleObject {
	locale: string;
	id?: string;
	label?: string;
}
