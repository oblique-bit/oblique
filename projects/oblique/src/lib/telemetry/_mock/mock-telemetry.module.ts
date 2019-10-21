import {NgModule} from '@angular/core';
import {MockTelemetryService} from './mock-telemetry.service';
import {TelemetryService} from '../telemetry.service';

export {MockTelemetryService} from './mock-telemetry.service';

@NgModule({
	providers: [
		{provide: TelemetryService, useClass: MockTelemetryService}
	]
})
export class MockTelemetryModule {
}
