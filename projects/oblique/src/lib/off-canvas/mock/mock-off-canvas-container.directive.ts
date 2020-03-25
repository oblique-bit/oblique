import {Directive} from '@angular/core';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '.offcanvas, ob-master-layout'
})
export class ObMockOffCanvasContainerDirective {
	open = false;
}
