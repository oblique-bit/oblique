import {type AfterViewInit, Component, ElementRef, inject, viewChild} from '@angular/core';
import {ObGlobalEventsService, obOutsideFilter} from '@oblique/oblique';
import {map, scan} from 'rxjs/operators';
import type {Observable} from 'rxjs';

@Component({
	selector: 'sb-utilities-sample',
	standalone: false,
	templateUrl: './global-events-sample.component.html'
})
export class GlobalEventsSampleComponent implements AfterViewInit {
	readonly globalEvents = inject(ObGlobalEventsService);

	readonly button = viewChild('outsideClick', {read: ElementRef});
	events$: Observable<EventTarget[]>;

	ngAfterViewInit(): void {
		this.events$ = this.globalEvents.click$.pipe(
			obOutsideFilter(this.button().nativeElement),
			map(event => event.target),
			scan<EventTarget, EventTarget[]>((list, event) => [...list, event], [])
		);
	}
}
