import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatIconModule} from '@angular/material/icon';
import {TranslateModule} from '@ngx-translate/core';

import {obliqueProviders} from '../utilities';
import {ObAlertComponent} from './alert.component';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';

export {ObAlertComponent, OBLIQUE_HAS_ROLE_ALERT} from './alert.component';
export {ObIAlertType} from './alert.model';

@NgModule({
	declarations: [ObAlertComponent],
	imports: [CommonModule, MatIconModule, TranslateModule],
	providers: obliqueProviders(),
	exports: [ObAlertComponent]
})
export class ObAlertModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObAlertModule);
	}
}
