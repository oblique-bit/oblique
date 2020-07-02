import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ObUnsavedChangesTabsDirective} from './unsaved-changes-tabs.directive';
import {ObUnsavedChangesTabsService} from './unsaved-changes-tabs.service';
import {ObUnsavedChangesModule} from '../unsaved-changes/unsaved-changes.module';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {obliqueProviders} from '../utilities';

export {ObUnsavedChangesTabsDirective} from './unsaved-changes-tabs.directive';
export {ObUnsavedChangesTabsService} from './unsaved-changes-tabs.service';

@NgModule({
	imports: [CommonModule, ObUnsavedChangesModule],
	declarations: [ObUnsavedChangesTabsDirective],
	providers: obliqueProviders(),
	exports: [ObUnsavedChangesTabsDirective]
})
export class ObUnsavedChangesTabsModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObUnsavedChangesTabsModule);
	}
}
