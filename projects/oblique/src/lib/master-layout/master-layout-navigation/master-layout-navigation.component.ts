import {
	AfterViewInit,
	Component,
	ElementRef,
	HostBinding,
	Inject,
	Input,
	OnDestroy,
	OnInit,
	Optional,
	Renderer2,
	ViewEncapsulation
} from '@angular/core';
import {IsActiveMatchOptions, NavigationEnd, Router} from '@angular/router';
import {filter, takeUntil} from 'rxjs/operators';

import {ObMasterLayoutService} from '../master-layout.service';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {
	OB_HIDE_EXTERNAL_LINKS_IN_MAIN_NAVIGATION,
	ObEMasterLayoutEventValues,
	ObEScrollMode,
	ObIMasterLayoutEvent,
	ObINavigationLink
} from '../master-layout.model';
import {Subject} from 'rxjs';
import {ObGlobalEventsService} from '../../global-events/global-events.service';
import {ObUseObliqueIcons} from '../../icon/icon.model';

@Component({
	selector: 'ob-master-layout-navigation',
	templateUrl: './master-layout-navigation.component.html',
	styleUrls: ['./master-layout-navigation.component.scss', './master-layout-navigation.component-scrollable.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-master-layout-navigation'}
})
export class ObMasterLayoutNavigationComponent implements OnInit, AfterViewInit, OnDestroy {
	isFullWidth = this.masterLayout.navigation.isFullWidth;
	activeClass = this.config.navigation.activeClass;
	currentScroll = 0;
	maxScroll = 0;
	hasOpenedMenu = false;
	hideExternalLinks = true;
	@Input() links: ObINavigationLink[] = [];
	@HostBinding('class.navigation-scrollable') @HostBinding('class.navigation-scrollable-active') isScrollable: boolean;
	routerLinkActiveOptions: IsActiveMatchOptions = {paths: 'subset', queryParams: 'subset', fragment: 'ignored', matrixParams: 'ignored'};
	useFontAwesomeIcons = false;
	private static readonly buttonWidth = 30;
	private nav: HTMLElement;
	private readonly unsubscribe: Subject<void> = new Subject<void>();

	constructor(
		private readonly router: Router,
		private readonly masterLayout: ObMasterLayoutService,
		private readonly config: ObMasterLayoutConfig,
		private readonly renderer: Renderer2,
		private readonly el: ElementRef,
		private readonly globalEventsService: ObGlobalEventsService,
		@Optional() @Inject(OB_HIDE_EXTERNAL_LINKS_IN_MAIN_NAVIGATION) hideExternalLinks: boolean,
		@Optional() @Inject(ObUseObliqueIcons) useObliqueIcons: boolean
	) {
		this.useFontAwesomeIcons = !(useObliqueIcons ?? true);
		this.hideExternalLinks = hideExternalLinks ?? true;
		this.masterLayout.navigation.refreshed.pipe(takeUntil(this.unsubscribe)).subscribe(this.refresh.bind(this));
		this.scrollModeChange();
		this.fullWidthChange();
	}

	ngOnInit(): void {
		this.closeOnEscape();
		this.markActiveLink();
		this.checkForExternalLinks(this.links);
	}

	ngAfterViewInit(): void {
		this.nav = this.el.nativeElement.querySelector('.ob-main-nav:not(.ob-sub-nav)');
		this.masterLayout.navigation.scrolled.pipe(takeUntil(this.unsubscribe)).subscribe(offset => this.updateScroll(offset));
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	close(): void {
		this.masterLayout.layout.isMenuOpened = false;
	}

	scrollLeft(): void {
		this.masterLayout.navigation.scrollLeft();
	}

	scrollRight(): void {
		this.masterLayout.navigation.scrollRight();
	}

	private checkForExternalLinks(links: ObINavigationLink[]): void {
		if (links?.length) {
			links.forEach(link => {
				/* eslint-disable logical-assignment-operators */
				link.isExternal = link.isExternal ?? /^https?:\/\//.test(link.url);
				this.checkForExternalLinks(link.children);
			});
		}
	}

	private scrollModeChange(): void {
		this.masterLayout.navigation.configEvents$
			.pipe(
				filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.NAVIGATION_SCROLL_MODE),
				takeUntil(this.unsubscribe)
			)
			.subscribe(() => this.masterLayout.navigation.refresh());
	}

	private fullWidthChange(): void {
		this.masterLayout.navigation.configEvents$
			.pipe(
				filter((evt: ObIMasterLayoutEvent) => evt.name === ObEMasterLayoutEventValues.NAVIGATION_IS_FULL_WIDTH),
				takeUntil(this.unsubscribe)
			)
			.subscribe(event => (this.isFullWidth = event.value));
	}

	private closeOnEscape(): void {
		this.globalEventsService.keyUp$
			.pipe(
				filter(event => event.key === 'Escape'),
				takeUntil(this.unsubscribe)
			)
			.subscribe(() => this.close());
	}

	private markActiveLink(): void {
		this.router.events
			.pipe(
				takeUntil(this.unsubscribe),
				filter(evt => evt instanceof NavigationEnd)
			)
			.subscribe(() => {
				// do not use map so that the reference to the links array remains the same. This allows the navigation to be dynamic
				this.links.forEach(link => {
					link.active = this.router.isActive(link.url, link.routerLinkActiveOptions || this.routerLinkActiveOptions);
				});
			});
	}

	private refresh(): void {
		if (this.nav) {
			const {scrollMode} = this.masterLayout.navigation;
			if (scrollMode === ObEScrollMode.DISABLED) {
				this.isScrollable = false;
			} else {
				const childWidth = Array.from(this.nav.children).reduce((total, el: HTMLElement) => total + el.clientWidth, 0);
				this.maxScroll = Math.max(0, -(this.nav.clientWidth - childWidth - 2 * ObMasterLayoutNavigationComponent.buttonWidth));
				this.isScrollable = scrollMode === ObEScrollMode.ENABLED ? true : childWidth > this.nav.clientWidth;
			}
			this.updateScroll(this.isScrollable ? 0 : -this.currentScroll);
			this.checkForExternalLinks(this.links);
		}
	}

	private updateScroll(delta: number): void {
		this.currentScroll += delta;
		this.currentScroll = Math.max(0, this.currentScroll);
		this.currentScroll = Math.min(this.currentScroll, this.maxScroll);
		this.renderer.setStyle(this.nav.children[0], 'margin-left', `-${this.currentScroll}px`);
	}
}
