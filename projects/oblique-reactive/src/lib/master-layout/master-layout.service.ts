import {Injectable} from '@angular/core';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, mergeMap, takeUntil} from 'rxjs/operators';

import {Unsubscribable} from '../unsubscribe.class';
import {LocaleObject, MasterLayoutConfig} from './master-layout.config';
import {Subject, Observable} from 'rxjs';
import { $ } from 'protractor';

@Injectable({providedIn: 'root'})
export class MasterLayoutService extends Unsubscribable {
	// Layout
	get menuCollapsedChanged(): Observable<boolean> {
		return this.menuCollapsedChanged$;
	}
	get applicationFixedChanged(): Observable<boolean> {
		return this.applicationFixedChanged$;
	}
	get coverLayoutChanged(): Observable<boolean> {
		return this.coverLayoutChanged$;
	}
	get noNavigationChanged(): Observable<boolean> {
		return this.noNavigationChanged$;
	}
	get offCanvasChanged(): Observable<boolean> {
		return this.offCanvasChanged$;
	}

	// Header
	get headerCustomChanged(): Observable<boolean> {
		return this.headerCustomChanged$;
	}
	get headerMediumChanged(): Observable<boolean> {
		return this.headerMediumChanged$;
	}
	get headerAnimateChanged(): Observable<boolean> {
		return this.headerAnimateChanged$;
	}
	get headerStickyChanged(): Observable<boolean> {
		return this.headerStickyChanged$;
	}
	get headerScrollTransitionChanged(): Observable<boolean> {
		return this.headerScrollTransitionChanged$;
	}

	// Navigation
	get navigationFullWidthChanged(): Observable<boolean> {
		return this.navigationFullWidthChanged$;
	}
	get navigationScrollableChanged(): Observable<boolean> {
		return this.navigationScrollableChanged$;
	}

	// Footer
	get footerCustomChanged(): Observable<boolean> {
		return this.footerCustomChanged$;
	}
	get footerSmallChanged(): Observable<boolean> {
		return this.footerSmallChanged$;
	}
	get footerScrollTransitionChanged(): Observable<boolean> {
		return this.footerScrollTransitionChanged$;
	}

	// Layout
	get menuCollapsed(): boolean {
		return this.isMenuCollapsed;
	}

	set menuCollapsed(value: boolean) {
		this.isMenuCollapsed = value;
		this.menuCollapsedSubject.next(value);
	}

	get applicationFixed(): boolean {
		return this.isApplicationFixed;
	}

	set applicationFixed(value: boolean) {
		this.isApplicationFixed = value;
		this.applicationFixedSubject.next(value);
	}

	get coverLayout(): boolean {
		return this.hasCoverLayout;
	}

	set coverLayout(value: boolean) {
		this.hasCoverLayout = value;
		this.coverLayoutSubject.next(value);
	}

	get noNavigation(): boolean {
		return this.hasNavigation;
	}

	set noNavigation(value: boolean) {
		this.hasNavigation = value;
		this.noNavigationSubject.next(value);
	}

	get offCanvas(): boolean {
		return this.hasOffCanvas;
	}

	set offCanvas(value: boolean) {
		this.hasOffCanvas = value;
		this.offCanvasSubject.next(value);
	}

	// Header
	get customHeader() {
		return this.isHeaderCustom;
	}

	set customHeader(value: boolean) {
		this.isHeaderCustom = value;
		this.headerCustomSubject.next(value);
	}

	get mediumHeader(): boolean {
		return this.isHeaderMedium;
	}

	set mediumHeader(value: boolean) {
		this.isHeaderMedium = value;
		this.headerMediumSubject.next(value);
	}

	get animateHeader(): boolean {
		return this.isHeaderAnimated;
	}

	set animateHeader(value: boolean) {
		this.isHeaderAnimated = value;
		this.headerAnimateSubject.next(value);
	}

	get stickyHeader(): boolean {
		return this.isHeaderSticky;
	}

	set stickyHeader(value: boolean) {
		this.isHeaderSticky = value;
		this.headerStickySubject.next(value);
	}

	get scrollTransitionHeader(): boolean {
		return this.hasHeaderScrollTransition;
	}

	set scrollTransitionHeader(value: boolean) {
		this.hasHeaderScrollTransition = value;
		this.headerScrollTransitionSubject.next(value);
	}


	// Navigation
	get navigationFullWidth(): boolean {
		return this.isNavigationFullWidth;
	}

	set navigationFullWidth(value: boolean) {
		this.isNavigationFullWidth = value;
		this.navigationFullWidthSubject.next(value);
	}

	get navigationScrollable(): boolean {
		return this.isNavigationScrollable;
	}

	set navigationScrollable(value: boolean) {
		this.isNavigationScrollable = value;
		this.navigationScrollableSubject.next(value);
	}

	// Footer
	get customFooter() {
		return this.isFooterCustom;
	}

	set customFooter(value: boolean) {
		this.isFooterCustom = value;
		this.footerCustomSubject.next(value);
	}

	get smallFooter(): boolean {
		return this.isFooterSmall;
	}

	set smallFooter(value: boolean) {
		this.isFooterSmall = value;
		this.footerSmallSubject.next(value);
	}

	get scrollTransitionFooter(): boolean {
		return this.hasFooterScrollTransition;
	}

	set scrollTransitionFooter(value: boolean) {
		this.hasFooterScrollTransition = value;
		this.footerScrollTransitionSubject.next(value);
	}

	private static readonly token = 'oblique_lang';

	// Layout
	private readonly menuCollapsedSubject: Subject<boolean> = new Subject<boolean>();
	private readonly menuCollapsedChanged$ = this.menuCollapsedSubject.asObservable();
	private readonly applicationFixedSubject: Subject<boolean> = new Subject<boolean>();
	private readonly applicationFixedChanged$ = this.applicationFixedSubject.asObservable();
	private readonly coverLayoutSubject: Subject<boolean> = new Subject<boolean>();
	private readonly coverLayoutChanged$ = this.coverLayoutSubject.asObservable();
	private readonly noNavigationSubject: Subject<boolean> = new Subject<boolean>();
	private readonly noNavigationChanged$ = this.noNavigationSubject.asObservable();
	private readonly offCanvasSubject: Subject<boolean> = new Subject<boolean>();
	private readonly offCanvasChanged$ = this.offCanvasSubject.asObservable();

	// Header
	private readonly headerCustomSubject: Subject<boolean> = new Subject<boolean>();
	private readonly headerCustomChanged$ = this.headerCustomSubject.asObservable();
	private readonly headerMediumSubject: Subject<boolean> = new Subject<boolean>();
	private readonly headerMediumChanged$ = this.headerMediumSubject.asObservable();
	private readonly headerAnimateSubject: Subject<boolean> = new Subject<boolean>();
	private readonly headerAnimateChanged$ = this.headerAnimateSubject.asObservable();
	private readonly headerStickySubject: Subject<boolean> = new Subject<boolean>();
	private readonly headerStickyChanged$ = this.headerStickySubject.asObservable();
	private readonly headerScrollTransitionSubject: Subject<boolean> = new Subject<boolean>();
	private readonly headerScrollTransitionChanged$ = this.headerScrollTransitionSubject.asObservable();

	// Navigation
	private readonly navigationFullWidthSubject: Subject<boolean> = new Subject<boolean>();
	private readonly navigationFullWidthChanged$ = this.navigationFullWidthSubject.asObservable();
	private readonly navigationScrollableSubject: Subject<boolean> = new Subject<boolean>();
	private readonly navigationScrollableChanged$ = this.navigationScrollableSubject.asObservable();

	// Footer
	private readonly footerCustomSubject: Subject<boolean> = new Subject<boolean>();
	private readonly footerCustomChanged$ = this.footerCustomSubject.asObservable();
	private readonly footerSmallSubject: Subject<boolean> = new Subject<boolean>();
	private readonly footerSmallChanged$ = this.footerSmallSubject.asObservable();
	private readonly footerScrollTransitionSubject: Subject<boolean> = new Subject<boolean>();
	private readonly footerScrollTransitionChanged$ = this.footerScrollTransitionSubject.asObservable();

	// Layout
	private isMenuCollapsed = true;
	private isApplicationFixed: boolean;
	private hasCoverLayout: boolean;
	private hasNavigation: boolean;
	private hasOffCanvas: boolean;

	// Header
	private isHeaderCustom: boolean;
	private isHeaderMedium: boolean;
	private isHeaderAnimated: boolean;
	private isHeaderSticky: boolean;
	private hasHeaderScrollTransition: boolean;

	// Navigation
	private isNavigationFullWidth: boolean;
	private isNavigationScrollable: boolean;

	// Footer
	private isFooterCustom: boolean;
	private isFooterSmall: boolean;
	private hasFooterScrollTransition: boolean;

	constructor(private readonly config: MasterLayoutConfig,
				private readonly translate: TranslateService,
				private readonly router: Router,
				private readonly activatedRoute: ActivatedRoute) {
		super();

		this.manageLanguage();
		this.routeChange();
	}

	private static getLangToken(): string {
		let langToken = localStorage.getItem(MasterLayoutService.token);
		if (!langToken) {
			langToken = '_' + Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, 5);
			localStorage.setItem(MasterLayoutService.token, langToken);
		}

		return langToken;
	}

	private manageLanguage(): void {
		if (this.config.locale.disabled) {
			if (!this.translate.getDefaultLang()) {
				console.warn('You disabled Oblique language management without providing a default language to @ngx-translate.');
			}
			return;
		}
		if (!Array.isArray(this.config.locale.locales)) {
			throw new Error('Locales needs to be an array');
		}
		const langToken = MasterLayoutService.getLangToken();
		const lang = this.getCurrentLang(langToken);
		this.translate.setDefaultLang(lang);
		this.translate.use(lang);
		this.translate.onLangChange.pipe(takeUntil(this.unsubscribe)).subscribe((event: LangChangeEvent) => {
			localStorage.setItem(MasterLayoutService.token + langToken, event.lang);
		});
	}

	private getCurrentLang(langToken: string): string {
		const firstLocale = this.config.locale.locales[0];
		const lang = this.getSupportedLang(localStorage.getItem(MasterLayoutService.token + langToken))
			|| this.getSupportedLang(this.translate.getBrowserLang())
			|| this.getSupportedLang(this.config.locale.default)
			|| (firstLocale as LocaleObject).locale
			|| (firstLocale as string);
		if (!lang) {
			throw new Error('No locale defined');
		}

		return lang;
	}

	private getSupportedLang(lang: string): string {
		return this.config.locale.locales.indexOf(lang) > -1 || this.config.locale.locales.filter((locale: LocaleObject) => locale.locale === lang).length
			? lang
			: undefined;
	}

	private routeChange(): void {
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
