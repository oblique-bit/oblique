import {
	AfterViewInit,
	Component,
	ElementRef,
	HostBinding,
	Inject,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	Optional,
	Renderer2,
	ViewEncapsulation
} from '@angular/core';
import {IsActiveMatchOptions, NavigationEnd, Router} from '@angular/router';
import {filter, map, takeUntil} from 'rxjs/operators';

import {ObMasterLayoutService} from '../master-layout.service';
import {ObMasterLayoutConfig} from '../master-layout.config';
import {
	OB_HIDE_EXTERNAL_LINKS_IN_MAIN_NAVIGATION,
	ObEMasterLayoutEventValues,
	ObEScrollMode,
	ObIMasterLayoutEvent,
	ObINavigationLink
} from '../master-layout.model';
import {ObNavigationLink} from './navigation-link.model';
import {BehaviorSubject, Observable, Subject, combineLatestWith} from 'rxjs';
import {ObGlobalEventsService} from '../../global-events/global-events.service';
import {ObMasterLayoutNavigationItemDirective} from './master-layout-navigation-item.directive';

@Component({
	selector: 'ob-master-layout-navigation',
	templateUrl: './master-layout-navigation.component.html',
	styleUrls: ['./master-layout-navigation.component.scss', './master-layout-navigation.component-scrollable.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {class: 'ob-master-layout-navigation'}
})
export class ObMasterLayoutNavigationComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {
	isFullWidth = this.masterLayout.navigation.isFullWidth;
	activeClass = this.config.navigation.activeClass;
	currentScroll = 0;

	currentGrandparentLink: ObNavigationLink = new ObNavigationLink();
	currentParentLink: ObNavigationLink = new ObNavigationLink();
	currentParentRouterLinkBase$: Observable<string>;
	initializedLinks: ObNavigationLink[] = [];
	isCurrentParentLinkExactMatch = false;
	maxScroll = 0;
	hasOpenedMenu = false;
	hideExternalLinks = true;
	@Input() links: ObINavigationLink[] = [];
	@HostBinding('class.navigation-scrollable') @HostBinding('class.navigation-scrollable-active') isScrollable: boolean;
	routerLinkActiveOptions: IsActiveMatchOptions = {paths: 'subset', queryParams: 'subset', fragment: 'ignored', matrixParams: 'ignored'};
	private static readonly buttonWidth = 30;
	private nav: HTMLElement;
	private readonly currentParentAncestors: BehaviorSubject<ObNavigationLink[]> = new BehaviorSubject<ObNavigationLink[]>([]);
	private readonly currentParentLinkSource: BehaviorSubject<ObNavigationLink> = new BehaviorSubject<ObNavigationLink>(
		new ObNavigationLink()
	);
	private readonly currentParentRouterLinkBase: BehaviorSubject<string> = new BehaviorSubject<string>('');
	private readonly currentUrl: BehaviorSubject<string> = new BehaviorSubject<string>('');
	private readonly unsubscribe: Subject<void> = new Subject<void>();

	constructor(
		private readonly router: Router,
		private readonly masterLayout: ObMasterLayoutService,
		private readonly config: ObMasterLayoutConfig,
		private readonly renderer: Renderer2,
		private readonly el: ElementRef,
		private readonly globalEventsService: ObGlobalEventsService,
		@Optional() @Inject(OB_HIDE_EXTERNAL_LINKS_IN_MAIN_NAVIGATION) hideExternalLinks: boolean
	) {
		this.hideExternalLinks = hideExternalLinks ?? true;
		this.masterLayout.navigation.refreshed.pipe(takeUntil(this.unsubscribe)).subscribe(this.refresh.bind(this));
		this.currentParentRouterLinkBase$ = this.currentParentRouterLinkBase.asObservable();
		this.scrollModeChange();
		this.fullWidthChange();
	}

	ngOnInit(): void {
		this.closeOnEscape();
		this.markActiveLink();
		this.monitorForIsCurrentParentLinkExactMatchChanges();
		this.monitorForCurrentParentAncestorChanges();
		this.monitorForCurrentParentLinkChanges();
		this.monitorForNavigationEndEvents();
	}

	ngAfterViewInit(): void {
		this.nav = this.el.nativeElement.querySelector('.ob-main-nav:not(.ob-sub-nav)');
		this.masterLayout.navigation.scrolled.pipe(takeUntil(this.unsubscribe)).subscribe(offset => this.updateScroll(offset));
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	ngOnChanges(): void {
		this.initializedLinks = this.links.map(link => new ObNavigationLink(link));
	}

	backUpOrCloseSubMenu(link: ObNavigationLink, obMasterLayoutNavigationItem: ObMasterLayoutNavigationItemDirective): void {
		if (this.currentParentLink.id === link.id) {
			this.closeSubMenu(obMasterLayoutNavigationItem, link);
		} else {
			this.backUpSubMenu();
		}
	}

	changeCurrentParentLink(link: ObNavigationLink): void {
		this.currentParentLinkSource.next(link);
		if (!this.isLinkInCurrentParentAncestors(link)) {
			this.addCurrentParentAncestor(link);
		}
	}

	closeSubMenu(obMasterLayoutNavigationItem: ObMasterLayoutNavigationItemDirective, link: ObNavigationLink): void {
		obMasterLayoutNavigationItem.closeSubMenu(false);
		this.onSubMenuExpandedChanges(obMasterLayoutNavigationItem, link);
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

	toggleSubMenu(obMasterLayoutNavigationItem: ObMasterLayoutNavigationItemDirective, link: ObNavigationLink): void {
		obMasterLayoutNavigationItem.toggleSubMenu();
		this.onSubMenuExpandedChanges(obMasterLayoutNavigationItem, link);
	}

	private addCurrentParentAncestor(link: ObNavigationLink): void {
		const currentParentAncestors = this.currentParentAncestors.value;
		currentParentAncestors.push(link);
		this.currentParentAncestors.next(currentParentAncestors);
	}

	private backUpSubMenu(): void {
		const parentIndex = this.getParentIndex();
		if (parentIndex > -1) {
			this.currentParentLinkSource.next(this.getCurrentGrandparentLink(parentIndex));
			const currentParentAncestors = this.currentParentAncestors.value;
			currentParentAncestors.length = parentIndex;
			this.currentParentAncestors.next(currentParentAncestors);
		} else {
			this.resetCurrentAncestorRelatedProps();
			throw Error(
				`parentIndex is: ${parentIndex} in ${ObMasterLayoutNavigationComponent.name}.${ObMasterLayoutNavigationComponent.prototype.backUpSubMenu.name}`
			);
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

	private getCurrentGrandparentLink(parentIndex: number = this.getParentIndex()): ObNavigationLink {
		return this.currentParentAncestors.value[parentIndex - 1];
	}

	private getParentIndex(): number {
		return this.currentParentAncestors.value.indexOf(this.currentParentLinkSource.value);
	}

	private isLinkInCurrentParentAncestors(link: ObNavigationLink): boolean {
		return this.currentParentAncestors.value.includes(link);
	}

	private markActiveLink(): void {
		this.router.events
			.pipe(
				takeUntil(this.unsubscribe),
				filter(evt => evt instanceof NavigationEnd)
			)
			.subscribe(() => {
				// do not use map so that the reference to the initializedLinks array remains the same. This allows the navigation to be dynamic
				this.initializedLinks.forEach(link => {
					link.active = this.router.isActive(link.url, link.routerLinkActiveOptions || this.routerLinkActiveOptions);
				});
			});
	}

	private monitorForCurrentParentAncestorChanges(): void {
		this.currentParentAncestors.pipe(takeUntil(this.unsubscribe)).subscribe(() => this.onCurrentParentAncestorsChange());
	}

	private monitorForIsCurrentParentLinkExactMatchChanges(): void {
		this.currentUrl
			.pipe(combineLatestWith(this.currentParentRouterLinkBase, this.currentParentLinkSource), takeUntil(this.unsubscribe))
			.subscribe(([url, currentParentRouterLinkBase, currentParentLink]) => {
				this.isCurrentParentLinkExactMatch = url.endsWith(`${currentParentRouterLinkBase}/${currentParentLink.url}`);
			});
	}

	private monitorForCurrentParentLinkChanges(): void {
		this.currentParentLinkSource
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(currentParentLink => (this.currentParentLink = currentParentLink));
	}

	private monitorForNavigationEndEvents(): void {
		this.router.events
			.pipe(
				filter(routerEvent => routerEvent instanceof NavigationEnd),
				map(routerEvent => (routerEvent as NavigationEnd).url),
				takeUntil(this.unsubscribe)
			)
			.subscribe(url => {
				this.currentUrl.next(url);
				this.resetCurrentAncestorRelatedProps();
			});
	}

	private onCurrentParentAncestorsChange(): void {
		this.currentParentRouterLinkBase.next(
			this.currentParentAncestors.value
				.slice(0, -1)
				.map(link => link.url)
				.reduce((previous, current) => `${previous}/${current}`, '')
		);
		this.currentGrandparentLink = this.getCurrentGrandparentLink();
	}

	private onSubMenuExpandedChanges(obMasterLayoutNavigationItem: ObMasterLayoutNavigationItemDirective, link: ObNavigationLink): void {
		if (obMasterLayoutNavigationItem.isExpanded) {
			this.changeCurrentParentLink(link);
		} else {
			this.resetCurrentAncestorRelatedProps();
		}
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
		}
	}

	private resetCurrentAncestorRelatedProps(): void {
		this.currentParentAncestors.next([]);
		this.currentParentRouterLinkBase.next('');
		this.currentParentLinkSource.next(new ObNavigationLink());
		this.currentGrandparentLink = new ObNavigationLink();
		this.isCurrentParentLinkExactMatch = false;
	}

	private updateScroll(delta: number): void {
		this.currentScroll += delta;
		this.currentScroll = Math.max(0, this.currentScroll);
		this.currentScroll = Math.min(this.currentScroll, this.maxScroll);
		this.renderer.setStyle(this.nav.children[0], 'margin-left', `-${this.currentScroll}px`);
	}
}
