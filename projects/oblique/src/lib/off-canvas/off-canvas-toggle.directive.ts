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
	private readonly window: Window;
	constructor(private readonly offCanvas: ObOffCanvasService, @Inject(WINDOW) window: any) {
		this.window = window; // because AoT don't accept interfaces as DI
	}

	@HostListener('click')
	@HostListener('keyup.Enter')
	toggle() {
		// delay the toggle so that any other feature that relies on click has time to update its status
		this.window.setTimeout(() => (this.offCanvas.open = !this.offCanvas.open));
	}
}
