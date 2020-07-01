import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ObNumberFormatDirective} from './number-format.directive';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {obliqueProviders} from '../utilities';

export {ObNumberFormatDirective} from './number-format.directive';

@NgModule({
	imports: [CommonModule],
	declarations: [ObNumberFormatDirective],
	providers: obliqueProviders(),
	exports: [ObNumberFormatDirective]
})
export class ObNumberFormatModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObNumberFormatModule);
	}
}
