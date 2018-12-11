import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {StickyComponent} from './sticky.component';
import { TelemetryService } from '../telemetry/telemetry.service';
import { requireAndRecordTelemetry } from '../telemetry/telemetry-require';

export {StickyComponent}  from './sticky.component';

@NgModule({
	imports: [CommonModule],
	declarations: [StickyComponent],
	exports: [StickyComponent]
})
export class StickyModule {
	constructor(telemetry: TelemetryService) {
		requireAndRecordTelemetry(telemetry, StickyModule);
	}
}
