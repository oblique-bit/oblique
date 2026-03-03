import {
	Component,
	ContentChild,
	ContentChildren,
	DOCUMENT,
	DoCheck,
	ElementRef,
	EventEmitter,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Output,
	QueryList,
	SimpleChanges,
	TemplateRef,
	ViewChild,
	ViewEncapsulation,
	inject,
	isDevMode,
} from '@angular/core';
import {NavigationEnd, Params, Router} from '@angular/router';
import {delay, filter, map, skip, takeUntil, tap} from 'rxjs/operators';

import {appVersion} from '../../version';
import {WINDOW} from '../../utilities';
import {ObWindow} from '../../utilities.model';
import {
	ObEMasterLayoutEventValues,
	ObICollapseBreakpoints,
	ObIDynamicSkipLink,
	ObINavigationLink,
	ObISkipLink,
} from '../master-layout.model';
import {ObOffCanvasService} from '../../off-canvas/off-canvas.service';
import {Subject, fromEvent, startWith} from 'rxjs';
import {ObGlobalEventsService} from '../../global-events/global-events.service';
import {HighContrastMode, HighContrastModeDetector} from '@angular/cdk/a11y';
import {MasterLayoutComponentBase} from './master-layout-component-base';

@Component({
	selector: 'ob-master-layout',
	standalone: false,
	templateUrl: './master-layout.component.html',
	styleUrls: [
		'./master-layout.component.scss',
		'./master-layout-cover.component.scss',
		'./master-layout-offcanvas.component.scss',
		'./master-layout-accessibility.component.scss',
	],
	encapsulation: ViewEncapsulation.None,
	host: {
		'[class.ob-layout-collapsed]': 'isLayoutCollapsed',
		'[class.ob-layout-expanded]': 'isLayoutExpanded',
		'[class.ob-has-cover]': 'hasCover',
		'[class.ob-has-layout]': 'hasLayout',
		'[class.ob-has-max-width]': 'hasMaxWidth',
		'[class.ob-header-expanded]': 'isMenuOpened',
		'[class.ob-no-navigation]': 'noNavigation',
		'[class.ob-off-canvas]': 'hasOffCanvas',
		'[class.ob-master-layout-scrolling]': 'isScrolling',
		class: 'ob-master-layout',
		'ob-version': appVersion,
	},
	exportAs: 'obMasterLayout',
})
export class ObMasterLayoutComponent
	extends MasterLayoutComponentBase
	implements OnInit, DoCheck, OnDestroy, OnChanges
{
	route = {path: '', params: undefined};
	hasHighContrast = false;
	readonly contentId = 'content';
	@Input() navigation: ObINavigationLink[] = [];
	@Input() skipLinks: ObISkipLink[] | ObIDynamicSkipLink[] = [];
	@Input() collapseBreakpoint: ObICollapseBreakpoints;
	@Input() version?: string;
	@Output() readonly navigationChanged = new EventEmitter<ObINavigationLink[]>();
	isLayoutCollapsed = false;
	isLayoutExpanded = true;
	isScrolling = false;
	prefersReducedMotion = false;
	@ContentChild('obHeaderLogo') readonly obLogo: TemplateRef<unknown>;
	@ContentChildren('obHeaderControl') readonly headerControlTemplates: QueryList<TemplateRef<unknown>>;
	@ContentChildren('obHeaderMobileControl') readonly headerMobileControlTemplates: QueryList<TemplateRef<unknown>>;
	@ContentChildren('obFooterLink') readonly footerLinkTemplates: QueryList<TemplateRef<HTMLLinkElement>>;
	@ViewChild('offCanvasClose', {read: ElementRef}) readonly offCanvasClose: ElementRef<HTMLElement>;
	@ViewChild('main') readonly main: ElementRef<HTMLElement>;
	@ViewChild('wrapper') readonly wrapper: ElementRef<HTMLElement>;
	skipLinksInternal: ObIDynamicSkipLink[];
	private readonly unsubscribeMediaQuery = new Subject<void>();
	private navigationLength: number;
	private readonly router = inject(Router);
	private readonly offCanvasService = inject(ObOffCanvasService);
	private readonly globalEventsService = inject(ObGlobalEventsService);
	private readonly document = inject(DOCUMENT);
	private readonly window = inject<ObWindow>(WINDOW);
	private readonly highContrastModeDetector = inject(HighContrastModeDetector);
	private readonly defaultCollapseBreakpoint = 'md';
	private readonly gridBreakpoints = {
		xs: 0,
		sm: 600,
		md: 905,
		lg: 1240,
		xl: 1440,
	} as const;

	constructor() {
		super();

		this.handleFocusAfterNavigation();
		this.focusFragment();
		this.focusOffCanvasClose();
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes.collapseBreakpoint) {
			this.handleLayoutMode();
		}
	}

	ngOnInit(): void {
		this.globalEventsService.scroll$.pipe(takeUntil(this.unsubscribe)).subscribe(() => this.scrollTop());
		this.masterLayout.layout.configEvents$
			.pipe(filter(evt => evt.name === ObEMasterLayoutEventValues.LAYOUT_HAS_MAIN_NAVIGATION))
			.subscribe(evt => this.updateSkipLinks(evt.value));
		this.updateSkipLinks(!this.noNavigation);
		this.hasHighContrast = this.isInHighContrastMode();
		// this avoids re-executing handleLayoutMode if it has already been done in ngOnChanges
		if (!this.collapseBreakpoint) {
			this.collapseBreakpoint = this.defaultCollapseBreakpoint;
			this.handleLayoutMode();
		}
		this.prefersReducedMotion = this.window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;
	}

	ngDoCheck(): void {
		if (this.navigation?.length !== this.navigationLength) {
			this.navigationLength = this.navigation.length;
			this.masterLayout.navigation.refresh();
			this.updateSkipLinks(!this.noNavigation);
		}
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
		this.unsubscribeMediaQuery.next();
		this.unsubscribeMediaQuery.complete();
	}

	emitNavigation(navigation: ObINavigationLink[]): void {
		this.navigationChanged.emit(navigation);
	}

	scrollTop(element?: HTMLElement): void {
		const scrollTop =
			element?.scrollTop ??
			(this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0);
		if (this.isScrolling !== scrollTop > 0) {
			this.isScrolling = scrollTop > 0;
		}
	}

	focusElementById(elementId: string): void {
		const elementToFocus = this.getElement(elementId);
		if (!elementToFocus) {
			if (isDevMode()) {
				console.error(`${elementId} does not correspond to an existing DOM element.`);
			}
			return;
		}
		const behavior = this.prefersReducedMotion ? 'instant' : 'smooth';
		if (this.isMainFocusedInStickyLayout(elementToFocus.id)) {
			// Here the target is the already fully visible main container. The content of the container is being scrolled to the top.
			elementToFocus.scrollTo({
				top: 0,
				behavior,
			});
		} else {
			// Here the whole page is scrolled to the target element.
			elementToFocus.scrollIntoView({behavior});
		}
		elementToFocus.focus({preventScroll: true});
		if (document.activeElement !== elementToFocus) {
			elementToFocus.setAttribute('tabindex', '-1');
			elementToFocus.focus({preventScroll: true});
			if (isDevMode()) {
				console.info(
					`The element: ${this.createElementDescription(elementToFocus)} is not focusable. Oblique added a tabindex in order to make it focusable.`
				);
			}
		}
	}

	private isMainFocusedInStickyLayout(id: string): boolean {
		return id === this.contentId && this.isFooterSticky && this.isHeaderSticky;
	}

	private createElementDescription(element: Element): string {
		const id = element.id ? `#${element.id}` : '';
		const classes = element.classList.length ? `.${Array.from(element.classList).join('.')}` : '';
		return `${element.tagName.toLowerCase()}${id}${classes}`;
	}

	private handleFocusAfterNavigation(): void {
		this.router.events
			.pipe(
				filter(routerEvent => routerEvent instanceof NavigationEnd),
				skip(1),
				takeUntil(this.unsubscribe)
			)
			.subscribe(() => {
				this.focusMainAfterNavigation();
			});
	}

	private focusMainAfterNavigation(): void {
		this.focusElementById(this.contentId);
	}

	private handleLayoutMode(): void {
		this.unsubscribeMediaQuery.next();
		const mediaQuery = this.window.matchMedia(`(min-width: ${this.gridBreakpoints[this.collapseBreakpoint]}px)`);
		fromEvent(mediaQuery as MediaQueryList, 'change')
			.pipe(
				map((event: MediaQueryListEvent) => event.matches),
				startWith(mediaQuery.matches),
				takeUntil(this.unsubscribeMediaQuery)
			)
			.subscribe(isLayoutExpanded => {
				this.isLayoutExpanded = isLayoutExpanded;
				this.isLayoutCollapsed = !isLayoutExpanded;
			});
	}

	private isInHighContrastMode(): boolean {
		const currentHighContrastMode: HighContrastMode = this.highContrastModeDetector.getHighContrastMode();
		return currentHighContrastMode === HighContrastMode.WHITE_ON_BLACK;
	}

	private updateSkipLinks(hasNavigation: boolean): void {
		const staticSkipLinks = hasNavigation && this.navigation?.length ? 2 : 1;
		this.skipLinksInternal = this.skipLinks.map((skipLink, index: number) => ({
			...skipLink,
			accessKey: index + staticSkipLinks,
		}));
	}

	private focusFragment(): void {
		this.router.events
			.pipe(
				filter(evt => evt instanceof NavigationEnd),
				map((evt: NavigationEnd) => evt.url),
				tap(url => {
					this.route.path = (/^[^?&#]*/.exec(url) || [])[0];
				}),
				tap(url => {
					this.route.params = this.formatQueryParameters(this.extractUrlPart(url, /[?&][^#]*/));
				}),
				map(url => this.extractUrlPart(url, /#[^?&]*/)),
				filter(fragment => !!fragment)
			)
			.subscribe(fragment => {
				this.focusElementById(fragment);
			});
	}

	private extractUrlPart(url: string, regex: RegExp): string {
		// substring removes the leading #, ? or & character
		return (url.match(regex) || [])[0]?.substring(1);
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

	private getElement(elementId: string): HTMLElement | null {
		return this.document.getElementById(elementId);
	}
}
