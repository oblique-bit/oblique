import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

import {ObUnsavedChangesDirective} from './unsaved-changes.directive';
import {ObUnsavedChangesService} from './unsaved-changes.service';
import {ObUnsavedChangesGuard} from './unsaved-changes.guard';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {WINDOW, windowProvider} from '../utilities';

export {ObUnsavedChangesDirective} from './unsaved-changes.directive';
export {ObUnsavedChangesService} from './unsaved-changes.service';
export {ObUnsavedChangesGuard} from './unsaved-changes.guard';

@NgModule({
	imports: [CommonModule],
	declarations: [ObUnsavedChangesDirective],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}},
		{provide: WINDOW, useFactory: windowProvider}
	],
	exports: [ObUnsavedChangesDirective]
})
export class ObUnsavedChangesModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObUnsavedChangesModule);
	}
}
