export interface Notification {
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

export class NotificationType {
	// Variants:
	static DEFAULT = new NotificationType('default', 0);
	static INFO = new NotificationType('info', 1);
	static SUCCESS = new NotificationType('success', 2);
	static WARNING = new NotificationType('warning', 3);
	static ERROR = new NotificationType('error', 4);

	static VALUES = [
		NotificationType.DEFAULT,
		NotificationType.INFO,
		NotificationType.SUCCESS,
		NotificationType.WARNING,
		NotificationType.ERROR,
	];

	constructor(public name: string, public priority: number) {
	}

	toString() {
		return this.name;
	}
}

export class Notification implements Notification {
	messageKey: string;
	messageParams?: {[key: string]: any};
	titleKey? = '';
	titleParams?: {[key: string]: any};
	id?: number;
	type? = NotificationType.DEFAULT;
	sticky? = false;
	timeout?: number;

	/**
	 * Animation state.
	 *
	 * @see https://angular.io/guide/animations
	 */
	$state: string = null;

	constructor(
		message: string | KeyWithParams,
		type = NotificationType.DEFAULT,
		sticky = false) {
		this.messageKey = (<KeyWithParams>message).key || <string>message;
		this.type = type;
		this.sticky = sticky;
	}
}

export interface NotificationEvent {
	channel: string;
	notification?: Notification;
}
