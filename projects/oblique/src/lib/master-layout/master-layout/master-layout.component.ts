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

import {Unsubscribable} from '../../unsubscribe.class';
import {OffCanvasService} from '../../off-canvas/off-canvas.module';
import {MasterLayoutService} from '../master-layout.service';
import {MasterLayoutConfig} from '../master-layout.config';
import {ORNavigationLink} from '../master-layout-navigation/master-layout-navigation.component';
import {ScrollingEvents} from '../../scrolling/scrolling-events';
import {MasterLayoutEventValues} from '../master-layout.utility';
import {appVersion} from '../../version';
import {WINDOW} from '../../utilities';

@Component({
	selector: 'or-master-layout',
	exportAs: 'orMasterLayout',
	templateUrl: './master-layout.component.html',
	styleUrls: [
		'./master-layout.component.scss',
		'./master-layout.component-cover.scss',
		'./master-layout.component-offcanvas.scss',
		'./master-layout.component-accessibility.scss'
	],
	encapsulation: ViewEncapsulation.None,
	// tslint:disable-next-line:no-host-metadata-property
	host: {class: 'application', 'or-version': appVersion}
})
export class MasterLayoutComponent extends Unsubscribable implements OnInit {
	home = this.config.homePageRoute;
	url: string;
	@Input() navigation: ORNavigationLink[] = [];
	@HostBinding('class.application-fixed') isFixed = this.masterLayout.layout.isFixed;
	@HostBinding('class.has-cover') hasCover = this.masterLayout.layout.hasCover;
	@HostBinding('class.header-open') isMenuCollapsed = this.masterLayout.layout.isMenuOpened;
	@HostBinding('class.no-navigation') noNavigation = !this.masterLayout.layout.hasMainNavigation;
	@HostBinding('class.offcanvas') hasOffCanvas = this.masterLayout.layout.hasOffCanvas;
	@HostBinding('class.footer-sm') footerSm = this.masterLayout.footer.isSmall;
	@HostBinding('class.application-scrolling') isScrolling = false;
	@ContentChildren('orHeaderControl') readonly headerControlTemplates: QueryList<TemplateRef<any>>;
	@ContentChildren('orFooterLink') readonly footerLinkTemplates: QueryList<TemplateRef<any>>;
	@ViewChild('offCanvasClose') readonly offCanvasClose: ElementRef<HTMLElement>;
	private readonly window: Window;

	constructor(private readonly masterLayout: MasterLayoutService,
				private readonly config: MasterLayoutConfig,
				readonly offCanvasService: OffCanvasService,
				private readonly router: Router,
				private readonly scrollEvents: ScrollingEvents,
				@Inject(DOCUMENT) private readonly document: any,
				@Inject(WINDOW) window) {
		super();
		this.window = window; // because AoT don't accept interfaces as DI
		this.propertyChanges();
		this.focusFragment();
		this.focusOffCanvasClose();
	}

	@HostListener('window:scroll')
	ngOnInit(): void {
		const scrollTop = this.window.pageYOffset || this.document.documentElement.scrollTop || this.document.body.scrollTop || 0;
		this.scrollEvents.hasScrolled(scrollTop);
		if (this.isScrolling !== scrollTop > 0) {
			this.isScrolling = scrollTop > 0;
			this.scrollEvents.scrolling(this.isScrolling);
		}
		this.masterLayout.footer.configEvents.pipe(filter(evt => evt.name === MasterLayoutEventValues.SMALL)).subscribe(evt => this.footerSm = evt.value);
	}

	private propertyChanges() {
		this.masterLayout.layout.configEvents.pipe(takeUntil(this.unsubscribe)).subscribe((event) => {
			switch (event.name) {
				case MasterLayoutEventValues.MAIN_NAVIGATION:
					this.noNavigation = !event.value;
					break;
				case MasterLayoutEventValues.FIXED:
					this.isFixed = event.value;
					break;
				case MasterLayoutEventValues.COVER:
					this.hasCover = event.value;
					break;
				case MasterLayoutEventValues.OFF_CANVAS:
					this.hasOffCanvas = event.value;
					break;
				case MasterLayoutEventValues.COLLAPSE:
					this.isMenuCollapsed = event.value;
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
