import {
	Component,
	ContentChild,
	ContentChildren,
	ElementRef,
	HostBinding,
	HostListener,
	Inject,
	Input,
	OnDestroy,
	OnInit,
	QueryList,
	TemplateRef,
	ViewChild,
	ViewEncapsulation
} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';
import {filter, map, takeUntil} from 'rxjs/operators';

import {ObMasterLayoutService} from '../master-layout.service';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {ObScrollingEvents} from '../../scrolling/scrolling-events';
import {appVersion} from '../../version';
import {WINDOW} from '../../utilities';
import {ObEMasterLayoutEventValues, ObIDynamicJumpLink, ObINavigationLink} from '../master-layout.model';
import {ObOffCanvasService} from '../../off-canvas/off-canvas.service';
import {Subject} from 'rxjs';
import {ObGlobalEventsService} from '../../global-events/global-events.service';

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
	// eslint-disable-next-line @angular-eslint/no-host-metadata-property
	host: {class: 'ob-master-layout', 'ob-version': appVersion}
})
export class ObMasterLayoutComponent implements OnInit, OnDestroy {
	home = this.config.homePageRoute;
	url: string;
	@Input() navigation: ObINavigationLink[] = [];
	@Input() jumpLinks: ObIDynamicJumpLink[] = [];
	@HostBinding('class.ob-master-layout-fixed') isFixed = this.masterLayout.layout.isFixed;
	@HostBinding('class.ob-has-cover') hasCover = this.masterLayout.layout.hasCover;
	@HostBinding('class.ob-has-layout') hasLayout = this.masterLayout.layout.hasLayout;
	@HostBinding('class.ob-header-expanded') isMenuCollapsed = this.masterLayout.layout.isMenuOpened;
	@HostBinding('class.ob-no-navigation') noNavigation = !this.masterLayout.layout.hasMainNavigation;
	@HostBinding('class.ob-off-canvas') hasOffCanvas = this.masterLayout.layout.hasOffCanvas;
	@HostBinding('class.ob-footer-sm') footerSm = this.masterLayout.footer.isSmall;
	@HostBinding('class.ob-master-layout-scrolling') isScrolling = false;
	@HostBinding('class.ob-outline') outline = true;
	@ContentChild('obHeaderLogo') readonly obLogo: TemplateRef<any>;
	@ContentChildren('obHeaderControl') readonly headerControlTemplates: QueryList<TemplateRef<any>>;
	@ContentChildren('obHeaderMobileControl') readonly headerMobileControlTemplates: QueryList<TemplateRef<any>>;
	@ContentChildren('obFooterLink') readonly footerLinkTemplates: QueryList<TemplateRef<any>>;
	@ViewChild('offCanvasClose') readonly offCanvasClose: ElementRef<HTMLElement>;
	private readonly window: Window;
	private readonly unsubscribe = new Subject();

	constructor(
		private readonly masterLayout: ObMasterLayoutService,
		private readonly config: ObMasterLayoutConfig,
		readonly offCanvasService: ObOffCanvasService,
		private readonly router: Router,
		private readonly scrollEvents: ObScrollingEvents,
		private readonly globalEventsService: ObGlobalEventsService,
		@Inject(DOCUMENT) private readonly document: any,
		@Inject(WINDOW) window
	) {
		this.window = window; // because AoT don't accept interfaces as DI
		this.propertyChanges();
		this.focusFragment();
		this.focusOffCanvasClose();
	}

	@HostListener('mousedown')
	mousedown() {
		this.outline = false;
	}

	@HostListener('keydown')
	mouseup() {
		this.outline = true;
	}

	scrollTop() {
		const scrollTop = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
		this.scrollEvents.hasScrolled(scrollTop);
		if (this.isScrolling !== scrollTop > 0) {
			this.isScrolling = scrollTop > 0;
			this.scrollEvents.scrolling(this.isScrolling);
		}
	}

	ngOnInit(): void {
		this.globalEventsService.scroll$.pipe(takeUntil(this.unsubscribe)).subscribe(() => this.scrollTop());
		this.masterLayout.footer.configEvents.pipe(filter(evt => evt.name === ObEMasterLayoutEventValues.SMALL)).subscribe(evt => (this.footerSm = evt.value));
		this.masterLayout.layout.configEvents
			.pipe(filter(evt => evt.name === ObEMasterLayoutEventValues.MAIN_NAVIGATION))
			.subscribe(evt => this.updateJumpLinks(evt.value));
		this.updateJumpLinks(!this.noNavigation);
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	private updateJumpLinks(hasNavigation: boolean): void {
		const staticJumpLinks = hasNavigation && this.navigation.length ? 3 : 2;
		this.jumpLinks = this.jumpLinks.map((jumpLink, i) => ({...jumpLink, accessKey: i + staticJumpLinks}));
	}

	private propertyChanges() {
		this.masterLayout.layout.configEvents.pipe(takeUntil(this.unsubscribe)).subscribe(event => {
			switch (event.name) {
				case ObEMasterLayoutEventValues.MAIN_NAVIGATION:
					this.noNavigation = !event.value;
					break;
				case ObEMasterLayoutEventValues.FIXED:
					this.isFixed = event.value;
					break;
				case ObEMasterLayoutEventValues.COVER:
					this.hasCover = event.value;
					break;
				case ObEMasterLayoutEventValues.OFF_CANVAS:
					this.hasOffCanvas = event.value;
					break;
				case ObEMasterLayoutEventValues.COLLAPSE:
					this.isMenuCollapsed = event.value;
					break;
				case ObEMasterLayoutEventValues.LAYOUT:
					this.hasLayout = event.value;
					break;
			}
		});
	}

	private focusFragment() {
		this.router.events
			.pipe(
				filter(evt => evt instanceof NavigationEnd),
				map(() => this.router.url.split('#'))
			)
			.subscribe(route => {
				this.url = route[0];
				if (route[1] && this.config.focusableFragments.indexOf(route[1]) > -1) {
					const el = document.getElementById(route[1]);
					if (el) {
						el.focus();
					}
				}
			});
	}

	private focusOffCanvasClose() {
		this.offCanvasService.opened
			.pipe(
				takeUntil(this.unsubscribe),
				filter(value => value)
			)
			.subscribe(() => {
				setTimeout(() => this.offCanvasClose.nativeElement.focus(), 600);
			});
	}
}
