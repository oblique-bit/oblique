import {NgModule} from '@angular/core';
import {TranslateModule} from '@ngx-translate/core';
import {ObTranslateParamsPipe} from './translate-params.pipe';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {obliqueProviders} from '../utilities';

export {ObTranslateParamsPipe} from './translate-params.pipe';

@NgModule({
	declarations: [ObTranslateParamsPipe],
	imports: [TranslateModule],
	providers: obliqueProviders(),
	exports: [ObTranslateParamsPipe]
})
export class ObTranslateParamsModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObTranslateParamsModule);
	}
}
