export interface ObINotification {
	idPrefix?: string;
	type?: ObENotificationType;
	message?: string;
	messageParams?: {[key: string]: any};
	title?: string;
	titleParams?: {[key: string]: any};
	channel?: string;
	sticky?: boolean;
	timeout?: number;
	groupSimilar?: boolean;
}

export interface ObINotificationPrivate extends ObINotification {
	$state?: string;
	occurrences?: number;
	timer?: number;
}

export interface ObINotificationConfig {
	channel?: string;
	sticky?: boolean;
	timeout?: number;
	title?: string;
	groupSimilar?: boolean;
}

export enum ObENotificationType {
	INFO = 'info',
	SUCCESS = 'success',
	WARNING = 'warning',
	ERROR = 'error'
}
