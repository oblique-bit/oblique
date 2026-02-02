import {Directive, OnDestroy} from '@angular/core';
import {takeUntil} from 'rxjs/operators';

import {ObOffCanvasService} from './off-canvas.service';
import {Subject} from 'rxjs';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '.ob-off-canvas, ob-master-layout',
	standalone: true,
	host: {
		'[class.ob-off-canvas-in]': 'open',
	},
})
export class ObOffCanvasContainerDirective implements OnDestroy {
	open = false;
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
