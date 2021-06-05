import {MatFormFieldDefaultOptions} from '@angular/material/form-field';
import {MatCheckboxDefaultOptions} from '@angular/material/checkbox';
import {MatRadioDefaultOptions} from '@angular/material/radio';
import {StepperOptions} from '@angular/cdk/stepper';

export interface ObIBanner {
	text: string;
	color?: string;
	bgColor?: string;
}

export interface ObIMaterialConfig {
	MAT_FORM_FIELD_DEFAULT_OPTIONS?: MatFormFieldDefaultOptions;
	STEPPER_GLOBAL_OPTIONS?: StepperOptions;
	MAT_CHECKBOX_OPTIONS?: MatCheckboxDefaultOptions;
	MAT_RADIO_OPTIONS?: MatRadioDefaultOptions;
}
