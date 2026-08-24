import {ObNavigationLink} from './navigation-link.model';

export interface NavigationMenuStateSource {
	navigationId: number;
	links: readonly ObNavigationLink[];
}
