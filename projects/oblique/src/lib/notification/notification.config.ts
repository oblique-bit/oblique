import {Inject, Injectable, InjectionToken, Optional} from '@angular/core';
import {ObINotificationConfig} from './notification.interfaces';

export const CLEAR_NOTIFICATIONS_ON_ROUTE_CHANGE = new InjectionToken<boolean>('CLEAR_NOTIFICATIONS_ON_ROUTE_CHANGE');
export const GROUP_SIMILAR_NOTIFICATIONS = new InjectionToken<boolean>('GROUP_SIMILAR_NOTIFICATIONS');

@Injectable({providedIn: 'root'})
export class ObNotificationConfig {
	sticky = false;
	timeout = 3500;
	channel = 'oblique';
	clearAllOnNavigate: boolean;
	groupSimilar: boolean;

	info = {
		title: 'i18n.oblique.notification.type.info'
	} as ObINotificationConfig;

	success = {
		title: 'i18n.oblique.notification.type.success'
	} as ObINotificationConfig;

	warning = {
		title: 'i18n.oblique.notification.type.warning'
	} as ObINotificationConfig;

	error = {
		title: 'i18n.oblique.notification.type.error',
		sticky: true
	} as ObINotificationConfig;

	constructor(@Optional() @Inject(CLEAR_NOTIFICATIONS_ON_ROUTE_CHANGE) clear, @Optional() @Inject(GROUP_SIMILAR_NOTIFICATIONS) group) {
		this.clearAllOnNavigate = clear || false;
		this.groupSimilar = group || false;
	}
}
