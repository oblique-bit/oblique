import {NgModule} from '@angular/core';

import {ObOffCanvasToggleDirective} from './off-canvas-toggle.directive';
import {ObOffCanvasContainerDirective} from './off-canvas-container.directive';
import {ObOffCanvasBackdropDirective} from './off-canvas-backdrop.directive';

export {ObOffCanvasToggleDirective} from './off-canvas-toggle.directive';
export {ObOffCanvasService} from './off-canvas.service';
export {ObOffCanvasContainerDirective} from './off-canvas-container.directive';
export {ObOffCanvasBackdropDirective} from './off-canvas-backdrop.directive';

@NgModule({
	imports: [ObOffCanvasBackdropDirective, ObOffCanvasContainerDirective, ObOffCanvasToggleDirective],
	exports: [ObOffCanvasBackdropDirective, ObOffCanvasContainerDirective, ObOffCanvasToggleDirective]
})
export class ObOffCanvasModule {}
