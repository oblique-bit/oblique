import {MatFormFieldDefaultOptions} from '@angular/material/form-field';
import {StepperOptions} from '@angular/cdk/stepper';

export interface ObIBanner {
	text: string;
	color?: string;
	bgColor?: string;
}

export interface ObIMaterialConfig {
	MAT_FORM_FIELD_DEFAULT_OPTIONS?: MatFormFieldDefaultOptions;
	STEPPER_GLOBAL_OPTIONS?: StepperOptions;
}
