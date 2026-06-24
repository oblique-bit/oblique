import {
	AfterViewInit,
	Component,
	Input,
	OnChanges,
	OnDestroy,
	OnInit,
	ViewEncapsulation,
	inject,
	output,
} from '@angular/core';
import {IsActiveMatchOptions, NavigationEnd, Router} from '@angular/router';
import {filter, map, takeUntil} from 'rxjs/operators';

import {BehaviorSubject, Observable, combineLatestWith} from 'rxjs';
import {OB_HIDE_EXTERNAL_LINKS_IN_MAIN_NAVIGATION, ObINavigationLink} from '../master-layout.model';
import {ObMasterLayoutNavigationItemDirective} from './master-layout-navigation-item.directive';
import {ObNavigationLink} from './navigation-link.model';
import {TranslateService} from '@ngx-translate/core';
import {OB_HAS_LANGUAGE_IN_URL} from '../../utilities';
import {getScrollIntoViewDelta} from './scroll-delta';
import {MasterLayoutNavigationComponentBase} from './master-layout-navigation-component-base';

@Component({
	selector: 'ob-master-layout-navigation',
	standalone: false,
	templateUrl: './master-layout-navigation.component.html',
	styleUrls: ['./master-layout-navigation.component.scss', './master-layout-navigation-scrollable.component.scss'],
	encapsulation: ViewEncapsulation.None,
	host: {
		'[class.navigation-scrollable]': 'isScrollable',
		'[class.navigation-scrollable-active]': 'isScrollable',
		class: 'ob-master-layout-navigation',
	},
})
export class ObMasterLayoutNavigationComponent
	extends MasterLayoutNavigationComponentBase
	implements OnChanges, OnInit, AfterViewInit, OnDestroy
{
	currentGrandparentLink: ObNavigationLink = new ObNavigationLink();
	currentParentLink: ObNavigationLink = new ObNavigationLink();
	currentParentRouterLinkBase$: Observable<string>;
	initializedLinks: ObNavigationLink[] = [];
	isCurrentParentLinkExactMatch = false;
	hasOpenedMenu = false;
	hideExternalLinks = true;
	@Input() links: ObINavigationLink[] = [];
	readonly linksChanged = output<ObINavigationLink[]>();
	routerLinkActiveOptions: IsActiveMatchOptions = {
		paths: 'subset',
		queryParams: 'subset',
		fragment: 'ignored',
		matrixParams: 'ignored',
	};
	private readonly router = inject(Router);
	private readonly translate = inject(TranslateService);
	private readonly currentParentAncestors: BehaviorSubject<ObNavigationLink[]> = new BehaviorSubject<
		ObNavigationLink[]
	>([]);
	private readonly currentParentLinkSource: BehaviorSubject<ObNavigationLink> = new BehaviorSubject<ObNavigationLink>(
		new ObNavigationLink()
	);
	private readonly currentParentRouterLinkBase: BehaviorSubject<string> = new BehaviorSubject<string>('');
	private readonly currentUrl: BehaviorSubject<string> = new BehaviorSubject<string>('');
	private readonly hasLanguageInUrl = inject(OB_HAS_LANGUAGE_IN_URL);

	constructor() {
		super();
		const hideExternalLinks = inject(OB_HIDE_EXTERNAL_LINKS_IN_MAIN_NAVIGATION, {optional: true});
		this.hideExternalLinks = hideExternalLinks ?? true;
		this.currentParentRouterLinkBase$ = this.currentParentRouterLinkBase.asObservable();
	}

	ngOnChanges(): void {
		this.initializedLinks = this.links?.map(link => new ObNavigationLink(link)) ?? [];
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
		this.masterLayout.navigation.scrolled
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(offset => this.updateScroll(offset));
	}

	ngOnDestroy(): void {
		this.unsubscribe.next();
		this.unsubscribe.complete();
	}

	focusIn(prefix: string, linkId: string): void {
		this.handleNavItemFocusChange(prefix, linkId, true);
	}

	focusOut(prefix: string, linkId: string): void {
		this.handleNavItemFocusChange(prefix, linkId, false);
	}

	backUpOrCloseSubMenu(
		link: ObNavigationLink,
		obMasterLayoutNavigationItem: ObMasterLayoutNavigationItemDirective
	): void {
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

	toggleSubMenu(obMasterLayoutNavigationItem: ObMasterLayoutNavigationItemDirective, link: ObNavigationLink): void {
		obMasterLayoutNavigationItem.toggleSubMenu();
		this.onSubMenuExpandedChanges(obMasterLayoutNavigationItem, link);
	}

	removeMenuItem(item: ObINavigationLink, mouseEvent: MouseEvent): void {
		mouseEvent.preventDefault();
		this.initializedLinks = this.initializedLinks.filter(initializedLink => initializedLink.id !== item.id);
		this.links = this.links.filter(link => link.id !== item.id);
		this.linksChanged.emit(this.links);
	}

	private handleNavItemFocusChange(prefix: string, linkId: string, isFocused: boolean): void {
		const focusedEl: HTMLElement = this.el.nativeElement.querySelector(
			`.ob-master-layout-navigation-link.ob-main-nav-link#${linkId}`
		);
		const idOfNavItem = `#${prefix}${linkId}`;
		const navItem: HTMLElement = this.el.nativeElement.querySelector(idOfNavItem);
		if (isFocused) {
			this.updateScroll(getScrollIntoViewDelta(this.getNav(), navItem));
		}
		if (focusedEl.classList.contains('cdk-keyboard-focused')) {
			navItem.classList.add('ob-has-keyboard-focused-child');
		} else {
			navItem.classList.remove('ob-has-keyboard-focused-child');
		}
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

	private getCurrentGrandparentLink(parentIndex: number = this.getParentIndex()): ObNavigationLink {
		return this.currentParentAncestors.value[parentIndex - 1];
	}

	private getParentIndex(): number {
		return this.currentParentAncestors.value.indexOf(this.currentParentLinkSource.value);
	}

	private isLinkInCurrentParentAncestors(link: ObNavigationLink): boolean {
		return this.currentParentAncestors.value.includes(link);
	}

	private isLinkActive(link: ObNavigationLink): boolean {
		if (this.hasLanguageInUrl) {
			const language = this.translate.getCurrentLang();
			const urlWithLanguage = `/${language}/${link.url}`;
			return this.router.isActive(urlWithLanguage, link.routerLinkActiveOptions || this.routerLinkActiveOptions);
		}
		return this.router.isActive(link.url, link.routerLinkActiveOptions || this.routerLinkActiveOptions);
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
					link.active = this.isLinkActive(link);
				});
			});
	}

	private monitorForCurrentParentAncestorChanges(): void {
		this.currentParentAncestors
			.pipe(takeUntil(this.unsubscribe))
			.subscribe(() => this.onCurrentParentAncestorsChange());
	}

	private monitorForIsCurrentParentLinkExactMatchChanges(): void {
		this.currentUrl
			.pipe(
				combineLatestWith(this.currentParentRouterLinkBase, this.currentParentLinkSource),
				takeUntil(this.unsubscribe)
			)
			.subscribe(([url, currentParentRouterLinkBase, currentParentLink]) => {
				this.isCurrentParentLinkExactMatch = url.endsWith(`${currentParentRouterLinkBase}/${currentParentLink.url}`);
			});
	}

	private monitorForCurrentParentLinkChanges(): void {
		this.currentParentLinkSource.pipe(takeUntil(this.unsubscribe)).subscribe(currentParentLink => {
			this.currentParentLink = currentParentLink;
		});
	}

	private monitorForNavigationEndEvents(): void {
		this.router.events
			.pipe(
				filter(routerEvent => routerEvent instanceof NavigationEnd),
				map(routerEvent => routerEvent.url),
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

	private onSubMenuExpandedChanges(
		obMasterLayoutNavigationItem: ObMasterLayoutNavigationItemDirective,
		link: ObNavigationLink
	): void {
		if (obMasterLayoutNavigationItem.isExpanded) {
			this.changeCurrentParentLink(link);
		} else {
			this.resetCurrentAncestorRelatedProps();
		}
	}

	private resetCurrentAncestorRelatedProps(): void {
		this.currentParentAncestors.next([]);
		this.currentParentRouterLinkBase.next('');
		this.currentParentLinkSource.next(new ObNavigationLink());
		this.currentGrandparentLink = new ObNavigationLink();
		this.isCurrentParentLinkExactMatch = false;
	}
}
