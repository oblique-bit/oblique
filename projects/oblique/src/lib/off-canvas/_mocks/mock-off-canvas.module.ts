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

/**
 *  @deprecated since Oblique 11. It will be removed with Oblique 12. Use the real instances instead
 */
@NgModule({
	imports: [ObMockOffCanvasBackdropDirective, ObMockOffCanvasContainerDirective, ObMockOffCanvasToggleDirective],
	providers: [{provide: ObOffCanvasService, useClass: ObMockOffCanvasService}],
	exports: [ObMockOffCanvasBackdropDirective, ObMockOffCanvasContainerDirective, ObMockOffCanvasToggleDirective],
})
export class ObMockOffCanvasModule {}
