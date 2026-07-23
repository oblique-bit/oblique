import {InjectionToken} from '@angular/core';
import {MatFormFieldDefaultOptions} from '@angular/material/form-field';
import {MatCheckboxDefaultOptions} from '@angular/material/checkbox';
import {MatRadioDefaultOptions} from '@angular/material/radio';
import {MatSlideToggleDefaultOptions} from '@angular/material/slide-toggle';
import {MatTabsConfig} from '@angular/material/tabs';
import {StepperOptions} from '@angular/cdk/stepper';

export type ObMaterialProvider = keyof Required<ObIMaterialConfig>;

export interface ObIMaterialProviderConfiguration<Type> {
	provide: InjectionToken<Type>;
	useValue: Type;
}

export type ObIMaterialProviders = {
	[Property in ObMaterialProvider]: ObIMaterialProviderConfiguration<Required<ObIMaterialConfig>[Property]>;
};

export interface ObIMaterialConfig {
	OB_MAT_ERROR_PREFIX?: string | null;
	MAT_FORM_FIELD_DEFAULT_OPTIONS?: MatFormFieldDefaultOptions;
	STEPPER_GLOBAL_OPTIONS?: StepperOptions;
	MAT_CHECKBOX_OPTIONS?: MatCheckboxDefaultOptions;
	MAT_RADIO_OPTIONS?: MatRadioDefaultOptions;
	MAT_SLIDE_TOGGLE_OPTIONS?: MatSlideToggleDefaultOptions;
	MAT_TABS_CONFIG?: MatTabsConfig;
}
