import {MatFormFieldDefaultOptions} from '@angular/material/form-field';
import {MatCheckboxDefaultOptions} from '@angular/material/checkbox';
import {MatRadioDefaultOptions} from '@angular/material/radio';
import {StepperOptions} from '@angular/cdk/stepper';
import {ObEPamsEnvironment} from './service-navigation/service-navigation.model';
import {MatSlideToggleDefaultOptions} from '@angular/material/slide-toggle';
import {MatTabsConfig} from '@angular/material/tabs';
import {TranslateModuleConfig} from '@ngx-translate/core';
import {ObIconConfig} from './icon/icon.model';
import {ObITranslationFile} from './multi-translate-loader/multi-translate-loader.model';

export interface ObIBanner {
	text: string;
	color?: string;
	bgColor?: string;
}

export interface ObIPamsConfiguration {
	environment: ObEPamsEnvironment;
	rootUrl?: string;
}

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

export interface ObITranslateConfig {
	flatten?: boolean;
	config?: TranslateModuleConfig;
	additionalFiles?: ObITranslationFile[];
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
	contact: ObContact | NonEmptyArray<ObContactData>;
}

interface ObIAccessibilityStatementConfigurationPartial extends ObIAccessibilityStatementConfigurationBase {
	exceptions: NonEmptyArray<string>;
	conformity: ObConformityPartial;
}

interface ObIAccessibilityStatementConfigurationNonPartial extends ObIAccessibilityStatementConfigurationBase {
	conformity: ObConformityNonPartial;
}

interface ObContactEmail {
	email: string;
	phone?: never;
}

interface ObContactPhone {
	email?: never;
	phone: string;
}

interface ObContactInfo {
	emails: NonEmptyArray<string>;
	phones: NonEmptyArray<string>;
}

type ObContact = Required<Pick<ObContactInfo, 'emails'>> | Required<Pick<ObContactInfo, 'phones'>> | Required<ObContactInfo>;

export type ObContactData = ObContactPhone | ObContactEmail;
