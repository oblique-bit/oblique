import {Directive} from '@angular/core';

@Directive({
	selector: '.offcanvas-backdrop'
})
export class ObMockOffCanvasBackdropDirective {
	close(): void {
	}
}
