import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {ObTranslateParamsPipe} from './translate-params.pipe';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {WINDOW, windowProvider} from '../utilities';

export {ObTranslateParamsPipe} from './translate-params.pipe';

@NgModule({
	declarations: [ObTranslateParamsPipe],
	imports: [TranslateModule],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }},
		{provide: WINDOW, useFactory: windowProvider}
	],
	exports: [ObTranslateParamsPipe]
})
export class ObTranslateParamsModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObTranslateParamsModule);
	}
}
