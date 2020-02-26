import {Directive} from '@angular/core';

@Directive({
	selector: '.offcanvas, or-master-layout'
})
export class ObMockOffCanvasContainerDirective {
	open = false;
}
