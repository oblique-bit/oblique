import {Directive} from '@angular/core';

@Directive({
	selector: '.offcanvas, ob-master-layout'
})
export class ObMockOffCanvasContainerDirective {
	open = false;
}
