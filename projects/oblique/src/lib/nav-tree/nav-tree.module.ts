import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {TranslateModule} from '@ngx-translate/core';

import {ObNavTreeComponent} from './nav-tree.component';
import {ObNavTreeFakeFocusDirective} from './nav-tree-fake-focus.directive';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {obliqueProviders} from '../utilities';
import {ObIconModule} from '../icon/icon.module';

export {ObNavTreeComponent} from './nav-tree.component';
export {ObNavTreeFakeFocusDirective} from './nav-tree-fake-focus.directive';
export {ObNavTreeItemModel} from './nav-tree-item.model';

@NgModule({
	imports: [CommonModule, NgbModule, RouterModule, TranslateModule, ObIconModule],
	declarations: [ObNavTreeComponent, ObNavTreeFakeFocusDirective],
	providers: obliqueProviders(),
	exports: [ObNavTreeComponent, ObNavTreeFakeFocusDirective]
})
export class ObNavTreeModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObNavTreeModule);
	}
}
