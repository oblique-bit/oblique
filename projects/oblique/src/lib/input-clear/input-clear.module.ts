import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

import {ObInputClearDirective} from './input-clear.directive';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {obliqueProviders} from '../utilities';

export {ObInputClearDirective} from './input-clear.directive';

@NgModule({
	imports: [CommonModule, FormsModule, TranslateModule],
	declarations: [ObInputClearDirective],
	providers: obliqueProviders(),
	exports: [ObInputClearDirective]
})
export class ObInputClearModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObInputClearModule);
	}
}
