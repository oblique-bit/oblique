import {Directive, HostListener} from '@angular/core';

import {ObOffCanvasService} from './off-canvas.service';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '.ob-off-canvas-backdrop'
})
export class ObOffCanvasBackdropDirective {
	constructor(private readonly offCanvas: ObOffCanvasService) {}

	@HostListener('click')
	@HostListener('window:keyup.Escape')
	close() {
		this.offCanvas.open = false;
	}
}
