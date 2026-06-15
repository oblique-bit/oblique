import {TranslateModuleConfig} from '@ngx-translate/core';
import {ObILocale} from '../language/language.model';

export interface ObITranslateConfigInternal {
	flatten: boolean;
	additionalFiles?: ObITranslationFile[];
}

export interface ObITranslateConfig {
	flatten?: boolean;
	config?: TranslateModuleConfig;
	additionalFiles?: ObITranslationFile[];
	locales?: ObILocale;
}

export interface ObITranslationFile {
	prefix: string;
	suffix: string;
}

export interface DeepString {
	[key: string]: DeepString | string;
}
