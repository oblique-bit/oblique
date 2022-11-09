import {
	AfterViewInit,
	Component,
	ContentChild,
	ContentChildren,
	DoCheck,
	ElementRef,
	HostBinding,
	Inject,
	Input,
	OnDestroy,
	OnInit,
	Optional,
	QueryList,
	TemplateRef,
	ViewChild,
	ViewEncapsulation
} from '@angular/core';
import {NavigationEnd, Params, Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';
import {delay, filter, map, takeUntil, tap} from 'rxjs/operators';

import {ObMasterLayoutService} from '../master-layout.service';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {ObScrollingEvents} from '../../scrolling/scrolling-events';
import {appVersion} from '../../version';
import {WINDOW} from '../../utilities';
import {ObEMasterLayoutEventValues, ObIDynamicSkipLink, ObIMasterLayoutEvent, ObINavigationLink, ObISkipLink} from '../master-layout.model';
import {ObOffCanvasService} from '../../off-canvas/off-canvas.service';
import {Subject} from 'rxjs';
import {ObGlobalEventsService} from '../../global-events/global-events.service';
import {ObUseObliqueIcons} from '../../icon/icon.model';

@Component({
	selector: 'ob-master-layout',
	exportAs: 'obMasterLayout',
	templateUrl: './master-layout.component.html',
	styleUrls: [
		'./master-layout.component.scss',
		'./master-layout.component-cover.scss',
		'./master-layout.component-offcanvas.scss',
		'./master-layout.component-accessibility.scss'
	],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-master-layout', 'ob-version': appVersion}
})
export class ObMasterLayoutComponent implements OnInit, DoCheck, AfterViewInit, OnDestroy {
	home = this.config.homePageRoute;
	route = {path: '', params: undefined};
	useFontAwesomeIcons = false;
	@Input() navigation: ObINavigationLink[] = [];
	@Input() skipLinks: ObISkipLink[] | ObIDynamicSkipLink[] = [];
	@HostBinding('class.ob-has-cover') hasCover = this.masterLayout.layout.hasCover;
	@HostBinding('class.ob-has-layout') hasLayout = this.masterLayout.layout.hasLayout;
	@HostBinding('class.ob-has-max-width') hasMaxWidth = this.masterLayout.layout.hasMaxWidth;
	@HostBinding('class.ob-header-expanded') isMenuOpened = this.masterLayout.layout.isMenuOpened;
	@HostBinding('class.ob-no-navigation') noNavigation = !this.masterLayout.layout.hasMainNavigation;
	@HostBinding('class.ob-off-canvas') hasOffCanvas = this.masterLayout.layout.hasOffCanvas;
	@HostBinding('class.ob-master-layout-scrolling') isScrolling = false;
	isHeaderSticky = this.masterLayout.header.isSticky;
	isFooterSticky = this.masterLayout.footer.isSticky;
	scrollTarget: HTMLElement | Window;
	@ContentChild('obHeaderLogo') readonly obLogo: TemplateRef<any>;
	@ContentChildren('obHeaderControl') readonly headerControlTemplates: QueryList<TemplateRef<any>>;
	@ContentChildren('obHeaderMobileControl') readonly headerMobileControlTemplates: QueryList<TemplateRef<any>>;
	@ContentChildren('obFooterLink') readonly footerLinkTemplates: QueryList<TemplateRef<any>>;
	@ViewChild('offCanvasClose', {read: ElementRef}) readonly offCanvasClose: ElementRef<HTMLElement>;
	@ViewChild('main') readonly main: ElementRef<HTMLElement>;
	@ViewChild('wrapper') readonly wrapper: ElementRef<HTMLElement>;
	private readonly unsubscribe = new Subject<void>();
	private navigationLength: number;

	constructor(
		private readonly masterLayout: ObMasterLayoutService,
		private readonly config: ObMasterLayoutConfig,
		private readonly offCanvasService: ObOffCanvasService,
		private readonly router: Router,
		private readonly scrollEvents: ObScrollingEvents,
		private readonly globalEventsService: ObGlobalEventsService,
		@Optional() @Inject(ObUseObliqueIcons) useObliqueIcons: boolean,
		@Inject(DOCUMENT) private readonly document: any,
		@Inject(WINDOW) private readonly window: Window
	) {
		this.useFontAwesomeIcons = !(useObliqueIcons ?? true);
		this.layoutHasCoverChange();
		this.layoutHasDefaultLayoutChange();
		this.layoutHasMainNavigationChange();
		this.layoutHasMaxWidthChange();
		this.layoutHasOffCanvasChange();
		this.layoutIsMenuOpenedChange();
		this.footerIsStickyChange();
		this.headerIsStickyChange();
		this.focusFragment();
		this.focusOffCanvasClose();
	}

	scrollTop(element?: HTMLElement): void {
		const scrollTop =
			element?.scrollTop ?? (this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0);
		this.scrollEvents.hasScrolled(scrollTop);
		if (this.isScrolling !== scrollTop > 0) {
			this.isScrolling = scrollTop > 0;
			this.scrollEvents.scrolling(this.isScrolling);
		}
	}

	ngOnInit(): void {
		this.globalEventsService.scroll$.pipe(takeUntil(this.unsubscribe)).subscribe(() => this.scrollTop());
		this.masterLayout.layout.configEvents$
			.pipe(filter(evt => evt.name === ObEMasterLayoutEventValues.LAYOUT_HAS_MAIN_NAVIGATION))
			.subscribe(evt => this.updateSkipLinks(evt.value));
		this.updateSkipLinks(!this.noNavigation);
	}

	ngDoCheck(): void {
		if (this.navigation?.length !== this.navigationLength) {
			this.navigationLength = this.navigation.length;
			this.masterLayout.navigation.refresh();
			this.updateSkipLinks(!this.noNavigation);
		}
	}

	ngAfterViewInit(): void {
		// to avoid a ExpressionHasBeenChangedAfterItHasBeenCheckedError
		setTimeout(() => (this.scrollTarget = this.getScrollTarget()));
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	private getScrollTarget(): HTMLElement | Window {
		if (this.isHeaderSticky && this.isFooterSticky) {
			return this.main.nativeElement;
		}
		if (this.isHeaderSticky !== this.isFooterSticky) {
			return this.wrapper.nativeElement;
		}
		return this.window;
	}

	private updateSkipLinks(hasNavigation: boolean): void {
		const staticSkipLinks = hasNavigation && this.navigation.length ? 2 : 1;
		this.skipLinks = this.skipLinks.map((skipLink, index: number) => ({...skipLink, accessKey: index + staticSkipLinks}));
	}

	private layoutHasMainNavigationChange(): void {
		this.masterLayout.layout.configEvents$
			.pipe(
				filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.LAYOUT_HAS_MAIN_NAVIGATION),
				takeUntil(this.unsubscribe)
			)
			.subscribe(event => (this.noNavigation = !event.value));
	}

	private layoutHasCoverChange(): void {
		this.masterLayout.layout.configEvents$
			.pipe(
				filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.LAYOUT_HAS_COVER),
				takeUntil(this.unsubscribe)
			)
			.subscribe(event => (this.hasCover = event.value));
	}

	private layoutHasOffCanvasChange(): void {
		this.masterLayout.layout.configEvents$
			.pipe(
				filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.LAYOUT_HAS_OFF_CANVAS),
				takeUntil(this.unsubscribe)
			)
			.subscribe(event => (this.hasOffCanvas = event.value));
	}

	private layoutIsMenuOpenedChange(): void {
		this.masterLayout.layout.configEvents$
			.pipe(
				filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.IS_MENU_OPENED),
				takeUntil(this.unsubscribe)
			)
			.subscribe(event => (this.isMenuOpened = event.value));
	}

	private layoutHasDefaultLayoutChange(): void {
		this.masterLayout.layout.configEvents$
			.pipe(
				filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.LAYOUT_HAS_DEFAULT_LAYOUT),
				takeUntil(this.unsubscribe)
			)
			.subscribe(event => (this.hasLayout = event.value));
	}

	private layoutHasMaxWidthChange(): void {
		this.masterLayout.layout.configEvents$
			.pipe(
				filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.LAYOUT_HAS_MAX_WIDTH),
				takeUntil(this.unsubscribe)
			)
			.subscribe(event => (this.hasMaxWidth = event.value));
	}

	private headerIsStickyChange(): void {
		this.masterLayout.header.configEvents$
			.pipe(
				filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.HEADER_IS_STICKY),
				tap(() => (this.scrollTarget = this.getScrollTarget())),
				takeUntil(this.unsubscribe)
			)
			.subscribe(event => (this.isHeaderSticky = event.value));
	}

	private footerIsStickyChange(): void {
		this.masterLayout.footer.configEvents$
			.pipe(
				filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.FOOTER_IS_STICKY),
				tap(() => (this.scrollTarget = this.getScrollTarget())),
				takeUntil(this.unsubscribe)
			)
			.subscribe(event => (this.isFooterSticky = event.value));
	}

	private focusFragment(): void {
		this.router.events
			.pipe(
				filter(evt => evt instanceof NavigationEnd),
				map((evt: NavigationEnd) => evt.url),
				tap(url => (this.route.path = (/^[^?&#]*/.exec(url) || [])[0])),
				tap(url => (this.route.params = this.formatQueryParameters(this.extractUrlPart(url, /[?&][^#]*/)))),
				map(url => this.extractUrlPart(url, /#[^?&]*/)),
				filter(fragment => this.config.focusableFragments.includes(fragment))
			)
			.subscribe(fragment => this.document.querySelector(`#${fragment}`)?.focus());
	}

	private extractUrlPart(url: string, regex: RegExp): string {
		// substr remove the leading #, ? or & character
		return (url.match(regex) || [])[0]?.substr(1);
	}

	private formatQueryParameters(parameters: string): Params {
		return parameters
			?.split('&')
			.map(mapParameters => mapParameters.split('='))
			.reduce((params, parameter) => ({...params, [parameter[0]]: parameter[1]}), {});
	}

	private focusOffCanvasClose(): void {
		this.offCanvasService.opened$
			.pipe(
				takeUntil(this.unsubscribe),
				filter(() => this.hasOffCanvas),
				filter(value => value),
				delay(600) // duration of the open animation
			)
			.subscribe(() => this.offCanvasClose.nativeElement.focus());
	}
}
