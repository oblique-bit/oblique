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

export class NotificationType {
	// Variants:
	static INFO = new NotificationType('info', 1);
	static SUCCESS = new NotificationType('success', 2);
	static WARNING = new NotificationType('warning', 3);
	static ERROR = new NotificationType('error', 4);

	static VALUES = [
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
