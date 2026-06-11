import {TranslateModuleConfig} from '@ngx-translate/core';
import {ObILocale} from '../master-layout/master-layout.model';
import {ObITranslationFile} from '../multi-translate-loader/multi-translate-loader.model';

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
