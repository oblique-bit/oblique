import {Directive, inject} from '@angular/core';
import {ObOffCanvasService} from './off-canvas.service';
import {isNotKeyboardEventOnButton} from '../utilities';
import {WINDOW} from '../window/window.provider';
import {ObWindow} from '../window/window.provider.model';

@Directive({
	selector: '[obOffCanvasToggle]',
	host: {
		'(click)': 'toggle($event)',
		'(keyup.enter)': 'toggle($event)',
		class: 'ob-off-canvas-toggle',
	},
	exportAs: 'obOffCanvasToggle',
})
export class ObOffCanvasToggleDirective {
	private readonly window = inject<ObWindow>(WINDOW);
	private readonly offCanvas = inject(ObOffCanvasService);

	toggle(event?: KeyboardEvent | MouseEvent): void {
		if (isNotKeyboardEventOnButton(event)) {
			// delay the toggle so that any other feature that relies on click has time to update its status
			this.window.setTimeout(() => (this.offCanvas.open = !this.offCanvas.open));
		}
	}
}
