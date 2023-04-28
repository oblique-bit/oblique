import {MatLegacyFormFieldDefaultOptions as MatFormFieldDefaultOptions} from '@angular/material/legacy-form-field';
import {MatLegacyCheckboxDefaultOptions as MatCheckboxDefaultOptions} from '@angular/material/legacy-checkbox';
import {MatLegacyRadioDefaultOptions as MatRadioDefaultOptions} from '@angular/material/legacy-radio';
import {StepperOptions} from '@angular/cdk/stepper';
import {MatLegacySlideToggleDefaultOptions as MatSlideToggleDefaultOptions} from '@angular/material/legacy-slide-toggle';
import {ObEPamsEnvironment} from './service-navigation/service-navigation.model';

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
}
