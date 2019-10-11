import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material';
import {TranslateParamsPipe} from './translate-params.pipe';
import { TelemetryService } from '../telemetry/telemetry.service';
import { requireAndRecordTelemetry } from '../telemetry/telemetry-require';

export {TranslateParamsPipe} from './translate-params.pipe';

@NgModule({
	declarations: [TranslateParamsPipe],
	imports: [TranslateModule],
	providers: [{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}],
	exports:  [TranslateParamsPipe]
})
export class TranslateParamsModule {
	constructor(telemetry: TelemetryService) {
		requireAndRecordTelemetry(telemetry, TranslateParamsModule);
	}
}
