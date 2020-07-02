import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {ObFormControlStateDirective} from './form-control-state.directive';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {obliqueProviders} from '../utilities';

export {ObFormControlStateDirective} from './form-control-state.directive';

@NgModule({
	imports: [CommonModule, FormsModule],
	declarations: [ObFormControlStateDirective],
	providers: obliqueProviders(),
	exports: [ObFormControlStateDirective]
})
export class ObFormControlStateModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObFormControlStateModule);
	}
}
