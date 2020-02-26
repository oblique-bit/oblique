import {NgModule} from '@angular/core';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {ObParentFormDirective} from './parent-form.directive';
import {ObNestedFormComponent} from './nested-form.component';
import {WINDOW, windowProvider} from '../utilities';

export {ObParentFormDirective} from './parent-form.directive';
export {ObNestedFormComponent} from './nested-form.component';

@NgModule({
	declarations: [
		ObParentFormDirective, ObNestedFormComponent
	],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }},
		{provide: WINDOW, useFactory: windowProvider}
	],
	exports: [
		ObParentFormDirective, ObNestedFormComponent
	]
})
export class ObNestedFormModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObNestedFormModule);
	}
}
