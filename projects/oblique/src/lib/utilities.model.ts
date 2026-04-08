import type {InjectionToken} from '@angular/core';
import {MatFormFieldDefaultOptions} from '@angular/material/form-field';
import {MatCheckboxDefaultOptions} from '@angular/material/checkbox';
import {MatRadioDefaultOptions} from '@angular/material/radio';
import {StepperOptions} from '@angular/cdk/stepper';
import {ObEPamsEnvironment} from './service-navigation/service-navigation.model';
import {MatSlideToggleDefaultOptions} from '@angular/material/slide-toggle';
import {MatTabsConfig} from '@angular/material/tabs';
import {TranslateModuleConfig} from '@ngx-translate/core';
import {ObIconConfig} from './icon/icon.model';
import {ObILocale} from './master-layout/master-layout.model';
import {ObITranslationFile} from './multi-translate-loader/multi-translate-loader.model';

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

export interface ObIMaterialConfig {
	MAT_FORM_FIELD_DEFAULT_OPTIONS?: MatFormFieldDefaultOptions;
	STEPPER_GLOBAL_OPTIONS?: StepperOptions;
	MAT_CHECKBOX_OPTIONS?: MatCheckboxDefaultOptions;
	MAT_RADIO_OPTIONS?: MatRadioDefaultOptions;
	MAT_SLIDE_TOGGLE_OPTIONS?: MatSlideToggleDefaultOptions;
	MAT_TABS_CONFIG?: MatTabsConfig;
}

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

export type ObMaterialProvider = keyof Required<ObIMaterialConfig>;

export interface ObIMaterialProviderConfiguration<Type> {
	provide: InjectionToken<Type>;
	useValue: Type;
}

export type ObIMaterialProviders = {
	[Property in ObMaterialProvider]: ObIMaterialProviderConfiguration<Required<ObIMaterialConfig>[Property]>;
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

export type ObConformity = ObConformityPartial | ObConformityNonPartial;

export type ObIAccessibilityStatementConfiguration =
	| ObIAccessibilityStatementConfigurationPartial
	| ObIAccessibilityStatementConfigurationNonPartial;

type ObConformityPartial = 'partial';
type ObConformityNonPartial = 'none' | 'full';

interface ObIAccessibilityStatementConfigurationBase {
	applicationName: string;
	createdOn: Date;
	reviewedOn?: Date;
	applicationOperator: string;
	contact: NonEmptyArray<ObContactData>;
}

interface ObIAccessibilityStatementConfigurationPartial extends ObIAccessibilityStatementConfigurationBase {
	exceptions: NonEmptyArray<string>;
	conformity: ObConformityPartial;
}

interface ObIAccessibilityStatementConfigurationNonPartial extends ObIAccessibilityStatementConfigurationBase {
	conformity: ObConformityNonPartial;
}

interface ObContactInfoBase {
	context?: string;
}

interface ObContactEmail extends ObContactInfoBase {
	email: string;
	phone?: never;
	url?: never;
}

interface ObContactPhone extends ObContactInfoBase {
	email?: never;
	phone: string;
	url?: never;
}

interface ObContactUrl extends ObContactInfoBase {
	email?: never;
	phone?: never;
	url: string;
}

export type ObContactData = ObContactPhone | ObContactEmail | ObContactUrl;

export interface ObWindow {
	confirm: (message: string) => boolean;
	history: Pick<History, 'length'>;
	innerHeight: number;
	innerWidth: number;
	localStorage: Pick<Storage, 'getItem' | 'setItem' | 'removeItem'>;
	location: Pick<Location, 'href' | 'host'>;
	matchMedia: (query: string) => Pick<MediaQueryList, 'matches'>;
	open: (url?: string, target?: string, features?: string) => Window | null;
	pageYOffset: number;
	setInterval: (handler: TimerHandler, timeout?: number, ...args: unknown[]) => number;
	setTimeout: (handler: TimerHandler, timeout?: number, ...args: unknown[]) => number;
}
