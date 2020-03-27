import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material/form-field';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';

import {ObOffCanvasToggleDirective} from './off-canvas-toggle.directive';
import {ObOffCanvasService} from './off-canvas.service';
import {ObOffCanvasContainerDirective} from './off-canvas-container.directive';
import {ObOffCanvasBackdropDirective} from './off-canvas-backdrop.directive';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {WINDOW, windowProvider} from '../utilities';

export {ObOffCanvasToggleDirective} from './off-canvas-toggle.directive';
export {ObOffCanvasService} from './off-canvas.service';
export {ObOffCanvasContainerDirective} from './off-canvas-container.directive';
export {ObOffCanvasBackdropDirective} from './off-canvas-backdrop.directive';

@NgModule({
	imports: [CommonModule],
	declarations: [ObOffCanvasToggleDirective, ObOffCanvasContainerDirective, ObOffCanvasBackdropDirective],
	providers: [
		{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}},
		{provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}},
		{provide: WINDOW, useFactory: windowProvider}
	],
	exports: [ObOffCanvasToggleDirective, ObOffCanvasContainerDirective, ObOffCanvasBackdropDirective]
})
export class ObOffCanvasModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObOffCanvasModule);
	}
}
