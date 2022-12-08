import {APP_INITIALIZER, ModuleWithProviders, NgModule} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {obliqueProviders} from '../utilities';
import {ObIconService} from './icon.service';
import {ObIconConfig, ObTIconConfig, defaultIconConfig, iconFactory} from './icon.model';

export {ObIconService} from './icon.service';
export {ObIconConfig, ObTIconConfig, ObEIcon} from './icon.model';

@NgModule({
	imports: [CommonModule, MatIconModule],
	providers: [...obliqueProviders()]
})
export class ObIconModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObIconModule);
	}

	static forRoot(config?: ObIconConfig): ModuleWithProviders<ObIconModule> {
		return {
			ngModule: ObIconModule,
			providers: [
				{provide: ObTIconConfig, useValue: config || defaultIconConfig},
				{
					provide: APP_INITIALIZER,
					multi: true,
					useFactory: iconFactory,
					deps: [ObIconService]
				}
			]
		};
	}
}
