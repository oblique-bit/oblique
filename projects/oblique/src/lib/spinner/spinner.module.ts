import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ObSpinnerComponent} from './spinner.component';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {obliqueProviders} from '../utilities';
import {ObIconModule} from '../icon/icon.module';

export {ObSpinnerComponent} from './spinner.component';
export {ObSpinnerService} from './spinner.service';
export {ObISpinnerEvent} from './spinner.model';

@NgModule({
	imports: [CommonModule, ObIconModule],
	declarations: [ObSpinnerComponent],
	providers: obliqueProviders(),
	exports: [ObSpinnerComponent]
})
export class ObSpinnerModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObSpinnerModule);
	}
}
