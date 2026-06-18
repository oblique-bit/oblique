export interface ObILocale {
	locales: (string | ObILocaleObject)[];
	defaultLanguage: string;
	disabled: boolean;
	languages: Record<string, string>;
}

export interface ObILocaleObject {
	locale: string;
	id?: string;
	label?: string;
}
