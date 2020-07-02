import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';

import {ObFilterBoxModule} from '../filter-box/filter-box.module';
import {ObMultiselectComponent} from './multiselect.component';
import {ObMultiselectConfig} from './multiselect.config';
import {ObMultiselectSearchPipe} from './multiselect-search.pipe';
import {ObMultiselectTexts} from './multiselect.texts';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {obliqueProviders} from '../utilities';

export {ObMultiselectComponent} from './multiselect.component';
export {ObMultiselectConfig} from './multiselect.config';
export {ObMultiselectSearchPipe} from './multiselect-search.pipe';
export {ObMultiselectTexts} from './multiselect.texts';

@NgModule({
	imports: [CommonModule, FormsModule, TranslateModule, ObFilterBoxModule],
	exports: [ObMultiselectComponent, ObMultiselectSearchPipe],
	providers: obliqueProviders(),
	declarations: [ObMultiselectComponent, ObMultiselectSearchPipe]
})
export class ObMultiselectModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObMultiselectModule);
	}
}
