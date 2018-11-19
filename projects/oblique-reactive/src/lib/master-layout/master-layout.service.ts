import {Injectable} from '@angular/core';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, mergeMap, takeUntil} from 'rxjs/operators';

import {Unsubscribable} from '../unsubscribe.class';
import {LocaleObject, MasterLayoutConfig} from './master-layout.config';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class MasterLayoutService extends Unsubscribable {
	// Layout
	readonly menuCollapsedEmitter: Subject<boolean> = new Subject<boolean>();
	readonly applicationFixedEmitter: Subject<boolean> = new Subject<boolean>();
	readonly coverLayoutEmitter: Subject<boolean> = new Subject<boolean>();
	readonly noNavigationEmitter: Subject<boolean> = new Subject<boolean>();
	readonly offCanvasEmitter: Subject<boolean> = new Subject<boolean>();

	// Header
	readonly headerCustomEmitter: Subject<boolean> = new Subject<boolean>();
	readonly headerMediumEmitter: Subject<boolean> = new Subject<boolean>();
	readonly headerAnimateEmitter: Subject<boolean> = new Subject<boolean>();
	readonly headerStickyEmitter: Subject<boolean> = new Subject<boolean>();
	readonly headerScrollTransitionEmitter: Subject<boolean> = new Subject<boolean>();

	// Navigation
	readonly navigationFullWidthEmitter: Subject<boolean> = new Subject<boolean>();
	readonly navigationScrollableEmitter: Subject<boolean> = new Subject<boolean>();

	// Footer
	readonly footerCustomEmitter: Subject<boolean> = new Subject<boolean>();
	readonly footerSmallEmitter: Subject<boolean> = new Subject<boolean>();
	readonly footerScrollTransitionEmitter: Subject<boolean> = new Subject<boolean>();

	// Layout
	get menuCollapsed(): boolean {
		return this.isMenuCollapsed;
	}

	set menuCollapsed(value: boolean) {
		this.isMenuCollapsed = value;
		this.menuCollapsedEmitter.next(value);
	}

	get applicationFixed(): boolean {
		return this.isApplicationFixed;
	}

	set applicationFixed(value: boolean) {
		this.isApplicationFixed = value;
		this.applicationFixedEmitter.next(value);
	}

	get coverLayout(): boolean {
		return this.hasCoverLayout;
	}

	set coverLayout(value: boolean) {
		this.hasCoverLayout = value;
		this.coverLayoutEmitter.next(value);
	}

	get noNavigation(): boolean {
		return this.hasNavigation;
	}

	set noNavigation(value: boolean) {
		this.hasNavigation = value;
		this.noNavigationEmitter.next(value);
	}

	get offCanvas(): boolean {
		return this.hasOffCanvas;
	}

	set offCanvas(value: boolean) {
		this.hasOffCanvas = value;
		this.offCanvasEmitter.next(value);
	}

	// Header
	get customHeader() {
		return this.isHeaderCustom;
	}

	set customHeader(value: boolean) {
		this.isHeaderCustom = value;
		this.headerCustomEmitter.next(value);
	}

	get mediumHeader(): boolean {
		return this.isHeaderMedium;
	}

	set mediumHeader(value: boolean) {
		this.isHeaderMedium = value;
		this.headerMediumEmitter.next(value);
	}

	get animateHeader(): boolean {
		return this.isHeaderAnimated;
	}

	set animateHeader(value: boolean) {
		this.isHeaderAnimated = value;
		this.headerAnimateEmitter.next(value);
	}

	get stickyHeader(): boolean {
		return this.isHeaderSticky;
	}

	set stickyHeader(value: boolean) {
		this.isHeaderSticky = value;
		this.headerStickyEmitter.next(value);
	}

	get scrollTransitionHeader(): boolean {
		return this.hasHeaderScrollTransition;
	}

	set scrollTransitionHeader(value: boolean) {
		this.hasHeaderScrollTransition = value;
		this.headerScrollTransitionEmitter.next(value);
	}


	// Navigation
	get navigationFullWidth(): boolean {
		return this.isNavigationFullWidth;
	}

	set navigationFullWidth(value: boolean) {
		this.isNavigationFullWidth = value;
		this.navigationFullWidthEmitter.next(value);
	}

	get navigationScrollable(): boolean {
		return this.isNavigationScrollable;
	}

	set navigationScrollable(value: boolean) {
		this.isNavigationScrollable = value;
		this.navigationScrollableEmitter.next(value);
	}

	// Footer
	get customFooter() {
		return this.isFooterCustom;
	}

	set customFooter(value: boolean) {
		this.isFooterCustom = value;
		this.footerCustomEmitter.next(value);
	}

	get smallFooter(): boolean {
		return this.isFooterSmall;
	}

	set smallFooter(value: boolean) {
		this.isFooterSmall = value;
		this.footerSmallEmitter.next(value);
	}

	get scrollTransitionFooter(): boolean {
		return this.hasFooterScrollTransition;
	}

	set scrollTransitionFooter(value: boolean) {
		this.hasFooterScrollTransition = value;
		this.footerScrollTransitionEmitter.next(value);
	}

	private static readonly token = 'oblique_lang';

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
