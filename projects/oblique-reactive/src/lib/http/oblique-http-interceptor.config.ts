import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {ObliqueRequest} from './oblique-http-interceptor';
import {NotificationConfig, NotificationType} from '../notification/notification.module';

// TODO: make sure that app.module.ts provides an instance of ObliqueHttpInterceptorConfig filled with data from environment[.prod].ts

/**
 * Configuration service for the Oblique HTTP interceptor.
 *
 * @link ObliqueHttpInterceptor
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the Oblique HTTP interceptor, if imported as `HTTP_INTERCEPTORS` provider.
 */
@Injectable({providedIn: 'root'})
export class ObliqueHttpInterceptorConfig {
	/**
	 * Emitted *before* the request is sent
	 */
	requested = new Subject<ObliqueRequest>();
	/**
	 * This will be feed with `requested` events
	 */
	requestIntercepted: Observable<ObliqueRequest> = this.requested.asObservable();

	/**
	 * Emitted on reception of 401 response
	 */
	expired = new Subject<void>();
	/**
	 * This will be feed with `expired`events
	 */
	sessionExpired: Observable<void> = this.expired.asObservable();

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
			severity: NotificationType.ERROR,
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
			/**
			 * Configuration of notification
			 */
			config: new NotificationConfig()
		}
	};

	/**
	 * The timeout delay to wait before a request will be considered as failed.
	 * A notification will be issued to warn the user about request timeout, but the request itself won't be cancelled.
	 * If the timeout is zero, null or undefined, no warning will be issued
	 */
	timeout = 15000;
}
