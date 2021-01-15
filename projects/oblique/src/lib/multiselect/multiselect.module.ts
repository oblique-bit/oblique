import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

import {ObMultiselectComponent} from './multiselect.component';
import {ObMultiselectSearchPipe} from './multiselect-search.pipe';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {obliqueProviders} from '../utilities';

export {ObMultiselectComponent} from './multiselect.component';
export {ObMultiselectConfig} from './multiselect.config';
export {ObMultiselectSearchPipe} from './multiselect-search.pipe';
export {ObMultiselectTexts} from './multiselect.texts';

@NgModule({
	imports: [CommonModule, FormsModule, TranslateModule],
	exports: [ObMultiselectComponent, ObMultiselectSearchPipe],
	providers: obliqueProviders(),
	declarations: [ObMultiselectComponent, ObMultiselectSearchPipe]
})
export class ObMultiselectModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObMultiselectModule);
	}
}
