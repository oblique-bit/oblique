import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {ObOffCanvasToggleDirective} from './off-canvas-toggle.directive';
import {ObOffCanvasContainerDirective} from './off-canvas-container.directive';
import {ObOffCanvasBackdropDirective} from './off-canvas-backdrop.directive';
import {ObTelemetryService} from '../telemetry/telemetry.service';
import {requireAndRecordTelemetry} from '../telemetry/telemetry-require';
import {obliqueProviders} from '../utilities';

export {ObOffCanvasToggleDirective} from './off-canvas-toggle.directive';
export {ObOffCanvasService} from './off-canvas.service';
export {ObOffCanvasContainerDirective} from './off-canvas-container.directive';
export {ObOffCanvasBackdropDirective} from './off-canvas-backdrop.directive';

@NgModule({
	imports: [CommonModule],
	declarations: [ObOffCanvasToggleDirective, ObOffCanvasContainerDirective, ObOffCanvasBackdropDirective],
	providers: obliqueProviders(),
	exports: [ObOffCanvasToggleDirective, ObOffCanvasContainerDirective, ObOffCanvasBackdropDirective]
})
export class ObOffCanvasModule {
	constructor(telemetry: ObTelemetryService) {
		requireAndRecordTelemetry(telemetry, ObOffCanvasModule);
	}
}
