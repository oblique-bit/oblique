import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {obliqueProviders} from '../utilities';
import {ObPopoverDirective} from './popover.directive';

export {ObPopoverDirective} from './popover.directive';

@NgModule({
	imports: [CommonModule],
	declarations: [ObPopoverDirective],
	providers: obliqueProviders(),
	exports: [ObPopoverDirective]
})
export class ObPopoverModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObPopoverModule);
	}
}
