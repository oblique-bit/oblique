import {Directive} from '@angular/core';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '.offcanvas-backdrop'
})
export class ObMockOffCanvasBackdropDirective {
	close(): void {}
}
