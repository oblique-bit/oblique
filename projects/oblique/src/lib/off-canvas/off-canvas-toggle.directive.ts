import {Directive, HostListener} from '@angular/core';
import {ObOffCanvasService} from './off-canvas.service';

@Directive({
	selector: '[obOffCanvasToggle]',
	exportAs: 'obOffCanvasToggle'
})
export class ObOffCanvasToggleDirective {
	constructor(private readonly offCanvas: ObOffCanvasService) {}

	@HostListener('click')
	@HostListener('keyup.Enter')
	toggle() {
		// delay the toggle so that any other feature that relies on click has time to update its status
		setTimeout(() => (this.offCanvas.open = !this.offCanvas.open));
	}
}
