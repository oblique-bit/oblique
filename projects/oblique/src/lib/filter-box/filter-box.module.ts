import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';

import {TextControlClearModule} from '../text-control-clear/text-control-clear.module';
import {FilterBoxComponent} from './filter-box.component';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {TelemetryService} from '../telemetry/telemetry.service';
import {WINDOW, windowProvider} from '../utilities';

export {FilterBoxComponent} from './filter-box.component';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule,
		FormsModule,
		TextControlClearModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule
	],
	declarations: [FilterBoxComponent],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: WINDOW, useFactory: windowProvider}
	],
	exports: [FilterBoxComponent]
})
export class FilterBoxModule {
	constructor(telemetry: TelemetryService) {
		requireAndRecordTelemetry(telemetry, FilterBoxModule);
	}
}
