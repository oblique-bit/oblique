import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';

import {ObInputClearModule} from '../input-clear/input-clear.module';
import {ObFilterBoxComponent} from './filter-box.component';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {obliqueProviders} from '../utilities';

export {ObFilterBoxComponent} from './filter-box.component';

@NgModule({
	imports: [CommonModule, TranslateModule, FormsModule, ObInputClearModule, MatIconModule, MatFormFieldModule, MatInputModule],
	declarations: [ObFilterBoxComponent],
	providers: obliqueProviders(),
	exports: [ObFilterBoxComponent]
})
export class ObFilterBoxModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObFilterBoxModule);
	}
}
