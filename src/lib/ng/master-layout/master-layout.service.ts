import {EventEmitter, Inject, Injectable} from '@angular/core';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, mergeMap, takeUntil} from 'rxjs/operators';
import {Observable} from 'rxjs';
import {Unsubscribable} from '../unsubscribe';

/**
 * Service for controlling ObliqueUI application composite features.
 */
@Injectable()
export class MasterLayoutService extends Unsubscribable {
	userLang: string = localStorage.getItem('oblique:lang');
	applicationFixedChange: Observable<boolean>;
	footerSmallChange: Observable<boolean>;
	headerMediumChange: Observable<boolean>;
	headerAnimateChange: Observable<boolean>;
	headerStickyChange: Observable<boolean>;
	noNavigationChange: Observable<boolean>;
	navigationFullWidthChange: Observable<boolean>;
	coverLayoutChange: Observable<boolean>;

	get applicationFixed() {
		return this.isApplicationFixed;
	}

	set applicationFixed(value: boolean) {
		this.isApplicationFixed = value;
		this.applicationFixedEmitter.emit(value);
	}

	get smallFooter() {
		return this.isFooterSmall;
	}

	set smallFooter(value: boolean) {
		this.isFooterSmall = value;
		this.footerSmallEmitter.emit(value);
	}

	get mediumHeader() {
		return this.isHeaderMedium;
	}

	set mediumHeader(value: boolean) {
		this.isHeaderMedium = value;
		this.headerMediumEmitter.emit(value);
	}

	get animateHeader() {
		return this.isHeaderAnimated;
	}

	set animateHeader(value: boolean) {
		this.isHeaderAnimated = value;
		this.headerAnimateEmitter.emit(value);
	}

	get stickyHeader() {
		return this.isHeaderSticky;
	}

	set stickyHeader(value: boolean) {
		this.isHeaderSticky = value;
		this.headerStickyEmitter.emit(value);
	}

	get noNavigation() {
		return this.hasNavigation;
	}

	set noNavigation(value: boolean) {
		this.hasNavigation = value;
		this.noNavigationEmitter.emit(value);
	}

	get navigationFullWidth() {
		return this.isNavigationFullWidth;
	}

	set navigationFullWidth(value: boolean) {
		this.isNavigationFullWidth = value;
		this.navigationFullWidthEmitter.emit(value);
	}

	get coverLayout() {
		return this.hasCoverLayout;
	}

	set coverLayout(value) {
		this.hasCoverLayout = value;
		this.coverLayoutEmitter.emit(value);
	}

	private isApplicationFixed: boolean;
	private isFooterSmall: boolean;
	private isHeaderMedium: boolean;
	private isHeaderAnimated: boolean;
	private isHeaderSticky: boolean;
	private hasNavigation: boolean;
	private isNavigationFullWidth: boolean;
	private hasCoverLayout: boolean;
	private readonly applicationFixedEmitter: EventEmitter<boolean> = new EventEmitter();
	private readonly footerSmallEmitter: EventEmitter<boolean> = new EventEmitter();
	private readonly headerMediumEmitter: EventEmitter<boolean> = new EventEmitter();
	private readonly headerAnimateEmitter: EventEmitter<boolean> = new EventEmitter();
	private readonly headerStickyEmitter: EventEmitter<boolean> = new EventEmitter();
	private readonly noNavigationEmitter: EventEmitter<boolean> = new EventEmitter();
	private readonly navigationFullWidthEmitter: EventEmitter<boolean> = new EventEmitter();
	private readonly coverLayoutEmitter: EventEmitter<boolean> = new EventEmitter();

	constructor(private readonly translate: TranslateService,
				private readonly router: Router,
				private readonly activatedRoute: ActivatedRoute,
				@Inject('ObliqueReactive.CONFIG') private readonly config: any) {
		super();
		this.applicationFixedChange = this.applicationFixedEmitter.asObservable();
		this.footerSmallChange = this.footerSmallEmitter.asObservable();
		this.headerMediumChange = this.headerMediumEmitter.asObservable();
		this.headerAnimateChange = this.headerAnimateEmitter.asObservable();
		this.headerStickyChange = this.headerStickyEmitter.asObservable();
		this.noNavigationChange = this.noNavigationEmitter.asObservable();
		this.navigationFullWidthChange = this.navigationFullWidthEmitter.asObservable();
		this.coverLayoutChange = this.coverLayoutEmitter.asObservable();

		this.lang();
		this.routeChange();
	}

	useLang(locale: string) {
		this.translate.use(locale);
	}

	private lang() {
		// User lang handling:
		// --------------------
		this.translate.onLangChange
			.pipe(takeUntil(this.unsubscribe))
			.subscribe((event: LangChangeEvent) => {
				// Ensure local value remains in sync:
				this.userLang = event.lang;
				localStorage.setItem('oblique:lang', this.userLang);
			});

		// Define default/fallback lang:
		this.translate.setDefaultLang((this.config.defaults && this.config.defaults.locale) || 'en');

		// Apply user or default lang:
		this.translate.use(this.userLang || this.translate.getDefaultLang());
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
