import {NgModule} from '@angular/core';
import {MatPaginatorIntl, MatPaginatorModule} from '@angular/material/paginator';

import {ObPaginatorService} from './ob-paginator.service';
import {obliqueProviders} from '../utilities';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';

export {ObPaginatorService} from './ob-paginator.service';

@NgModule({
	imports: [MatPaginatorModule],
	exports: [MatPaginatorModule],
	providers: [ObPaginatorService, {provide: MatPaginatorIntl, useClass: ObPaginatorService}, ...obliqueProviders()]
})
export class ObPaginatorModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObPaginatorModule);
	}
}
