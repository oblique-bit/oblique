import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

import {ObColumnLayoutComponent} from './column-layout.component';
import {ObColumnToggleDirective} from './column-toggle.directive';
import {ObColumnPanelDirective} from './column-panel.directive';

import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {obliqueProviders} from '../utilities';
import {ObIconModule} from '../icon/icon.module';

export {ObColumnLayoutComponent} from './column-layout.component';
export {ObColumnPanelDirective} from './column-panel.directive';
export {ObColumnToggleDirective} from './column-toggle.directive';

@NgModule({
	imports: [CommonModule, TranslateModule, ObIconModule],
	declarations: [ObColumnLayoutComponent, ObColumnPanelDirective, ObColumnToggleDirective],
	providers: obliqueProviders(),
	exports: [ObColumnLayoutComponent, ObColumnPanelDirective, ObColumnToggleDirective]
})
export class ObColumnLayoutModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObColumnLayoutModule);
	}
}
