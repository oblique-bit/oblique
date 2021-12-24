import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {ObGlobalEventsService, obOutsideFilter} from '@oblique/oblique';

@Component({
	selector: 'sc-utilities-sample',
	templateUrl: './global-events-sample.component.html'
})
export class GlobalEventsSampleComponent implements AfterViewInit {
	@ViewChild('outsideClick', {read: ElementRef}) button: ElementRef;
	events = [];

	constructor(public readonly globalEvents: ObGlobalEventsService) {}

	ngAfterViewInit() {
		this.globalEvents.click$.pipe(obOutsideFilter(this.button.nativeElement)).subscribe(event => this.events.push(event.target));
	}
}
