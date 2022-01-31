export interface ObINotification {
	idPrefix?: string;
	type?: ObENotificationType;
	message?: string;
	messageParams?: Record<string, any>;
	title?: string;
	titleParams?: Record<string, any>;
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

export enum ObENotificationPlacement {
	BOTTOM_LEFT = 'ob-bottom-left',
	BOTTOM_RIGHT = 'ob-bottom-right',
	TOP_LEFT = 'ob-top-left',
	TOP_RIGHT = 'ob-top-right'
}
