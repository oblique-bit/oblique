import {Injectable, Inject} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {DOCUMENT, ɵDomAdapter, ɵgetDOM} from '@angular/platform-browser';
import {LocalStorage} from 'ngx-webstorage';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';

import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/withLatestFrom';

/**
 * LayoutManagerService - Service for controlling ObliqueUI master layout features.
 */
@Injectable()
export class LayoutManagerService {

	@LocalStorage()
	public userLang: string;

	private DOM: ɵDomAdapter;
	private applicationElement: HTMLElement;

	private previousData: any = {};

	constructor(private router: Router,
				private activatedRoute: ActivatedRoute,
				private translate: TranslateService,
				@Inject(DOCUMENT) private document: any,
				@Inject('ObliqueReactive.CONFIG') private config: any) {

		// User lang handling:
		// --------------------
		this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
			// Ensure local value remains in sync:
			this.userLang = event.lang;
		});

		// Define default/fallback lang:
		translate.setDefaultLang((this.config.defaults && this.config.defaults.locale) || 'en');

		// Apply user or default lang:
		this.translate.use(this.userLang || translate.getDefaultLang());

		// Application layout:
		// -------------------
		this.DOM = ɵgetDOM();
		this.applicationElement = this.DOM.querySelector(document, 'body > .application');

		// Subscribe to NavigationEnd events and handle current activated route:
		this.router.events
			.filter(event => event instanceof NavigationEnd)
			.map(() => this.activatedRoute)
			.map(route => {
				while (route.firstChild) {
					route = route.firstChild;
				}
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

	useLang(locale: string) {
		this.translate.use(locale);
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

	private toggleClass(target: HTMLElement, className, previous = null) {
		this.DOM.removeClass(target, previous);
		this.DOM.addClass(target, className || null); // Avoid `undefined`s and empty strings '' as it silently breaks the observable
	}
}
