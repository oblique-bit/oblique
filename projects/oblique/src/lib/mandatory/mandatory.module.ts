import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {obliqueProviders} from '../utilities';
import {ObMandatoryDirective} from './mandatory.directive';

export {ObMandatoryDirective} from './mandatory.directive';

@NgModule({
	declarations: [ObMandatoryDirective],
	imports: [CommonModule],
	providers: obliqueProviders(),
	exports: [ObMandatoryDirective]
})
export class ObMandatoryModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObMandatoryModule);
	}
}
