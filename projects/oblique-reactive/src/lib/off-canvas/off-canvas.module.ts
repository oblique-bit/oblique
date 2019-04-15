import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MAT_FORM_FIELD_DEFAULT_OPTIONS} from '@angular/material';

import {OffCanvasToggleDirective} from './off-canvas-toggle.directive';
import {OffCanvasService} from './off-canvas.service';
import {OffCanvasContainerDirective} from './off-canvas-container.directive';
import {OffCanvasBackdropDirective} from './off-canvas-backdrop.directive';

export {OffCanvasToggleDirective} from './off-canvas-toggle.directive';
export {OffCanvasService} from './off-canvas.service';
export {OffCanvasContainerDirective} from './off-canvas-container.directive';
export {OffCanvasBackdropDirective} from './off-canvas-backdrop.directive';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [
		OffCanvasToggleDirective,
		OffCanvasContainerDirective,
		OffCanvasBackdropDirective
	],
	providers: [{provide: MAT_FORM_FIELD_DEFAULT_OPTIONS, useValue: {appearance: 'outline'}}],
	exports: [
		OffCanvasToggleDirective,
		OffCanvasContainerDirective,
		OffCanvasBackdropDirective
	]
})
export class OffCanvasModule {
}
