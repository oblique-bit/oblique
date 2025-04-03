import {Injectable, signal} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ObICollapseBreakpoints, ObINavigationLink} from '@oblique/oblique';

@Injectable({
	providedIn: 'root'
})
export class DynamicNavigationService {
	navigationLinks$: Observable<ObINavigationLink[]>;
	collapseBreakpoint = signal<ObICollapseBreakpoints>('md');

	private readonly navigationLinks = new Subject<ObINavigationLink[]>();
	private links: ObINavigationLink[] = [];

	constructor() {
		this.navigationLinks$ = this.navigationLinks.asObservable();
	}

	setNavigation(links: ObINavigationLink[]): void {
		this.links = links;
	}

	addLink(link: ObINavigationLink): void {
		link.removable = true;
		this.links = this.links.concat(link);
		this.navigationLinks.next(this.links);
	}

	removeLastLink(): void {
		this.links = this.links.slice(0, -1);
		this.navigationLinks.next(this.links);
	}
}
