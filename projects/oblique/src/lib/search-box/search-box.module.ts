import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';

import {TranslateModule} from '@ngx-translate/core';
import {ObSearchBoxDirective} from './search-box.directive';
import {ObSearchBoxResultsComponent} from './search-box-results.component';
import {ObSearchBoxComponent} from './search-box.component';
import {ObNavTreeModule} from '../nav-tree/nav-tree.module';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {obliqueProviders} from '../utilities';

export {ObSearchBoxResultsComponent} from './search-box-results.component';
export {ObSearchBoxComponent, ObISearchWidgetItem} from './search-box.component';
export {ObSearchBoxDirective} from './search-box.directive';

@NgModule({
	imports: [CommonModule, FormsModule, ObNavTreeModule, TranslateModule, RouterModule],
	declarations: [ObSearchBoxDirective, ObSearchBoxComponent, ObSearchBoxResultsComponent],
	providers: obliqueProviders(),
	exports: [ObSearchBoxDirective, ObSearchBoxComponent],
	entryComponents: [ObSearchBoxResultsComponent]
})
export class ObSearchBoxModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObSearchBoxModule);
	}
}
