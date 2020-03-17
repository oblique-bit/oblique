import {
	Component,
	ContentChildren,
	ElementRef,
	HostBinding,
	HostListener,
	Inject,
	Input,
	OnInit,
	QueryList,
	TemplateRef,
	ViewChild,
	ViewEncapsulation
} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {DOCUMENT} from '@angular/common';
import {filter, map, takeUntil} from 'rxjs/operators';

import {ObUnsubscribable} from '../../unsubscribe.class';
import {ObOffCanvasService} from '../../off-canvas/off-canvas.module';
import {ObMasterLayoutService} from '../master-layout.service';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {ObINavigationLink} from '../master-layout-navigation/master-layout-navigation.component';
import {ObScrollingEvents} from '../../scrolling/scrolling-events';
import {ObEMasterLayoutEventValues} from '../master-layout.utility';
import {appVersion} from '../../version';
import {WINDOW} from '../../utilities';

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
	host: {class: 'application', 'ob-version': appVersion}
})
export class ObMasterLayoutComponent extends ObUnsubscribable implements OnInit {
	home = this.config.homePageRoute;
	url: string;
	@Input() navigation: ObINavigationLink[] = [];
	@HostBinding('class.application-fixed') isFixed = this.masterLayout.layout.isFixed;
	@HostBinding('class.has-cover') hasCover = this.masterLayout.layout.hasCover;
	@HostBinding('class.has-layout') hasLayout = this.masterLayout.layout.hasLayout;
	@HostBinding('class.header-open') isMenuCollapsed = this.masterLayout.layout.isMenuOpened;
	@HostBinding('class.no-navigation') noNavigation = !this.masterLayout.layout.hasMainNavigation;
	@HostBinding('class.offcanvas') hasOffCanvas = this.masterLayout.layout.hasOffCanvas;
	@HostBinding('class.footer-sm') footerSm = this.masterLayout.footer.isSmall;
	@HostBinding('class.application-scrolling') isScrolling = false;
	@HostBinding('class.outline') outline = true;
	@ContentChildren('obHeaderControl') readonly headerControlTemplates: QueryList<TemplateRef<any>>;
	@ContentChildren('obFooterLink') readonly footerLinkTemplates: QueryList<TemplateRef<any>>;
	@ViewChild('offCanvasClose') readonly offCanvasClose: ElementRef<HTMLElement>;
	private readonly window: Window;

	constructor(
		private readonly masterLayout: ObMasterLayoutService,
		private readonly config: ObMasterLayoutConfig,
		readonly offCanvasService: ObOffCanvasService,
		private readonly router: Router,
		private readonly scrollEvents: ObScrollingEvents,
		@Inject(DOCUMENT) private readonly document: any,
		@Inject(WINDOW) window
	) {
		super();
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

	@HostListener('window:scroll')
	ngOnInit(): void {
		const scrollTop = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
		this.scrollEvents.hasScrolled(scrollTop);
		if (this.isScrolling !== scrollTop > 0) {
			this.isScrolling = scrollTop > 0;
			this.scrollEvents.scrolling(this.isScrolling);
		}
		this.masterLayout.footer.configEvents.pipe(filter(evt => evt.name === ObEMasterLayoutEventValues.SMALL)).subscribe(evt => this.footerSm = evt.value);
	}

	private propertyChanges() {
		this.masterLayout.layout.configEvents.pipe(takeUntil(this.unsubscribe)).subscribe((event) => {
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
		this.router.events.pipe(
			filter(evt => evt instanceof NavigationEnd),
			map(() => this.router.url.split('#'))
		).subscribe((route) => {
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
		this.offCanvasService.opened.pipe(takeUntil(this.unsubscribe), filter(value => value)).subscribe(() => {
			setTimeout(() => this.offCanvasClose.nativeElement.focus(), 600);
		});
	}
}
