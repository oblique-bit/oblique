import {NgModule} from '@angular/core';

import {OffCanvasService} from '../off-canvas.module';
import {MockOffCanvasToggleDirective} from './mock-off-canvas-toggle.directive';
import {MockOffCanvasBackdropDirective} from './mock-off-canvas-backdrop.directive';
import {MockOffCanvasContainerDirective} from './mock-off-canvas-container.directive';
import {MockOffCanvasService} from './mock-off-canvas.service';

export {MockOffCanvasToggleDirective} from './mock-off-canvas-toggle.directive';
export {MockOffCanvasBackdropDirective} from './mock-off-canvas-backdrop.directive';
export {MockOffCanvasContainerDirective} from './mock-off-canvas-container.directive';
export {MockOffCanvasService} from './mock-off-canvas.service';

@NgModule({
	exports: [
		MockOffCanvasToggleDirective,
		MockOffCanvasContainerDirective,
		MockOffCanvasBackdropDirective
	],
	declarations: [
		MockOffCanvasToggleDirective,
		MockOffCanvasContainerDirective,
		MockOffCanvasBackdropDirective
	],
	providers: [
		{provide: OffCanvasService, useClass: MockOffCanvasService}
	]
})
export class MockOffCanvasModule {
}
