import {
	ChangeDetectionStrategy,
	Component,
	Input,
	ModelSignal,
	Signal,
	computed,
	model,
	output,
	signal,
} from '@angular/core';
import {ObINavigationLink} from '../master-layout.module';
import {ObNavigationLink} from '../master-layout-navigation/navigation-link.model';
import {IsActiveMatchOptions} from '@angular/router';
import {ObMasterLayoutNavigationItemDirective} from '../master-layout-navigation/master-layout-navigation-item.directive';

/**
 *  @deprecated since Oblique 11. No removal version is planned. Use the real instances instead
 */
@Component({
	selector: 'ob-master-layout-navigation',
	standalone: false,
	template: '',
	changeDetection: ChangeDetectionStrategy.OnPush,
	exportAs: 'obMasterLayoutNavigation',
})
export class ObMockMasterLayoutNavigationComponent {
	readonly currentGrandparentLink: Signal<ObINavigationLink | undefined> = signal(undefined);
	readonly currentParentLink: Signal<ObINavigationLink> = signal(new ObNavigationLink());
	readonly currentParentRouterLinkBase: Signal<string> = signal('');
	readonly isCurrentParentLinkExactMatch: Signal<boolean> = signal(true);
	hideExternalLinks = true;
	readonly links: ModelSignal<ObINavigationLink[] | null> = model<ObINavigationLink[] | null>([]);
	/** @deprecated since Oblique 16. Will be removed in Oblique 17. Use `linksChange` instead. */
	readonly linksChanged = output<ObINavigationLink[]>();
	readonly navigationLinks: Signal<ObNavigationLink[]> = signal([]);
	readonly activeLinks: Signal<Set<ObNavigationLink>> = signal(new Set<ObNavigationLink>());
	routerLinkActiveOptions: IsActiveMatchOptions = {
		paths: 'subset',
		queryParams: 'subset',
		fragment: 'ignored',
		matrixParams: 'ignored',
	};

	focusIn(prefix: string, linkId: string): void {}

	focusOut(prefix: string, linkId: string): void {}

	backUpOrCloseSubMenu(
		link: ObNavigationLink,
		obMasterLayoutNavigationItem: ObMasterLayoutNavigationItemDirective
	): void {}

	changeCurrentParentLink(link: ObNavigationLink): void {}

	closeSubMenu(obMasterLayoutNavigationItem: ObMasterLayoutNavigationItemDirective, link: ObNavigationLink): void {}

	toggleSubMenu(obMasterLayoutNavigationItem: ObMasterLayoutNavigationItemDirective, link: ObNavigationLink): void {}

	removeMenuItem(item: ObINavigationLink, mouseEvent: MouseEvent): void {}
}
