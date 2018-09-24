import {Directive, HostListener} from '@angular/core';

import {OffCanvasService} from './off-canvas.service';

@Directive({
	selector: '.offcanvas-backdrop'
})
export class OffCanvasBackdropDirective {
	constructor(private readonly offCanvas: OffCanvasService) {
	}

	@HostListener('click')
	@HostListener('window:keyup.Escape')
	close() {
		this.offCanvas.open = false;
	}
}
