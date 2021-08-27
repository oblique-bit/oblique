import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ObINavigationLink} from '@oblique/oblique';

@Injectable({
	providedIn: 'root'
})
export class DynamicNavigationService {
	navigationLinks$: Observable<ObINavigationLink[]>;

	private readonly navigationLinks = new Subject<ObINavigationLink[]>();
	private links: ObINavigationLink[] = [];

	constructor() {
		this.navigationLinks$ = this.navigationLinks.asObservable();
	}

	setNavigation(links: ObINavigationLink[]) {
		this.links = links;
	}

	addLink(link: ObINavigationLink) {
		this.links.push(link);
		this.navigationLinks.next(this.links);
	}

	removeLastLink() {
		this.links.pop();
		this.navigationLinks.next(this.links);
	}
}
