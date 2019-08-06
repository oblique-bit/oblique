import {Injectable} from '@angular/core';
import {INotificationConfig} from './notification.interfaces';

@Injectable({providedIn: 'root'})
export class NotificationConfig {
	sticky = false;
	timeout = 3500;
	channel = 'oblique';

	info = {
		title: 'i18n.notification.type.info'
	} as INotificationConfig;

	success = {
		title: 'i18n.notification.type.success'
	} as INotificationConfig;

	warning = {
		title: 'i18n.notification.type.warning'
	} as INotificationConfig;

	error = {
		title: 'i18n.notification.type.error',
		sticky: true,
	} as INotificationConfig;
}
