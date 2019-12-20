import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material';

import {UnsavedChangesTabsDirective} from './unsaved-changes-tabs.directive';
import {UnsavedChangesTabsService} from './unsaved-changes-tabs.service';
import {UnsavedChangesModule} from '../unsaved-changes/unsaved-changes.module';
import {TelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {WINDOW, windowProvider} from '../utilities';

export {UnsavedChangesTabsDirective} from './unsaved-changes-tabs.directive';
export {UnsavedChangesTabsService} from './unsaved-changes-tabs.service';

@NgModule({
	imports: [CommonModule, UnsavedChangesModule],
	declarations: [UnsavedChangesTabsDirective],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: WINDOW, useFactory: windowProvider}
	],
	exports: [UnsavedChangesTabsDirective]
})
export class UnsavedChangesTabsModule {
	constructor(telemetry: TelemetryService) {
		requireAndRecordTelemetry(telemetry, UnsavedChangesTabsModule);
	}
}
