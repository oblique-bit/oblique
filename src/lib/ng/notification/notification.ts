export interface Notification {
	messageKey: string
	title?: string
	id?: number
	type?: NotificationType
	sticky?: boolean
	timeout?: number
}

export interface NotificationEvent {
	channel: string
	notification?: Notification
}

export class NotificationType {
	// values
	static DEFAULT = new NotificationType('default', 0);
	static INFO = new NotificationType('info', 1);
	static SUCCESS = new NotificationType('success', 2);
	static WARNING = new NotificationType('warning', 3);
	static ERROR = new NotificationType('error', 4);

	constructor(public name: string, public priority: number) {
	}

	toString() {
		return this.name;
	}
}
