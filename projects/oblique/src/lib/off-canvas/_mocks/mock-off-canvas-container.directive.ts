import {Directive} from '@angular/core';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '.ob-off-canvas, ob-master-layout'
})
export class ObMockOffCanvasContainerDirective {
	open = false;
}
