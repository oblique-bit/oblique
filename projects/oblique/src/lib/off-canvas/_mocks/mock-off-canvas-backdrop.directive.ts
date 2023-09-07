import {Directive} from '@angular/core';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '.ob-off-canvas-backdrop',
	standalone: true
})
export class ObMockOffCanvasBackdropDirective {
	close(): void {}
}
