import {Injectable} from '@angular/core';
import {ObENotificationType} from '../notification/notification.module';

// TODO: make sure that app.module.ts provides an instance of HttpApiInterceptorConfig filled with data from environment[.prod].ts

/**
 * Configuration service for the Oblique HTTP interceptor.
 *
 * @link HttpApiInterceptor
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the Oblique HTTP interceptor, if imported as `HTTP_INTERCEPTORS` provider.
 */
@Injectable({providedIn: 'root'})
export class ObHttpApiInterceptorConfig {
	/**
	 * Configuration for application API.
	 */
	api = {
		/**
		 * Default application API URL for matching API calls.
		 */
		url: '',

		/**
		 * Defines if spinner should be activated whenever an API request starts.
		 */
		spinner: true,

		/**
		 * Configuration of notification on error
		 */
		notification: {
			/**
			 * Defines if notification are displayed at all
			 */
			active: true,
			/**
			 * Defines the severity (type) of the notification
			 */
			severity: ObENotificationType.ERROR,
			/**
			 * Defines the title of the notification
			 * @default error.statusText
			 */
			title: undefined,
			/**
			 * Defines the text of the notification
			 * @default 'i18n.error.http.status.' + error.status
			 */
			text: undefined,
			sticky: undefined
		}
	};

	/**
	 * The timeout delay to wait before a request will be considered as failed.
	 * A notification will be issued to warn the user about request timeout, but the request itself won't be cancelled.
	 * If the timeout is zero, null or undefined, no warning will be issued
	 */
	timeout = 15000;
}
