import {Directive} from '@angular/core';

@Directive({
	selector: '.offcanvas-backdrop'
})
export class MockOffCanvasBackdropDirective {
	close(): void {
	}
}
