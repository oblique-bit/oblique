import Timer = NodeJS.Timer;

export interface ObINotification {
	idPrefix?: string;
	type?: ObENotificationType;
	message?: string;
	messageParams?: { [key: string]: any };
	title?: string;
	titleParams?: { [key: string]: any };
	channel?: string;
	sticky?: boolean;
	timeout?: number;
	$state?: string;
	occurrences?: number;
	groupSimilar?: boolean;
	timer?: Timer;
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
