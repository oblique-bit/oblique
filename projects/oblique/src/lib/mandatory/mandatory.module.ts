import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {obliqueProviders} from '../utilities';
import {ObMandatoryDirective} from './mandatory.directive';

export {ObMandatoryDirective} from './mandatory.directive';

/**
 * @deprecated since version 7.1.0. Should be removed with the version 8.0.0 as it has been directly fixed in Angular
 * (https://github.com/angular/components/pull/23362)
 */
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
