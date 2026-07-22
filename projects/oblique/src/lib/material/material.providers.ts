import {Provider} from '@angular/core';
import {MAT_CHECKBOX_DEFAULT_OPTIONS} from '@angular/material/checkbox';
import {MatDatepickerIntl} from '@angular/material/datepicker';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {MAT_RADIO_DEFAULT_OPTIONS} from '@angular/material/radio';
import {MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS} from '@angular/material/slide-toggle';
import {MatStepperIntl} from '@angular/material/stepper';
import {MAT_TABS_CONFIG} from '@angular/material/tabs';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {ObDatepickerIntlService} from './ob-datepicker.service';
import {ObPaginatorService} from './ob-paginator.service';
import {ObStepperIntlService} from './ob-stepper.service';
import {ObIMaterialConfig, ObIMaterialProviders, ObMaterialProvider} from './material.model';

const materialProviders: ObIMaterialProviders = {
	MAT_FORM_FIELD_DEFAULT_OPTIONS: {provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
	STEPPER_GLOBAL_OPTIONS: {provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}},
	MAT_CHECKBOX_OPTIONS: {provide: MAT_CHECKBOX_DEFAULT_OPTIONS, useValue: {color: 'primary'}},
	MAT_RADIO_OPTIONS: {provide: MAT_RADIO_DEFAULT_OPTIONS, useValue: {color: 'primary'}},
	MAT_SLIDE_TOGGLE_OPTIONS: {provide: MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS, useValue: {color: 'primary'}},
	MAT_TABS_CONFIG: {provide: MAT_TABS_CONFIG, useValue: {stretchTabs: false}},
};

export function obProvideMaterial(config: Required<NonNullable<ObIMaterialConfig>>): Provider[] {
	return [
		{provide: MatStepperIntl, useClass: ObStepperIntlService},
		{provide: MatPaginatorIntl, useClass: ObPaginatorService},
		{provide: MatDatepickerIntl, useClass: ObDatepickerIntlService},
		(Object.entries(materialProviders) as [ObMaterialProvider, ObIMaterialProviders[ObMaterialProvider]][]).map(
			([provider, token]) => ({
				provide: token.provide,
				useValue: config[provider],
			})
		),
	];
}

export const obDefaultMaterialProviders = {
	MAT_FORM_FIELD_DEFAULT_OPTIONS: materialProviders.MAT_FORM_FIELD_DEFAULT_OPTIONS.useValue,
	STEPPER_GLOBAL_OPTIONS: materialProviders.STEPPER_GLOBAL_OPTIONS.useValue,
	MAT_CHECKBOX_OPTIONS: materialProviders.MAT_CHECKBOX_OPTIONS.useValue,
	MAT_RADIO_OPTIONS: materialProviders.MAT_RADIO_OPTIONS.useValue,
	MAT_SLIDE_TOGGLE_OPTIONS: materialProviders.MAT_SLIDE_TOGGLE_OPTIONS.useValue,
	MAT_TABS_CONFIG: materialProviders.MAT_TABS_CONFIG.useValue,
};
