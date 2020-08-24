import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ObSpinnerComponent} from './spinner.component';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {obliqueProviders} from '../utilities';

export {ObSpinnerComponent} from './spinner.component';
export {ObSpinnerService} from './spinner.service';
export {ObISpinnerEvent} from './spinner-event';

@NgModule({
	imports: [CommonModule],
	declarations: [ObSpinnerComponent],
	providers: obliqueProviders(),
	exports: [ObSpinnerComponent]
})
export class ObSpinnerModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObSpinnerModule);
	}
}
