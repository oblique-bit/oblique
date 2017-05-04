import {Injectable, Inject} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {DOCUMENT, ɵDomAdapter, ɵgetDOM} from '@angular/platform-browser';
import {LocalStorage} from 'ngx-webstorage';
import {TranslateService} from '@ngx-translate/core';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/withLatestFrom';

/**
 * LayoutManagerService - Service for controlling ObliqueUI master layout features.
 */
@Injectable()
export class LayoutManagerService {

	@LocalStorage()
	public userLocale: string;

	private DOM: ɵDomAdapter;
	private applicationElement: HTMLElement;

	private previousData: any = {};

	constructor(private router: Router,
	            private activatedRoute: ActivatedRoute,
	            private translate: TranslateService,
	            @Inject(DOCUMENT) private document: any,
	            @Inject('ObliqueReactive.CONFIG') private config: any) {

		// User locale:
		if (this.userLocale) {
			this.translate.use(this.userLocale);
		} else if (config.defaults) {
			this.translate.use(config.defaults.locale);
		}

		// Application layout:
		this.DOM = ɵgetDOM();
		this.applicationElement = this.DOM.querySelector(document, 'body > .application');

		// Subscribe to NavigationEnd events and handle current activated route:
		this.router.events
			.filter(event => event instanceof NavigationEnd)
			.map(() => this.activatedRoute)
			.map(route => {
				while (route.firstChild) route = route.firstChild;
				return route;
			})
			.filter(route => route.outlet === 'primary')
			.mergeMap(route => route.data)
			.subscribe((data) => {
				let uiLayout = data.uiLayout || {};
				this.toggleClass(this.applicationElement, uiLayout.application, this.previousData.application);
				this.previousData = uiLayout;
			});
	}

	toggleClass(target: HTMLElement, className, previous = null) {
		this.DOM.removeClass(target, previous);
		this.DOM.addClass(target, className || null); // Avoid `undefined`s and empty strings '' as it silently breaks the observable
	}

	get cover(): boolean {
		return this.DOM.hasClass(this.applicationElement, 'has-cover');
	}

	set cover(value: boolean) {
		if (value) {
			this.toggleClass(this.applicationElement, 'has-cover');
		} else {
			this.toggleClass(this.applicationElement, null, 'has-cover');
		}
	}

	set navigation(value: boolean) {
		if (value) {
			this.toggleClass(this.applicationElement, null, 'no-navigation');
		} else {
			this.toggleClass(this.applicationElement, 'no-navigation');
		}
	}
}
