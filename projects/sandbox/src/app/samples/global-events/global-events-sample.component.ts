import {type AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, inject, viewChild} from '@angular/core';
import {ObGlobalEventsService, WINDOW, obOutsideFilter} from '@oblique/oblique';
import {map, scan} from 'rxjs/operators';
import type {Observable} from 'rxjs';
import {Router} from '@angular/router';

@Component({
	selector: 'sb-utilities-sample',
	standalone: false,
	templateUrl: './global-events-sample.component.html',
	changeDetection: ChangeDetectionStrategy.Eager,
})
export class GlobalEventsSampleComponent implements AfterViewInit {
	readonly globalEvents = inject(ObGlobalEventsService);
	readonly router = inject(Router);
	readonly window = inject(WINDOW);

	readonly button = viewChild('outsideClick', {read: ElementRef});
	events$: Observable<EventTarget[]>;

	ngAfterViewInit(): void {
		this.events$ = this.globalEvents.click$.pipe(
			obOutsideFilter(this.button().nativeElement),
			map(event => event.target),
			scan<EventTarget, EventTarget[]>((list, event) => [...list, event], [])
		);
	}

	navigate(): void {
		const randomChar = String.fromCharCode(Math.floor(Math.random() * 26) + 97);
		void this.router.navigate([this.window.location.pathname], {queryParams: {navigate: randomChar}});
	}
}
