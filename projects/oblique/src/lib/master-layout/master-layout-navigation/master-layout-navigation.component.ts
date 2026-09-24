import {
	AfterViewInit,
	ChangeDetectionStrategy,
	Component,
	OnInit,
	ViewEncapsulation,
	computed,
	inject,
	linkedSignal,
	model,
	output,
} from '@angular/core';
import {IsActiveMatchOptions, NavigationEnd, Router, isActive} from '@angular/router';
import {takeUntilDestroyed, toSignal} from '@angular/core/rxjs-interop';
import {filter} from 'rxjs/operators';

import {OB_HIDE_EXTERNAL_LINKS_IN_MAIN_NAVIGATION, ObINavigationLink} from '../master-layout.model';
import {ObMasterLayoutNavigationItemDirective} from './master-layout-navigation-item.directive';
import {ObNavigationLink} from './navigation-link.model';
import {TranslateService} from '@ngx-translate/core';
import {getScrollIntoViewDelta} from './scroll-delta';
import {MasterLayoutNavigationComponentBase} from './master-layout-navigation-component-base';
import {OB_HAS_LANGUAGE_IN_URL} from '../../language/language.provider';
import {NavigationMenuStateSource} from './master-layout-navigation-state.model';

@Component({
	selector: 'ob-master-layout-navigation',
	standalone: false,
	templateUrl: './master-layout-navigation.component.html',
	styleUrls: ['./master-layout-navigation.component.scss', './master-layout-navigation-scrollable.component.scss'],
	changeDetection: ChangeDetectionStrategy.OnPush,
	encapsulation: ViewEncapsulation.None,
	host: {
		'[class.navigation-scrollable]': 'isScrollable()',
		'[class.navigation-scrollable-active]': 'isScrollable()',
		class: 'ob-master-layout-navigation',
	},
})
export class ObMasterLayoutNavigationComponent
	extends MasterLayoutNavigationComponentBase
	implements OnInit, AfterViewInit
{
	readonly currentGrandparentLink = computed(() => this.parentStack().at(-2));
	readonly currentParentLink = computed(() => this.parentStack().at(-1) ?? this.emptyNavigationLink);
	readonly currentParentRouterLinkBase = computed(() =>
		this.parentStack()
			.slice(0, -1)
			.map(link => link.url)
			.reduce((previous, current) => `${previous}/${current}`, '')
	);
	readonly isCurrentParentLinkExactMatch = computed(() => {
		const parent = this.currentParentLink();
		const url = this.joinUrls(this.currentParentRouterLinkBase(), parent.url);
		const isActiveSignal = isActive(this.localizeUrl(url), this.router, {
			paths: 'exact',
			queryParams: 'ignored',
			fragment: 'ignored',
			matrixParams: 'ignored',
		});

		return !!parent.url && isActiveSignal();
	});
	hideExternalLinks = true;
	readonly links = model<ObINavigationLink[]>([]);
	/** @deprecated since Oblique 16. Will be removed in Oblique 17. Use `linksChange` instead. */
	readonly linksChanged = output<ObINavigationLink[]>();
	readonly navigationLinks = computed(() => this.links()?.map(link => new ObNavigationLink(link)) ?? []);
	readonly activeLinks = computed(() => {
		const states = this.flattenLinks(this.navigationLinks()).map(({link, url}) => {
			const activeSignal = isActive(
				this.localizeUrl(url),
				this.router,
				link.routerLinkActiveOptions ?? this.routerLinkActiveOptions
			);

			return {link, activeSignal};
		});

		return new Set(states.filter(state => state.activeSignal()).map(state => state.link));
	});

	routerLinkActiveOptions: IsActiveMatchOptions = {
		paths: 'subset',
		queryParams: 'subset',
		fragment: 'ignored',
		matrixParams: 'ignored',
	};
	private readonly router = inject(Router);
	private readonly translate = inject(TranslateService);
	private readonly hasLanguageInUrl = inject(OB_HAS_LANGUAGE_IN_URL);
	private readonly emptyNavigationLink = new ObNavigationLink();
	private readonly navigationEnd = toSignal(
		this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
	);
	private readonly navigationResetSource = computed<NavigationMenuStateSource>(() => ({
		navigationId: this.navigationEnd()?.id ?? 0,
		links: this.navigationLinks(),
	}));
	private readonly parentStack = linkedSignal<NavigationMenuStateSource, ObNavigationLink[]>({
		source: this.navigationResetSource,
		computation: () => [],
	});

	constructor() {
		super();
		const hideExternalLinks = inject(OB_HIDE_EXTERNAL_LINKS_IN_MAIN_NAVIGATION, {optional: true});
		this.hideExternalLinks = hideExternalLinks ?? true;
	}

	ngOnInit(): void {
		this.closeOnEscape();
	}

	ngAfterViewInit(): void {
		this.masterLayout.navigation.scrolled
			.pipe(takeUntilDestroyed(this.destroyRef))
			.subscribe(offset => this.updateScroll(offset));
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
		if (this.currentParentLink().id === link.id) {
			this.closeSubMenu(obMasterLayoutNavigationItem, link);
		} else {
			this.backUpSubMenu();
		}
	}

	changeCurrentParentLink(link: ObNavigationLink): void {
		this.parentStack.update(stack => {
			const existingIndex = stack.indexOf(link);

			return existingIndex === -1 ? [...stack, link] : stack.slice(0, existingIndex + 1);
		});
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
		const links = this.links()?.filter(link => link.id !== item.id) ?? [];
		this.links.set(links);
		this.linksChanged.emit(links);
	}

	private handleNavItemFocusChange(prefix: string, linkId: string, isFocused: boolean): void {
		const focusedEl = this.el.nativeElement.querySelector<HTMLElement>(
			`.ob-master-layout-navigation-link.ob-main-nav-link#${linkId}`
		);
		const idOfNavItem = `#${prefix}${linkId}`;
		const navItem = this.el.nativeElement.querySelector<HTMLElement>(idOfNavItem);
		if (!focusedEl || !navItem) {
			return;
		}
		if (isFocused) {
			const nav = this.getNav();
			if (nav) {
				this.updateScroll(getScrollIntoViewDelta(nav, navItem));
			}
		}
		if (focusedEl.classList.contains('cdk-keyboard-focused')) {
			navItem.classList.add('ob-has-keyboard-focused-child');
		} else {
			navItem.classList.remove('ob-has-keyboard-focused-child');
		}
	}

	private backUpSubMenu(): void {
		const parentIndex = this.getParentIndex();
		if (parentIndex > -1) {
			this.parentStack.update(stack => stack.slice(0, parentIndex));
		} else {
			this.resetCurrentAncestorRelatedProps();
			throw Error(
				`parentIndex is: ${parentIndex} in ${ObMasterLayoutNavigationComponent.name}.${ObMasterLayoutNavigationComponent.prototype.backUpSubMenu.name}`
			);
		}
	}

	private flattenLinks(links: readonly ObNavigationLink[], parentUrl = ''): {link: ObNavigationLink; url: string}[] {
		return links.flatMap(link => {
			const url = this.joinUrls(parentUrl, link.url);

			return [{link, url}, ...this.flattenLinks(link.children ?? [], url)];
		});
	}

	private getParentIndex(): number {
		return this.parentStack().indexOf(this.currentParentLink());
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

	private localizeUrl(url: string): string {
		const currentLang = this.translate.currentLang();

		if (!this.hasLanguageInUrl || !currentLang) {
			return url;
		}

		const normalizedUrl = url.replace(/^\/+/u, '');
		return normalizedUrl ? `/${currentLang}/${normalizedUrl}` : `/${currentLang}`;
	}

	private joinUrls(parentUrl: string, childUrl: string): string {
		return [parentUrl, childUrl].filter(Boolean).join('/');
	}

	private resetCurrentAncestorRelatedProps(): void {
		this.parentStack.set([]);
	}
}
