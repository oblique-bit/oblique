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
	material?: ObIMaterialConfig;
	icon?: ObIconConfig;
	translate?: {
		config?: TranslateModuleConfig;
		additionalFiles?: ObITranslationFile[];
	};
}
