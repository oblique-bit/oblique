import {Injectable} from '@angular/core';

/**
 * Configuration service for the Master Layout component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for the master layout
 */
@Injectable()
export class MasterLayoutConfig {
	/**
	 * Route to the home page
	 */
	homePageRoute = '/home';

	/**
	 * Locales of the application
	 */
	locales = ['de', 'fr', 'it'];

	/**
	 *  Controls the application's layout
	 */
	layout = {
		fixed: false,
		cover: false,
		mainNavigation: true
	};

	/**
	 * Controls the application's header
	 */
	header = {
		animate: true,
		sticky: true,
		medium: false
	};

	/**
	 * Controls the application's main navigation
	 */
	navigation = {
		fullWidth: true,
		scrollable: false,
		activeClass: 'active',
		links: []
	};

	/**
	 * Controls the applications's footer
	 */
	footer = {
		small: true,
		links: [{url: 'http://www.disclaimer.admin.ch', label: 'i18n.application.footer.legal.label', title: 'i18n.application.footer.legal.title'}]
	};
}
