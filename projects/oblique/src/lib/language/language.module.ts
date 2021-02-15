import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ObDatePipe} from './date.pipe';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';

export {ObDatePipe} from './date.pipe';
export {ObLanguageService} from './language.service';

@NgModule({
	declarations: [ObDatePipe],
	exports: [ObDatePipe],
	imports: [CommonModule]
})
export class ObLanguageModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObLanguageModule);
	}
}
