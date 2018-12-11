import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DropdownComponent} from './dropdown.component';
import { TelemetryService } from '../telemetry/telemetry.service';
import { requireAndRecordTelemetry } from '../telemetry/telemetry-require';

export {DropdownComponent} from './dropdown.component';

@NgModule({
	declarations: [DropdownComponent],
	exports: [DropdownComponent],
	imports: [
		CommonModule
	]
})
export class DropdownModule {
	constructor(telemetry: TelemetryService) {
		requireAndRecordTelemetry(telemetry, DropdownModule);
	}
}
