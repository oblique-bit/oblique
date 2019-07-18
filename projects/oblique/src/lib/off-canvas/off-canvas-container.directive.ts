import {Directive, HostBinding} from '@angular/core';
import {takeUntil} from 'rxjs/operators';

import {OffCanvasService} from './off-canvas.service';
import {Unsubscribable} from '../unsubscribe.class';

@Directive({
	selector: '.offcanvas, or-master-layout'
})
export class OffCanvasContainerDirective extends Unsubscribable {
	@HostBinding('class.offcanvas-in') open = false;

	constructor(offCanvas: OffCanvasService) {
		super();

		offCanvas.opened
			.pipe(takeUntil(this.unsubscribe))
			.subscribe((value) => {
				this.open = value;
			});
	}
}
