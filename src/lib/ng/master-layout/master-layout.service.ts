import {EventEmitter, Injectable} from '@angular/core';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, mergeMap, takeUntil} from 'rxjs/operators';
import {Observable} from 'rxjs';

import {Unsubscribable} from '../unsubscribe';

@Injectable()
export class MasterLayoutService extends Unsubscribable {
	applicationFixedChange: Observable<boolean>;
	footerSmallChange: Observable<boolean>;
	headerMediumChange: Observable<boolean>;
	headerAnimateChange: Observable<boolean>;
	headerStickyChange: Observable<boolean>;
	noNavigationChange: Observable<boolean>;
	navigationFullWidthChange: Observable<boolean>;
	coverLayoutChange: Observable<boolean>;
	menuCollapsedChange: Observable<boolean>;

	get userLang(): string {
		return this.translate.currentLang;
	}

	set userLang(lang: string) {
		this.translate.use(lang);
		localStorage.setItem('oblique:langoblique:lang', lang);
	}

	get applicationFixed(): boolean {
		return this.isApplicationFixed;
	}

	set applicationFixed(value: boolean) {
		this.isApplicationFixed = value;
		this.applicationFixedEmitter.emit(value);
	}

	get smallFooter(): boolean {
		return this.isFooterSmall;
	}

	set smallFooter(value: boolean) {
		this.isFooterSmall = value;
		this.footerSmallEmitter.emit(value);
	}

	get mediumHeader(): boolean {
		return this.isHeaderMedium;
	}

	set mediumHeader(value: boolean) {
		this.isHeaderMedium = value;
		this.headerMediumEmitter.emit(value);
	}

	get animateHeader(): boolean {
		return this.isHeaderAnimated;
	}

	set animateHeader(value: boolean) {
		this.isHeaderAnimated = value;
		this.headerAnimateEmitter.emit(value);
	}

	get stickyHeader(): boolean {
		return this.isHeaderSticky;
	}

	set stickyHeader(value: boolean) {
		this.isHeaderSticky = value;
		this.headerStickyEmitter.emit(value);
	}

	get noNavigation(): boolean {
		return this.hasNavigation;
	}

	set noNavigation(value: boolean) {
		this.hasNavigation = value;
		this.noNavigationEmitter.emit(value);
	}

	get navigationFullWidth(): boolean {
		return this.isNavigationFullWidth;
	}

	set navigationFullWidth(value: boolean) {
		this.isNavigationFullWidth = value;
		this.navigationFullWidthEmitter.emit(value);
	}

	get coverLayout(): boolean {
		return this.hasCoverLayout;
	}

	set coverLayout(value: boolean) {
		this.hasCoverLayout = value;
		this.coverLayoutEmitter.emit(value);
	}

	get menuCollapsed(): boolean {
		return this.isMenuCollapsed;
	}

	set menuCollapsed(value: boolean) {
		this.isMenuCollapsed = value;
		this.menuCollapsedEmitter.emit(value);
	}

	private isApplicationFixed: boolean;
	private isFooterSmall: boolean;
	private isHeaderMedium: boolean;
	private isHeaderAnimated: boolean;
	private isHeaderSticky: boolean;
	private hasNavigation: boolean;
	private isNavigationFullWidth: boolean;
	private hasCoverLayout: boolean;
	private isMenuCollapsed: boolean;
	private readonly applicationFixedEmitter: EventEmitter<boolean> = new EventEmitter();
	private readonly footerSmallEmitter: EventEmitter<boolean> = new EventEmitter();
	private readonly headerMediumEmitter: EventEmitter<boolean> = new EventEmitter();
	private readonly headerAnimateEmitter: EventEmitter<boolean> = new EventEmitter();
	private readonly headerStickyEmitter: EventEmitter<boolean> = new EventEmitter();
	private readonly noNavigationEmitter: EventEmitter<boolean> = new EventEmitter();
	private readonly navigationFullWidthEmitter: EventEmitter<boolean> = new EventEmitter();
	private readonly coverLayoutEmitter: EventEmitter<boolean> = new EventEmitter();
	private readonly menuCollapsedEmitter: EventEmitter<boolean> = new EventEmitter();

	constructor(private readonly translate: TranslateService,
				private readonly router: Router,
				private readonly activatedRoute: ActivatedRoute) {
		super();
		this.applicationFixedChange = this.applicationFixedEmitter.asObservable();
		this.footerSmallChange = this.footerSmallEmitter.asObservable();
		this.headerMediumChange = this.headerMediumEmitter.asObservable();
		this.headerAnimateChange = this.headerAnimateEmitter.asObservable();
		this.headerStickyChange = this.headerStickyEmitter.asObservable();
		this.noNavigationChange = this.noNavigationEmitter.asObservable();
		this.navigationFullWidthChange = this.navigationFullWidthEmitter.asObservable();
		this.coverLayoutChange = this.coverLayoutEmitter.asObservable();
		this.menuCollapsedChange = this.menuCollapsedEmitter.asObservable();

		this.manageLanguage();
		this.routeChange();
	}

	private manageLanguage() {
		const lang = localStorage.getItem('oblique:lang') || 'en';
		this.translate.setDefaultLang(lang);
		this.translate.use(lang);
		this.translate.onLangChange
			.pipe(takeUntil(this.unsubscribe))
			.subscribe((event: LangChangeEvent) => {
				this.userLang = event.lang;
			});
	}

	private routeChange() {
		this.router.events.pipe(
			takeUntil(this.unsubscribe),
			filter(event => event instanceof NavigationEnd),
			map(() => this.activatedRoute),
			map(route => {
				while (route.firstChild) {
					route = route.firstChild;
				}
				return route;
			}),
			filter(route => route.outlet === 'primary'),
			mergeMap(route => route.data)
		).subscribe((data) => {
			const masterLayout = data.masterLayout || {};
			Object.keys(masterLayout).forEach((property: string) => {
				if (masterLayout[property] !== this[property]) {
					this[property] = masterLayout[property];
				}
			});
		});
	}
}
