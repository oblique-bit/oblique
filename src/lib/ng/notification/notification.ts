export class Notification {
	constructor(public id: number,
				public type: NotificationType,
				public messageKey: string,
				public title: string,
				public sticky: boolean) {

	}
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
