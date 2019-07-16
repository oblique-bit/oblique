export interface INotification {
	id?: number;
	type?: NotificationType;
	message?: string | KeyWithParams;
	messageParams?: { [key: string]: any };
	title?: string | KeyWithParams;
	titleParams?: { [key: string]: any };
	channel?: string;
	sticky?: boolean;
	timeout?: number;
	$state?: string;
}

export interface INotificationConfig {
	channel?: string;
	sticky?: boolean;
	timeout?: number;
	title?: string | KeyWithParams;
}

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
