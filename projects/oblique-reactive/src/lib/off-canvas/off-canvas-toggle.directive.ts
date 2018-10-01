import {Directive, HostListener} from '@angular/core';

import {OffCanvasService} from './off-canvas.service';

@Directive({
	selector: '[orOffCanvasToggle]',
	exportAs: 'orOffCanvasToggle'
})
export class OffCanvasToggleDirective {

	constructor(private readonly offCanvas: OffCanvasService) {
	}

	@HostListener('click')
	@HostListener('window:keyup.Enter')
	toggle() {
		this.offCanvas.open = !this.offCanvas.open;
	}
}
