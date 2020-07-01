import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ObDropdownComponent} from './dropdown.component';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {obliqueProviders} from '../utilities';

export {ObDropdownComponent} from './dropdown.component';

@NgModule({
	imports: [CommonModule],
	declarations: [ObDropdownComponent],
	exports: [ObDropdownComponent],
	providers: obliqueProviders()
})
export class ObDropdownModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObDropdownModule);
	}
}
