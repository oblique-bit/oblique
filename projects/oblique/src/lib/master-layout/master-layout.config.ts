import {Injectable} from '@angular/core';
import {ORNavigationLink} from './master-layout-navigation/master-layout-navigation.component';

export enum ScrollMode {
	AUTO,
	ENABLED,
	DISABLED
}

interface MasterLayoutHeader {
	isAnimated: boolean;
	isSticky: boolean;
	isMedium: boolean;
	isCustom: boolean;
	hasScrollTransitions: boolean;
}
interface MasterLayoutFooter {
	isSmall: boolean;
	isCustom: boolean;
	hasScrollTransitions: boolean;
}

interface MasterLayoutNavigation {
	isFullWidth: boolean;
	scrollMode: ScrollMode;
	scrollDelta: number;
	activeClass: string;
	links: ORNavigationLink[];
}

interface Locale {
	locales: (string | LocaleObject)[];
	default: string;
	disabled: boolean;
}

export interface LocaleObject {
	locale: string;
	id?: string;
}

/**
 * Configuration service for the Master Layout component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for the master layout
 */
@Injectable({providedIn: 'root'})
export class MasterLayoutConfig {
	/**
	 * Route to the home page
	 */
	homePageRoute = '/home';

	/**
	 * Elements that will receive focus when provided as fragment
	 */
	focusableFragments = ['content', 'navigation'];

	/**
	 * Duration of the scroll to top functionality
	 */
	scrollToTopDuration = 200;

	/**
	 * Locales of the application
	 */
	locale: Locale = {
		locales:  ['de', 'fr', 'it'],
		default:  'de',
		disabled: false
	};

	/**
	 *  Controls the application's layout
	 */
	layout = {
		isFixed: false,
		hasCover: false,
		hasMainNavigation: true,
		hasOffCanvas: true,
		hasLayout: true
	};

	/**
	 * Controls the application's header
	 */
	header: MasterLayoutHeader = {
		isAnimated: true,
		isSticky: true,
		isMedium: false,
		isCustom: false,
		hasScrollTransitions: true	// indicates if the header should be resized when scrolling
	};

	/**
	 * Controls the application's main navigation
	 */
	navigation: MasterLayoutNavigation = {
		isFullWidth: false,
		scrollMode: ScrollMode.AUTO,
		scrollDelta: 95,
		activeClass: 'active',
		links: []
	};

	/**
	 * Controls the applications's footer
	 */
	footer: MasterLayoutFooter = {
		isSmall: true,
		isCustom: false,
		hasScrollTransitions: true	// indicates if the footer should be resized when scrolling
	};
}
