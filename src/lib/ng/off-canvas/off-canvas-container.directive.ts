import {Directive, HostBinding} from '@angular/core';
import {takeUntil} from 'rxjs/operators';

import {OffCanvasService} from './off-canvas.service';
import {Unsubscribable} from '../unsubscribe';

@Directive({
	selector: '.offcanvas'
})
export class OffCanvasContainerDirective extends Unsubscribable {
	@HostBinding('class.offcanvas-in') open = false;

	constructor(offCanvas: OffCanvasService) {
		super();
		offCanvas.openEmitter
			.pipe(takeUntil(this.unsubscribe))
			.subscribe((value) => {
				this.open = value;
			});
	}
}
