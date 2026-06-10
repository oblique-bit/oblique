import {ObEPamsEnvironment} from './service-navigation/service-navigation.model';
import {TranslateModuleConfig} from '@ngx-translate/core';
import {ObIconConfig} from './icon/icon.model';
import {ObILocale} from './master-layout/master-layout.model';
import {ObITranslationFile} from './multi-translate-loader/multi-translate-loader.model';
import {ObIAccessibilityStatementConfiguration} from './accessibility-statement/accessibility-statement.model';
import {ObIMaterialConfig} from './material/material.model';

export interface ObIBanner {
	text?: string;
	color?: string;
	bgColor?: string;
}

export interface ObIPamsConfiguration {
	environment: ObEPamsEnvironment;
	rootUrl?: string;
}

export type ObTBanner = string | ObIBanner | undefined;

export interface ObIObliqueConfiguration {
	accessibilityStatement: ObIAccessibilityStatementConfiguration;
	material?: ObIMaterialConfig;
	icon?: ObIconConfig;
	translate?: ObITranslateConfig;
	hasLanguageInUrl?: boolean;
}

export interface ObIHistoryState {
	initialLength: number;
}

export type ObIObliqueTestingConfiguration = Omit<ObIObliqueConfiguration, 'accessibilityStatement'> & {
	accessibilityStatement?: ObIAccessibilityStatementConfiguration;
};

export type ObIObliqueConfigurationWithDefaults = Omit<
	ObIObliqueConfiguration,
	'accessibilityStatement' | 'material' | 'icon' | 'translate' | 'hasLanguageInUrl'
> & {
	accessibilityStatement: ObIAccessibilityStatementConfiguration;
	material: Required<NonNullable<ObIObliqueConfiguration['material']>>;
	icon: NonNullable<ObIObliqueConfiguration['icon']>;
	translate: NonNullable<ObIObliqueConfiguration['translate']>;
	hasLanguageInUrl: NonNullable<ObIObliqueConfiguration['hasLanguageInUrl']>;
};

export type DeepPartial<Type> = Type extends object ? {[Property in keyof Type]?: DeepPartial<Type[Property]>} : Type;

export interface ObITranslateConfig {
	flatten?: boolean;
	config?: TranslateModuleConfig;
	additionalFiles?: ObITranslationFile[];
	locales?: ObILocale;
}

export interface ObITranslateConfigInternal {
	flatten: boolean;
	additionalFiles?: ObITranslationFile[];
}

export type NonEmptyArray<Type> = [Type, ...Type[]];
