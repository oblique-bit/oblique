import {Injectable} from '@angular/core';

/**
 * Configuration service for the Notification component.
 *
 * You can inject this service, typically in your root component, and customize the values of its properties in
 * order to provide default values for all the notifications used in the application.
 */
@Injectable({providedIn: 'root'})
export class NotificationConfig {
	/**
	 * The channel name where notifications will be broadcasted to.
	 */
	channel = 'default';

	/**
	 * Defines if notifications should be manually closed or if they should auto-close after some timeout.
	 */
	sticky = false;

	/**
	 * The duration delay to wait before closing non-sticky notifications. Applies only for _non-stikcy_ notifications.
	 */
	timeout = 3500;
}
