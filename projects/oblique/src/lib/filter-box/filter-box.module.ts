import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS, MatFormFieldModule} from '@angular/material/form-field';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';

import {ObInputClearModule} from '../input-clear/input-clear.module';
import {ObFilterBoxComponent} from './filter-box.component';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {WINDOW, windowProvider} from '../utilities';

export {ObFilterBoxComponent} from './filter-box.component';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule,
		FormsModule,
		ObInputClearModule,
		MatIconModule,
		MatFormFieldModule,
		MatInputModule
	],
	declarations: [ObFilterBoxComponent],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}},
		{provide: WINDOW, useFactory: windowProvider}
	],
	exports: [ObFilterBoxComponent]
})
export class ObFilterBoxModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObFilterBoxModule);
	}
}
