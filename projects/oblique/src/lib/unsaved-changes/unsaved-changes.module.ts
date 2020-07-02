import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ObUnsavedChangesDirective} from './unsaved-changes.directive';
import {ObUnsavedChangesService} from './unsaved-changes.service';
import {ObUnsavedChangesGuard} from './unsaved-changes.guard';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {obliqueProviders} from '../utilities';

export {ObUnsavedChangesDirective} from './unsaved-changes.directive';
export {ObUnsavedChangesService} from './unsaved-changes.service';
export {ObUnsavedChangesGuard} from './unsaved-changes.guard';

@NgModule({
	imports: [CommonModule],
	declarations: [ObUnsavedChangesDirective],
	providers: obliqueProviders(),
	exports: [ObUnsavedChangesDirective]
})
export class ObUnsavedChangesModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObUnsavedChangesModule);
	}
}
