import {Injectable} from '@angular/core';
import {ObILocale, ObIMasterLayoutHeader, ObIMasterLayoutNavigation, ObEScrollMode, ObIMasterLayoutFooter} from './master-layout.datatypes';

/**
 * Configuration service for the Master Layout component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for the master layout
 */
@Injectable({providedIn: 'root'})
export class ObMasterLayoutConfig {
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
	locale: ObILocale = {
		locales: ['de', 'fr', 'it'],
		default: 'de',
		disabled: false
	};

	/**
	 *  Controls the application's layout
	 */
	layout = {
		isFixed: false,
		hasCover: false,
		hasMainNavigation: true,
		hasOffCanvas: false,
		hasLayout: true
	};

	/**
	 * Controls the application's header
	 */
	header: ObIMasterLayoutHeader = {
		isAnimated: true,
		isSticky: true,
		isMedium: false,
		isCustom: false,
		hasScrollTransitions: true // indicates if the header should be resized when scrolling
	};

	/**
	 * Controls the application's main navigation
	 */
	navigation: ObIMasterLayoutNavigation = {
		isFullWidth: false,
		scrollMode: ObEScrollMode.AUTO,
		scrollDelta: 95,
		activeClass: 'active',
		links: []
	};

	/**
	 * Controls the applications's footer
	 */
	footer: ObIMasterLayoutFooter = {
		isSmall: true,
		isCustom: false,
		hasScrollTransitions: true // indicates if the footer should be resized when scrolling
	};
}
