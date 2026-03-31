import {ObENotificationType} from '../notification/notification.model';
import {HttpErrorResponse} from '@angular/common/http';

export interface ObIHttpApiRequest {
	/**
	 * Notification configuration applied to the intercepted request.
	 */
	notification: ObIHttpApiRequestNotification;

	/**
	 * Defines whether the interceptor should activate a spinner for the intercepted request.
	 */
	spinner: boolean;

	/**
	 * Defines the spinner channel used for the intercepted request.
	 */
	spinnerChannel: string;
}

export interface ObIHttpApiRequestNotification {
	active: boolean;
	severity: ObENotificationType;
	title: string;
	text: string;
	sticky: boolean;
}

export interface ObIObliqueHttpErrorResponse {
	error: HttpErrorResponse;
	handled: boolean;
}
