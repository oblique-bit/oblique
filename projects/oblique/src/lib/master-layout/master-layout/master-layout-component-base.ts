import {inject} from '@angular/core';
import {filter, takeUntil, tap} from 'rxjs/operators';
import {Subject} from 'rxjs';

import {ObEMasterLayoutEventValues, ObIMasterLayoutEvent} from '../master-layout.model';
import {ObMasterLayoutService} from '../master-layout.service';
import {ObMasterLayoutConfig} from '../master-layout.config';

export class MasterLayoutComponentBase {
	home: string;

	hasCover: boolean;
	hasLayout: boolean;
	hasMaxWidth: boolean;
	isMenuOpened: boolean;
	noNavigation: boolean;
	hasOffCanvas: boolean;
	isHeaderSticky: boolean;
	isFooterSticky: boolean;

	protected readonly masterLayout = inject(ObMasterLayoutService);
	protected readonly unsubscribe = new Subject<void>();

	private readonly config = inject(ObMasterLayoutConfig);

	constructor() {
		this.setup();

		this.layoutHasCoverChange();
		this.layoutHasDefaultLayoutChange();
		this.layoutHasMainNavigationChange();
		this.layoutHasMaxWidthChange();
		this.layoutHasOffCanvasChange();
		this.layoutIsMenuOpenedChange();
		this.footerIsStickyChange();
		this.headerIsStickyChange();
	}

	private setup(): void {
		this.home = this.config.homePageRoute;
		this.hasCover = this.masterLayout.layout.hasCover;
		this.hasLayout = this.masterLayout.layout.hasLayout;
		this.hasMaxWidth = this.masterLayout.layout.hasMaxWidth;
		this.isMenuOpened = this.masterLayout.layout.isMenuOpened;
		this.noNavigation = !this.masterLayout.layout.hasMainNavigation;
		this.hasOffCanvas = this.masterLayout.layout.hasOffCanvas;
		this.isHeaderSticky = this.masterLayout.header.isSticky;
		this.isFooterSticky = this.masterLayout.footer.isSticky;
	}

	private layoutHasMainNavigationChange(): void {
		this.masterLayout.layout.configEvents$
			.pipe(
				filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.LAYOUT_HAS_MAIN_NAVIGATION),
				takeUntil(this.unsubscribe)
			)
			.subscribe(event => {
				this.noNavigation = !event.value;
			});
	}

	private layoutHasCoverChange(): void {
		this.masterLayout.layout.configEvents$
			.pipe(
				filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.LAYOUT_HAS_COVER),
				takeUntil(this.unsubscribe)
			)
			.subscribe(event => {
				this.hasCover = event.value;
			});
	}

	private layoutHasOffCanvasChange(): void {
		this.masterLayout.layout.configEvents$
			.pipe(
				filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.LAYOUT_HAS_OFF_CANVAS),
				takeUntil(this.unsubscribe)
			)
			.subscribe(event => {
				this.hasOffCanvas = event.value;
			});
	}

	private layoutIsMenuOpenedChange(): void {
		this.masterLayout.layout.configEvents$
			.pipe(
				filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.IS_MENU_OPENED),
				takeUntil(this.unsubscribe)
			)
			.subscribe(event => {
				this.isMenuOpened = event.value;
			});
	}

	private layoutHasDefaultLayoutChange(): void {
		this.masterLayout.layout.configEvents$
			.pipe(
				filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.LAYOUT_HAS_DEFAULT_LAYOUT),
				takeUntil(this.unsubscribe)
			)
			.subscribe(event => {
				this.hasLayout = event.value;
			});
	}

	private layoutHasMaxWidthChange(): void {
		this.masterLayout.layout.configEvents$
			.pipe(
				filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.LAYOUT_HAS_MAX_WIDTH),
				takeUntil(this.unsubscribe)
			)
			.subscribe(event => {
				this.hasMaxWidth = event.value;
			});
	}

	private headerIsStickyChange(): void {
		this.masterLayout.header.configEvents$
			.pipe(
				filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.HEADER_IS_STICKY),
				tap((evt: ObIMasterLayoutEvent) => {
					this.isHeaderSticky = evt.value;
				}),
				takeUntil(this.unsubscribe)
			)
			.subscribe();
	}

	private footerIsStickyChange(): void {
		this.masterLayout.footer.configEvents$
			.pipe(
				filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.FOOTER_IS_STICKY),
				tap((evt: ObIMasterLayoutEvent) => {
					this.isFooterSticky = evt.value;
				}),
				takeUntil(this.unsubscribe)
			)
			.subscribe();
	}
}
