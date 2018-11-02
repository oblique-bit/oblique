import {EventEmitter, Injectable} from '@angular/core';
import {LangChangeEvent, TranslateService} from '@ngx-translate/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, mergeMap, takeUntil} from 'rxjs/operators';

import {Unsubscribable} from '../unsubscribe';
import {MasterLayoutConfig} from './master-layout.config';

@Injectable()
export class MasterLayoutService extends Unsubscribable {
	// Layout
	readonly menuCollapsedEmitter: EventEmitter<boolean> = new EventEmitter();
	readonly applicationFixedEmitter: EventEmitter<boolean> = new EventEmitter();
	readonly coverLayoutEmitter: EventEmitter<boolean> = new EventEmitter();
	readonly noNavigationEmitter: EventEmitter<boolean> = new EventEmitter();
	readonly offCanvasEmitter: EventEmitter<boolean> = new EventEmitter();

	//Header
	readonly headerCustomEmitter: EventEmitter<boolean> = new EventEmitter();
	readonly headerMediumEmitter: EventEmitter<boolean> = new EventEmitter();
	readonly headerAnimateEmitter: EventEmitter<boolean> = new EventEmitter();
	readonly headerStickyEmitter: EventEmitter<boolean> = new EventEmitter();
	readonly headerScrollTransitionEmitter: EventEmitter<boolean> = new EventEmitter();

	// Navigation
	readonly navigationFullWidthEmitter: EventEmitter<boolean> = new EventEmitter();
	readonly navigationScrollableEmitter: EventEmitter<boolean> = new EventEmitter();

	// Footer
	readonly footerCustomEmitter: EventEmitter<boolean> = new EventEmitter();
	readonly footerSmallEmitter: EventEmitter<boolean> = new EventEmitter();
	readonly footerScrollTransitionEmitter: EventEmitter<boolean> = new EventEmitter();

	// Layout
	get menuCollapsed(): boolean {
		return this.isMenuCollapsed;
	}

	set menuCollapsed(value: boolean) {
		this.isMenuCollapsed = value;
		this.menuCollapsedEmitter.emit(value);
	}

	get applicationFixed(): boolean {
		return this.isApplicationFixed;
	}

	set applicationFixed(value: boolean) {
		this.isApplicationFixed = value;
		this.applicationFixedEmitter.emit(value);
	}

	get coverLayout(): boolean {
		return this.hasCoverLayout;
	}

	set coverLayout(value: boolean) {
		this.hasCoverLayout = value;
		this.coverLayoutEmitter.emit(value);
	}

	get noNavigation(): boolean {
		return this.hasNavigation;
	}

	set noNavigation(value: boolean) {
		this.hasNavigation = value;
		this.noNavigationEmitter.emit(value);
	}

	get offCanvas(): boolean {
		return this.hasOffCanvas;
	}

	set offCanvas(value: boolean) {
		this.hasOffCanvas = value;
		this.offCanvasEmitter.emit(value);
	}

	// Header
	get customHeader() {
		return this.isHeaderCustom;
	}

	set customHeader(value: boolean) {
		this.isHeaderCustom = value;
		this.headerCustomEmitter.emit(value);
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

	get scrollTransitionHeader(): boolean {
		return this.hasHeaderScrollTransition;
	}

	set scrollTransitionHeader(value: boolean) {
		this.hasHeaderScrollTransition = value;
		this.headerScrollTransitionEmitter.emit(value);
	}


	// Navigation
	get navigationFullWidth(): boolean {
		return this.isNavigationFullWidth;
	}

	set navigationFullWidth(value: boolean) {
		this.isNavigationFullWidth = value;
		this.navigationFullWidthEmitter.emit(value);
	}

	get navigationScrollable(): boolean {
		return this.isNavigationScrollable;
	}

	set navigationScrollable(value: boolean) {
		this.isNavigationScrollable = value;
		this.navigationScrollableEmitter.emit(value);
	}

	// Footer
	get customFooter() {
		return this.isFooterCustom;
	}

	set customFooter(value: boolean) {
		this.isFooterCustom = value;
		this.footerCustomEmitter.emit(value);
	}

	get smallFooter(): boolean {
		return this.isFooterSmall;
	}

	set smallFooter(value: boolean) {
		this.isFooterSmall = value;
		this.footerSmallEmitter.emit(value);
	}

	get scrollTransitionFooter(): boolean {
		return this.hasFooterScrollTransition;
	}

	set scrollTransitionFooter(value: boolean) {
		this.hasFooterScrollTransition = value;
		this.footerScrollTransitionEmitter.emit(value);
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
		const langToken = MasterLayoutService.getLangToken();
		const lang = this.getCurrentLocale(langToken);
		this.translate.setDefaultLang(lang);
		this.translate.use(lang);
		this.translate.onLangChange.pipe(takeUntil(this.unsubscribe)).subscribe((event: LangChangeEvent) => {
			localStorage.setItem(MasterLayoutService.token + langToken, event.lang);
		});
	}

	private getCurrentLocale(langToken: string): string {
		let lang = localStorage.getItem(MasterLayoutService.token + langToken) || this.config.defaultLocale;
		if (!this.config.locales.length) {
			console.warn('No locales are defined!');
		} else if (this.config.locales.indexOf(this.config.defaultLocale) === -1) {
			console.warn(`The default locale ("${this.config.defaultLocale}") is not within the supported ones ` +
				`("${this.config.locales.join('", "')}"). It will be set to "${this.config.locales[0]}"`);
			this.config.defaultLocale = this.config.locales[0];
		}
		if (this.config.locales.indexOf(lang) === -1) {
			console.warn(`The current locale ("${lang}") is not within the supported ones ` +
				`("${this.config.locales.join('", "')}"). It will be set to "${this.config.defaultLocale}"`);
			lang = this.config.defaultLocale;
			localStorage.setItem(MasterLayoutService.token + langToken, lang);
		}

		return lang;
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
