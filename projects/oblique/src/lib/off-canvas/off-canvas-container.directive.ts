import {Directive, HostBinding, OnDestroy} from '@angular/core';
import {takeUntil} from 'rxjs/operators';

import {ObOffCanvasService} from './off-canvas.service';
import {Subject} from 'rxjs';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '.ob-off-canvas, ob-master-layout',
	standalone: true
})
export class ObOffCanvasContainerDirective implements OnDestroy {
	@HostBinding('class.ob-off-canvas-in') open = false;
	private readonly unsubscribe = new Subject<void>();

	constructor(offCanvas: ObOffCanvasService) {
		offCanvas.opened$.pipe(takeUntil(this.unsubscribe)).subscribe(value => {
			this.open = value;
		});
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}
