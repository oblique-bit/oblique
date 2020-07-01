import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ObStickyComponent} from './sticky.component';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {obliqueProviders} from '../utilities';

export {ObStickyComponent} from './sticky.component';

@NgModule({
	imports: [CommonModule],
	declarations: [ObStickyComponent],
	exports: [ObStickyComponent],
	providers: obliqueProviders()
})
export class ObStickyModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObStickyModule);
	}
}
