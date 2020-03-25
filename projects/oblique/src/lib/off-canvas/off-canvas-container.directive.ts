import {Directive, HostBinding} from '@angular/core';
import {takeUntil} from 'rxjs/operators';

import {ObOffCanvasService} from './off-canvas.service';
import {ObUnsubscribable} from '../unsubscribe.class';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '.offcanvas, ob-master-layout'
})
export class ObOffCanvasContainerDirective extends ObUnsubscribable {
	@HostBinding('class.offcanvas-in') open = false;

	constructor(offCanvas: ObOffCanvasService) {
		super();

		offCanvas.opened
			.pipe(takeUntil(this.unsubscribe))
			.subscribe((value) => {
				this.open = value;
			});
	}
}
