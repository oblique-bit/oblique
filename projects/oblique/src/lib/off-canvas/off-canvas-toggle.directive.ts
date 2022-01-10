import {Directive, HostListener, Inject} from '@angular/core';
import {ObOffCanvasService} from './off-canvas.service';
import {WINDOW, isNotKeyboardEventOnButton} from '../utilities';

@Directive({
	selector: '[obOffCanvasToggle]',
	exportAs: 'obOffCanvasToggle',
	host: {class: 'ob-off-canvas-toggle'}
})
export class ObOffCanvasToggleDirective {
	constructor(private readonly offCanvas: ObOffCanvasService, @Inject(WINDOW) private readonly window: Window) {}

	@HostListener('click', ['$event'])
	@HostListener('keyup.enter', ['$event'])
	toggle(event?: KeyboardEvent | MouseEvent): void {
		if (isNotKeyboardEventOnButton(event)) {
			// delay the toggle so that any other feature that relies on click has time to update its status
			this.window.setTimeout(() => (this.offCanvas.open = !this.offCanvas.open));
		}
	}
}
