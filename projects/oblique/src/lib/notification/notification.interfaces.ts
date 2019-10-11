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
}

export interface INotificationConfig {
	channel?: string;
	sticky?: boolean;
	timeout?: number;
	title?: string;
	groupSimilar?: boolean;
}

// @deprecated, will be removed in v5.0.0
export interface KeyWithParams {
	key: string;
	params: { [key: string]: any };
}

export enum NotificationType {
	INFO = 'info',
	SUCCESS = 'success',
	WARNING = 'warning',
	ERROR = 'error'
}
