import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {TranslateModule} from '@ngx-translate/core';

import {FilterBoxModule} from '../filter-box/filter-box.module';
import {MultiselectComponent} from './multiselect.component';
import {MultiselectConfig} from './multiselect.config';
import {MultiselectSearchPipe} from './multiselect-search.pipe';
import {MultiselectTexts} from './multiselect.texts';
import {TelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {WINDOW, windowProvider} from '../utilities';

export {MultiselectComponent} from './multiselect.component';
export {MultiselectConfig} from './multiselect.config';
export {MultiselectSearchPipe} from './multiselect-search.pipe';
export {MultiselectTexts} from './multiselect.texts';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		TranslateModule,
		FilterBoxModule
	],
	exports: [
		MultiselectComponent
	],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: WINDOW, useFactory: windowProvider}
	],
	declarations: [
		MultiselectComponent,
		MultiselectSearchPipe
	]
})
export class MultiselectModule {
	constructor(telemetry: TelemetryService) {
		requireAndRecordTelemetry(telemetry, MultiselectModule);
	}
}
