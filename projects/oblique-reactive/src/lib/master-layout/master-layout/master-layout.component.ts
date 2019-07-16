import {Component, ContentChildren, ElementRef, HostBinding, Input, QueryList, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter, map, takeUntil} from 'rxjs/operators';

import {Unsubscribable} from '../../unsubscribe.class';
import {OffCanvasService} from '../../off-canvas/off-canvas.module';
import {MasterLayoutService} from '../master-layout.service';
import {MasterLayoutConfig} from '../master-layout.config';
import {ORNavigationLink} from '../master-layout-navigation/master-layout-navigation.component';

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
	host: {class: 'application'}
})
export class MasterLayoutComponent extends Unsubscribable {
	home: string;
	url: string;
	@Input() navigation: ORNavigationLink[] = [];
	@HostBinding('class.application-fixed') applicationFixed: boolean;
	@HostBinding('class.has-cover') coverLayout: boolean;
	@HostBinding('class.header-open') headerOpen: boolean;
	@HostBinding('class.no-navigation') noNavigation: boolean;
	@HostBinding('class.offcanvas') offCanvas: boolean;
	@ContentChildren('orHeaderControl') readonly headerControlTemplates: QueryList<TemplateRef<any>>;
	@ContentChildren('orFooterLink') readonly footerLinkTemplates: QueryList<TemplateRef<any>>;
	@ViewChild('offCanvasClose', { static: false }) readonly offCanvasClose: ElementRef<HTMLElement>;

	constructor(private readonly masterLayout: MasterLayoutService,
				private readonly config: MasterLayoutConfig,
				readonly offCanvasService: OffCanvasService,
				readonly router: Router
	) {
		super();

		router.events.pipe(
			filter(evt => evt instanceof NavigationEnd),
			map(() => router.url.split('#'))
		).subscribe((route) => {
			this.url = route[0];
			if (route[1] && this.config.focusableFragments.indexOf(route[1]) > -1) {
				const el = document.getElementById(route[1]);
				if (el) {
					el.focus();
				}
			}
		});
		this.home = this.config.homePageRoute;
		this.applicationFixed = this.config.layout.fixed;
		this.coverLayout = this.config.layout.cover;
		this.noNavigation = !this.config.layout.mainNavigation;
		this.offCanvas = this.config.layout.offCanvas;
		this.headerOpen = !this.masterLayout.menuCollapsed;

		this.updateApplicationFixed();
		this.updateCoverLayout();
		this.updateNoNavigation();
		this.updateOffCanvas();

		this.masterLayout.menuCollapsedChanged.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.headerOpen = !value;
		});

		offCanvasService.opened.pipe(takeUntil(this.unsubscribe), filter(value => value)).subscribe(() => {
			setTimeout(() => this.offCanvasClose.nativeElement.focus(), 600);
		});
	}

	private updateApplicationFixed(): void {
		this.masterLayout.applicationFixed = this.applicationFixed;
		this.masterLayout.applicationFixedChanged.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.applicationFixed = value;
		});
	}

	private updateCoverLayout(): void {
		this.masterLayout.coverLayout = this.coverLayout;
		this.masterLayout.coverLayoutChanged.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.coverLayout = value;
		});
	}

	private updateNoNavigation(): void {
		this.masterLayout.noNavigation = this.noNavigation;
		this.masterLayout.noNavigationChanged.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.noNavigation = value;
		});
	}

	private updateOffCanvas(): void {
		this.masterLayout.offCanvas = this.offCanvas;
		this.masterLayout.offCanvasChanged.pipe(takeUntil(this.unsubscribe)).subscribe((value) => {
			this.offCanvas = value;
		});
	}
}
