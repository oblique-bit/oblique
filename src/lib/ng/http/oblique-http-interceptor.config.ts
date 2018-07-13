import {EventEmitter, Injectable} from '@angular/core';
import {Observable} from 'rxjs/internal/Observable';
import {ObliqueRequest} from './oblique-http-interceptor';
import {NotificationConfig, NotificationType} from '../notification';

// TODO: make sure that app.module.ts provides an instance of ObliqueHttpInterceptorConfig filled with data from environment[.prod].ts

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
	 * Emitted *before* the request is sent
	 * @type {EventEmitter<ObliqueRequest>}
	 */
	requested = new EventEmitter<ObliqueRequest>();
	/**
	 * This will be feed with `requested` events
	 * @type {Observable<ObliqueRequest>}
	 */
	requestIntercepted: Observable<ObliqueRequest> = this.requested.asObservable();

	/**
	 * Emmitted on reception of 401 response
	 * @type {EventEmitter<void>}
	 */
	expired = new EventEmitter<void>();
	/**
	 * This will be feed with `expired`events
	 * @type {Observable<void>}
	 */
	sessionExpired: Observable<void> = this.expired.asObservable();

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
		url: '',

		/**
		 * Defines if spinner should be activated whenever an API request starts.
		 *
		 * @type {boolean}
		 */
		spinner: true,

		/**
		 * Configuration of notification on error
		 * @type {object}
		 */
		notification: {
			/**
			 * Defines if notification are displayed at all
			 * @type {boolean}
			 */
			active: true,
			/**
			 * Defines the severity (type) of the notification
			 * @type {string}
			 */
			severity: NotificationType.ERROR,
			/**
			 * Defines the title of the notification
			 * @default 'error.statusText
			 * @type {string}
			 */
			title: undefined,
			/**
			 * Defines the text of the notification
			 * @default 'i18n.error.http.status.' + error.status
			 * @type {string}
			 */
			text: undefined,
			/**
			 * Configuration of notification
			 * @type {NotificationConfig}
			 */
			config: new NotificationConfig()
		}
	};

	/**
	 * The timeout delay to wait before a request will be considered as failed.
	 * A notification will be issued to warn the user about request timeout, but the request itself won't be cancelled.
	 * If the timeout is zero, null or undefined, no warning will be issued
	 *
	 * @type {number}
	 */
	timeout = 15000;
}
