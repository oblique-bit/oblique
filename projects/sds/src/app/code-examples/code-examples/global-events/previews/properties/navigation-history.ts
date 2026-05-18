import {Injectable, inject, signal} from '@angular/core';
import {ObGlobalEventsService} from '@oblique/oblique';

@Injectable({
	providedIn: 'root',
})
export class NavigationHistory {
	readonly history = signal<string[]>([]);

	constructor() {
		inject(ObGlobalEventsService).navigate$.subscribe(event => {
			this.history.update(recentUrls => [event.destination.url, ...recentUrls].slice(0, 5));
		});
	}
}
