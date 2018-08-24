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
	 *  Controls the main page layout
	 */
	layout = {
		fixed: false,
		cover: false
	};

	/**
	 * Controls the header
	 */
	header = {
		animate: true,
		sticky: true,
		medium: false
	};
}
