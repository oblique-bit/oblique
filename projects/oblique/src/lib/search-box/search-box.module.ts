import {MatIconModule} from '@angular/material/icon';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {ObSearchBoxComponent} from './search-box.component';
import {ObNavTreeModule} from '../nav-tree/nav-tree.module';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {obliqueProviders} from '../utilities';
import {ObDropdownModule} from '../dropdown/dropdown.module';

export {ObSearchBoxComponent} from './search-box.component';
export {ObISearchWidgetItem} from './search-box.model';

@NgModule({
	imports: [CommonModule, FormsModule, MatIconModule, ObDropdownModule, ObNavTreeModule, RouterModule, TranslateModule],
	declarations: [ObSearchBoxComponent],
	providers: obliqueProviders(),
	exports: [ObSearchBoxComponent]
})
export class ObSearchBoxModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObSearchBoxModule);
	}
}
