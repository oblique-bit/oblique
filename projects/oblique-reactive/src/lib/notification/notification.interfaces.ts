export interface INotification {
	messageKey: string;
	messageParams?: {[key: string]: any};
	titleKey?: string;
	titleParams?: {[key: string]: any};
	id?: number;
	type?: NotificationType;
	sticky?: boolean;
	timeout?: number;
}

export interface KeyWithParams {
	key: string;
	params: {[key: string]: any};
}

export enum NotificationType {
	INFO = 'info',
	SUCCESS = 'success',
	WARNING = 'warning',
	ERROR = 'error'
}

export class Notification implements INotification {
	messageKey: string;
	messageParams?: {[key: string]: any};
	titleKey = '';
	titleParams?: {[key: string]: any};
	id?: number;
	type = NotificationType.INFO;
	sticky = false;
	timeout?: number;

	/**
	 * Animation state.
	 *
	 * @see https://angular.io/guide/animations
	 */
	$state: string = null;

	constructor(
		message: string | KeyWithParams,
		type = NotificationType.INFO,
		sticky = false) {
		this.messageKey = (message as KeyWithParams).key || message as string;
		this.type = type;
		this.sticky = sticky;
	}
}

export interface NotificationEvent {
	channel: string;
	notification?: Notification;
}
