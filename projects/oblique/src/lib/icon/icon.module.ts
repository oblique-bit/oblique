import {APP_INITIALIZER, ModuleWithProviders, NgModule} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {CommonModule} from '@angular/common';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {obliqueProviders} from '../utilities';
import {ObIconService} from './icon.service';
import {defaultIconConfig, ObTIconConfig, ObIconConfig, iconFactory} from './icon.model';
import {ObIconComponent} from './ob-icon.component';

export {ObIconService} from './icon.service';
export {ObIconConfig, ObTIconConfig, ObUseObliqueIcons, ObEIcon} from './icon.model';
export {ObIconComponent} from './ob-icon.component';

@NgModule({
	imports: [MatIconModule, CommonModule],
	providers: [...obliqueProviders()],
	declarations: [ObIconComponent],
	exports: [ObIconComponent]
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
