import {Injectable} from '@angular/core';
import {ObEScrollMode, ObILocale, ObIMasterLayoutFooter, ObIMasterLayoutHeader, ObIMasterLayoutNavigation} from './master-layout.model';

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
		locales: ['de-CH', 'fr-CH', 'it-CH'],
		defaultLanguage: 'de',
		disabled: false,
		display: true,
		languages: {
			de: 'Deutsch',
			fr: 'Français',
			it: 'Italiano',
			en: 'English'
		}
	};

	/**
	 *  Controls the application's layout
	 */
	layout = {
		hasCover: false,
		hasMainNavigation: true,
		hasOffCanvas: false,
		hasLayout: true,
		hasMaxWidth: false
	};

	/**
	 * Controls the application's header
	 */
	header: ObIMasterLayoutHeader = {
		isSticky: true,
		isSmall: false,
		isCustom: false,
		reduceOnScroll: true
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
		isSticky: false,
		isCustom: false,
		hasLogoOnScroll: true
	};
}
