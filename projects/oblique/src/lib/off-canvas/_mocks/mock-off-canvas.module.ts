import {NgModule} from '@angular/core';

import {ObOffCanvasService} from '../off-canvas.module';
import {ObMockOffCanvasToggleDirective} from './mock-off-canvas-toggle.directive';
import {ObMockOffCanvasBackdropDirective} from './mock-off-canvas-backdrop.directive';
import {ObMockOffCanvasContainerDirective} from './mock-off-canvas-container.directive';
import {ObMockOffCanvasService} from './mock-off-canvas.service';

export {ObMockOffCanvasToggleDirective} from './mock-off-canvas-toggle.directive';
export {ObMockOffCanvasBackdropDirective} from './mock-off-canvas-backdrop.directive';
export {ObMockOffCanvasContainerDirective} from './mock-off-canvas-container.directive';
export {ObMockOffCanvasService} from './mock-off-canvas.service';

@NgModule({
	imports: [ObMockOffCanvasBackdropDirective, ObMockOffCanvasContainerDirective, ObMockOffCanvasToggleDirective],
	exports: [ObMockOffCanvasBackdropDirective, ObMockOffCanvasContainerDirective, ObMockOffCanvasToggleDirective],
	providers: [{provide: ObOffCanvasService, useClass: ObMockOffCanvasService}]
})
export class ObMockOffCanvasModule {}
