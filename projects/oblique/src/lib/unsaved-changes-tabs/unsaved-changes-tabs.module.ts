import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

import {ObUnsavedChangesTabsDirective} from './unsaved-changes-tabs.directive';
import {ObUnsavedChangesTabsService} from './unsaved-changes-tabs.service';
import {ObUnsavedChangesModule} from '../unsaved-changes/unsaved-changes.module';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {WINDOW, windowProvider} from '../utilities';

export {ObUnsavedChangesTabsDirective} from './unsaved-changes-tabs.directive';
export {ObUnsavedChangesTabsService} from './unsaved-changes-tabs.service';

@NgModule({
	imports: [CommonModule, ObUnsavedChangesModule],
	declarations: [ObUnsavedChangesTabsDirective],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}},
		{provide: WINDOW, useFactory: windowProvider}
	],
	exports: [ObUnsavedChangesTabsDirective]
})
export class ObUnsavedChangesTabsModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObUnsavedChangesTabsModule);
	}
}
