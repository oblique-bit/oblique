import {Injectable} from '@angular/core';

/**
 * Configuration service for the Oblique HTTP interceptor.
 *
 * @link ObliqueHttpInterceptor
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the Oblique HTTP interceptor, if imported as `HTTP_INTERCEPTORS` provider.
 */
@Injectable()
export class ObliqueHttpInterceptorConfig {

	/**
	 * Configuration for application API.
	 *
	 * @type {object}
	 */
	api = {

		/**
		 * Default application API URL for matching API calls.
		 *
		 * @type {string}
		 */
		url: null,

		/**
		 * Defines if spinner should be activated whenever an API request starts.
		 *
		 * @type {boolean}
		 */
		spinner: true
	};

	/**
	 * The timeout delay to wait before a request will be considered as failed.
	 * A notification will be issued to warn the user about request timeout.
	 *
	 * @type {number}
	 */
	timeout = 15000;
}
