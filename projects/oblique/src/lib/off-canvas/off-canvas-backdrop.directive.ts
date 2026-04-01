import {Directive, OnDestroy, OnInit, inject} from '@angular/core';

import {ObOffCanvasService} from './off-canvas.service';
import {filter, takeUntil} from 'rxjs/operators';
import {ObGlobalEventsService} from '../global-events/global-events.service';
import {Subject} from 'rxjs';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '.ob-off-canvas-backdrop',
	host: {
		'(click)': 'close()',
	},
})
export class ObOffCanvasBackdropDirective implements OnInit, OnDestroy {
	private readonly offCanvas = inject(ObOffCanvasService);
	private readonly globalEventsService = inject(ObGlobalEventsService);
	private readonly unsubscribe = new Subject<void>();

	close(): void {
		this.offCanvas.open = false;
	}

	ngOnInit(): void {
		this.globalEventsService.keyUp$
			.pipe(
				filter(event => event.key === 'Escape'),
				filter(() => this.offCanvas.open),
				takeUntil(this.unsubscribe)
			)
			.subscribe(() => this.close());
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}
}
