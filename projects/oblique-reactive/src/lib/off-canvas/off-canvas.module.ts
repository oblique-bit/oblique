import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {OffCanvasToggleDirective} from './off-canvas-toggle.directive';
import {OffCanvasService} from './off-canvas.service';
import {OffCanvasContainerDirective} from './off-canvas-container.directive';
import {OffCanvasBackdropDirective} from './off-canvas-backdrop.directive';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		OffCanvasToggleDirective,
		OffCanvasContainerDirective,
		OffCanvasBackdropDirective
	],
	exports: [
		OffCanvasToggleDirective,
		OffCanvasContainerDirective,
		OffCanvasBackdropDirective
	]
})
export class OffCanvasModule {
	static forRoot(): ModuleWithProviders {
		return {
			ngModule: OffCanvasModule,
			providers: [OffCanvasService]
		};
	}
}
