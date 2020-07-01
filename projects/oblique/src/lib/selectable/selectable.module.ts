import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ObSelectableDirective} from './selectable.directive';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {obliqueProviders} from '../utilities';

export {ObSelectableService} from './selectable.service';
export {ObSelectableDirective} from './selectable.directive';

@NgModule({
	imports: [CommonModule],
	declarations: [ObSelectableDirective],
	providers: obliqueProviders(),
	exports: [ObSelectableDirective]
})
export class ObSelectableModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObSelectableModule);
	}
}
