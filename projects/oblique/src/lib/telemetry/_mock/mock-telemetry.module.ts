import {NgModule} from '@angular/core';
import {ObMockTelemetryService} from './mock-telemetry.service';
import {ObTelemetryService} from '../telemetry.service';

export {ObMockTelemetryService} from './mock-telemetry.service';

@NgModule({
	providers: [
		{provide: ObTelemetryService, useClass: ObMockTelemetryService}
	]
})
export class ObMockTelemetryModule {
}
