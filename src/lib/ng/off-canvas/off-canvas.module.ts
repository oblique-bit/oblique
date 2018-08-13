import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {OffCanvasToggleDirective} from './off-canvas-toggle.directive';
import {OffCanvasService} from './off-canvas.service';
import {OffCanvasContainerDirective} from './off-canvas-container.directive';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		OffCanvasToggleDirective,
		OffCanvasContainerDirective
	],
	exports: [
		OffCanvasToggleDirective,
		OffCanvasContainerDirective
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
