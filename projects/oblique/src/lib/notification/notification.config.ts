import {Inject, Injectable, InjectionToken, Optional} from '@angular/core';
import {INotificationConfig} from './notification.interfaces';

export const CLEAR_NOTIFICATIONS_ON_ROUTE_CHANGE = new InjectionToken<boolean>('CLEAR_NOTIFICATIONS_ON_ROUTE_CHANGE');

@Injectable({providedIn: 'root'})
export class NotificationConfig {
	sticky = false;
	timeout = 3500;
	channel = 'oblique';
	clearAllOnNavigate: boolean;

	info = {
		title: 'i18n.oblique.notification.type.info'
	} as INotificationConfig;

	success = {
		title: 'i18n.oblique.notification.type.success'
	} as INotificationConfig;

	warning = {
		title: 'i18n.oblique.notification.type.warning'
	} as INotificationConfig;

	error = {
		title: 'i18n.oblique.notification.type.error',
		sticky: true,
	} as INotificationConfig;

	constructor(@Optional() @Inject(CLEAR_NOTIFICATIONS_ON_ROUTE_CHANGE) clear) {
		this.clearAllOnNavigate = clear || false;
	}
}
