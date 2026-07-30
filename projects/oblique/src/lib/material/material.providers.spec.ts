import {TestBed} from '@angular/core/testing';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {MAT_CHECKBOX_DEFAULT_OPTIONS} from '@angular/material/checkbox';
import {MatDatepickerIntl} from '@angular/material/datepicker';
import {MatPaginatorIntl} from '@angular/material/paginator';
import {MAT_RADIO_DEFAULT_OPTIONS} from '@angular/material/radio';
import {MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS} from '@angular/material/slide-toggle';
import {MatStepperIntl} from '@angular/material/stepper';
import {MAT_TABS_CONFIG} from '@angular/material/tabs';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {obProvideMaterial} from './material.providers';
import {ObIMaterialConfig} from './material.model';
import {provideObliqueTranslations} from '../translation/translation.providers';
import {ObDatepickerIntlService} from './ob-datepicker.service';
import {ObPaginatorService} from './ob-paginator.service';
import {ObStepperIntlService} from './ob-stepper.service';

describe('material.provider', () => {
	const config: Required<NonNullable<ObIMaterialConfig>> = {
		MAT_FORM_FIELD_DEFAULT_OPTIONS: {appearance: 'outline'},
		STEPPER_GLOBAL_OPTIONS: {displayDefaultIndicatorType: false},
		MAT_CHECKBOX_OPTIONS: {color: 'primary'},
		MAT_RADIO_OPTIONS: {color: 'primary'},
		MAT_SLIDE_TOGGLE_OPTIONS: {color: 'primary'},
		MAT_TABS_CONFIG: {stretchTabs: false},
	};

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [obProvideMaterial(config), provideObliqueTranslations()],
		});
	});

	test.each([
		{token: MAT_FORM_FIELD_DEFAULT_OPTIONS, name: 'MAT_FORM_FIELD_DEFAULT_OPTIONS'},
		{token: STEPPER_GLOBAL_OPTIONS, name: 'STEPPER_GLOBAL_OPTIONS'},
		{token: MAT_CHECKBOX_DEFAULT_OPTIONS, name: 'MAT_CHECKBOX_OPTIONS'},
		{token: MAT_RADIO_DEFAULT_OPTIONS, name: 'MAT_RADIO_OPTIONS'},
		{token: MAT_SLIDE_TOGGLE_DEFAULT_OPTIONS, name: 'MAT_SLIDE_TOGGLE_OPTIONS'},
		{token: MAT_TABS_CONFIG, name: 'MAT_TABS_CONFIG'},
	])('should create $token injection token', ({token, name}) => {
		expect(TestBed.inject(token)).toEqual(config[name]);
	});

	test('Intl services', () => {
		expect(TestBed.inject(MatStepperIntl) instanceof ObStepperIntlService).toBe(true);
		expect(TestBed.inject(MatPaginatorIntl) instanceof ObPaginatorService).toBe(true);
		expect(TestBed.inject(MatDatepickerIntl) instanceof ObDatepickerIntlService).toBe(true);
	});
});
