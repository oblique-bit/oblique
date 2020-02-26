import {Directive, HostListener} from '@angular/core';

import {ObOffCanvasService} from './off-canvas.service';

@Directive({
	selector: '.offcanvas-backdrop'
})
export class ObOffCanvasBackdropDirective {
	constructor(private readonly offCanvas: ObOffCanvasService) {
	}

	@HostListener('click')
	@HostListener('window:keyup.Escape')
	close() {
		this.offCanvas.open = false;
	}
}
