import {NgModule} from '@angular/core';
import {RouterModule} from '@angular/router';

import {ObNavigatorComponent} from './navigator.component';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {obliqueProviders} from '../utilities';

export {ObNavigatorComponent} from './navigator.component';

/**
 * @deprecated since version 4.0.0. This module is neither useful nor used and will be removed in future versions
 */
@NgModule({
	imports: [RouterModule],
	declarations: [ObNavigatorComponent],
	providers: obliqueProviders(),
	exports: [ObNavigatorComponent]
})
export class ObNavigatorModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObNavigatorModule);
	}
}
