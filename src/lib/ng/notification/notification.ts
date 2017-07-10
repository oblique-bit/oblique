export interface Notification {
	messageKey: string
	title?: string
	id?: number
	type?: NotificationType;
	sticky?: boolean
	timeout?: number
}

export class Notification implements Notification {
	messageKey: string;
	title? = '';
	id?: number;
	type? = NotificationType.DEFAULT;
	sticky? = false;
	timeout?: number;

	constructor(
		messageKey: string,
		type = NotificationType.DEFAULT,
		sticky = false) {
		this.messageKey = messageKey;
		this.type = type;
		this.sticky = sticky;
	}
}

export interface NotificationEvent {
	channel: string
	notification?: Notification
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
