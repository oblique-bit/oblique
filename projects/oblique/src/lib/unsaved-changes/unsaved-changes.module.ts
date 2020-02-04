import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

import {UnsavedChangesDirective} from './unsaved-changes.directive';
import {UnsavedChangesService} from './unsaved-changes.service';
import {UnsavedChangesGuard} from './unsaved-changes.guard';
import {TelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {WINDOW, windowProvider} from '../utilities';

export {UnsavedChangesDirective} from './unsaved-changes.directive';
export {UnsavedChangesService} from './unsaved-changes.service';
export {UnsavedChangesGuard} from './unsaved-changes.guard';

@NgModule({
	imports: [CommonModule],
	declarations: [UnsavedChangesDirective],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: STEPPER_GLOBAL_OPTIONS, useValue: { displayDefaultIndicatorType: false }},
		{provide: WINDOW, useFactory: windowProvider}
	],
	exports: [UnsavedChangesDirective]
})
export class UnsavedChangesModule {
	constructor(telemetry: TelemetryService) {
		requireAndRecordTelemetry(telemetry, UnsavedChangesModule);
	}
}
