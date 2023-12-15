import {Directive, HostListener, OnDestroy, OnInit} from '@angular/core';

import {ObOffCanvasService} from './off-canvas.service';
import {filter, takeUntil} from 'rxjs/operators';
import {ObGlobalEventsService} from '../global-events/global-events.service';
import {Subject} from 'rxjs';

@Directive({
	// eslint-disable-next-line @angular-eslint/directive-selector
	selector: '.ob-off-canvas-backdrop',
	standalone: true
})
export class ObOffCanvasBackdropDirective implements OnInit, OnDestroy {
	private readonly unsubscribe = new Subject<void>();

	constructor(
		private readonly offCanvas: ObOffCanvasService,
		private readonly globalEventsService: ObGlobalEventsService
	) {}

	@HostListener('click')
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
