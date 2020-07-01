import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

import {ObTopControlComponent} from './top-control.component';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {obliqueProviders} from '../utilities';

export {ObTopControlComponent} from './top-control.component';
export {ObScrollingEvents} from './scrolling-events';

@NgModule({
	imports: [CommonModule, TranslateModule],
	declarations: [ObTopControlComponent],
	providers: obliqueProviders(),
	exports: [ObTopControlComponent]
})
export class ObScrollingModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObScrollingModule);
	}
}
