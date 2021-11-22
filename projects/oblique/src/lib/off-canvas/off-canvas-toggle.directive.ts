import {Directive, HostListener, Inject} from '@angular/core';
import {ObOffCanvasService} from './off-canvas.service';
import {WINDOW} from '../utilities';

@Directive({
	selector: '[obOffCanvasToggle]',
	exportAs: 'obOffCanvasToggle',
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'ob-off-canvas-toggle'}
})
export class ObOffCanvasToggleDirective {
	constructor(private readonly offCanvas: ObOffCanvasService, @Inject(WINDOW) private readonly window: Window) {}

	@HostListener('keyup.Enter', ['$event'])
	@HostListener('click', ['$evenẗ́'])
	toggle(event?: KeyboardEvent | MouseEvent) {
		if (!event || event instanceof MouseEvent || (event.target as HTMLElement).nodeName !== 'BUTTON') {
			// delay the toggle so that any other feature that relies on click has time to update its status
			this.window.setTimeout(() => (this.offCanvas.open = !this.offCanvas.open));
		}
	}
}
