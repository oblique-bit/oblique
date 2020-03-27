import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {TranslateModule} from '@ngx-translate/core';

import {ObFilterBoxModule} from '../filter-box/filter-box.module';
import {ObMultiselectComponent} from './multiselect.component';
import {ObMultiselectConfig} from './multiselect.config';
import {ObMultiselectSearchPipe} from './multiselect-search.pipe';
import {ObMultiselectTexts} from './multiselect.texts';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {WINDOW, windowProvider} from '../utilities';

export {ObMultiselectComponent} from './multiselect.component';
export {ObMultiselectConfig} from './multiselect.config';
export {ObMultiselectSearchPipe} from './multiselect-search.pipe';
export {ObMultiselectTexts} from './multiselect.texts';

@NgModule({
	imports: [CommonModule, FormsModule, TranslateModule, ObFilterBoxModule],
	exports: [ObMultiselectComponent, ObMultiselectSearchPipe],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}},
		{provide: WINDOW, useFactory: windowProvider}
	],
	declarations: [ObMultiselectComponent, ObMultiselectSearchPipe]
})
export class ObMultiselectModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObMultiselectModule);
	}
}
