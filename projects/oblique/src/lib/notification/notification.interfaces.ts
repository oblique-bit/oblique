import Timer = NodeJS.Timer;

export interface INotification {
	idPrefix?: string;
	type?: NotificationType;
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

export interface INotificationConfig {
	channel?: string;
	sticky?: boolean;
	timeout?: number;
	title?: string;
	groupSimilar?: boolean;
}

export enum NotificationType {
	INFO = 'info',
	SUCCESS = 'success',
	WARNING = 'warning',
	ERROR = 'error'
}
