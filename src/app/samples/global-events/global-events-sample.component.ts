import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {ObGlobalEventsService, obOutsideFilter} from '@oblique/oblique';
import {map, scan} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
	selector: 'sc-utilities-sample',
	templateUrl: './global-events-sample.component.html'
})
export class GlobalEventsSampleComponent implements AfterViewInit {
	@ViewChild('outsideClick', {read: ElementRef}) button: ElementRef;
	events$: Observable<EventTarget[]>;

	constructor(public readonly globalEvents: ObGlobalEventsService) {}

	ngAfterViewInit(): void {
		this.events$ = this.globalEvents.click$.pipe(
			obOutsideFilter(this.button.nativeElement),
			map(event => event.target),
			scan<EventTarget, EventTarget[]>((list, event) => [...list, event], [])
		);
	}
}
