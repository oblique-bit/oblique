import {Injectable, Inject, Optional} from '@angular/core';
import {Notification, NotificationType} from './notification';

/**
 * NotificationService
 *
 * providers:
 *    notificationTimeout: after this timeout (in ms) non sticky notifications get removed
 */
@Injectable()
export class NotificationService {
	public notifications: Notification[] = [];

	private currentId = 0;

	constructor(@Optional() @Inject('notificationTimeout') private timeout?: number) {
		if (!timeout) {
			this.timeout = 5000;
		}
	}

	public add(type: NotificationType, messageKey: string, title: string, sticky: boolean): number {
		const notification = new Notification(this.currentId, type, messageKey, title, sticky);
		this.notifications.unshift(notification);
		this.notifications.sort((a: Notification, b: Notification) => b.type.priority - a.type.priority);
		if (!notification.sticky) {
			setTimeout(() => this.remove(notification.id), this.timeout);
		}
		this.currentId++;
		return notification.id;
	}

	public default(messageKey: string, title = '', sticky = false): number {
		return this.add(NotificationType.DEFAULT, messageKey, title, sticky);
	}

	public info(messageKey: string, title = '', sticky = false): number {
		return this.add(NotificationType.INFO, messageKey, title, sticky);
	}

	public success(messageKey: string, title = '', sticky = false): number {
		return this.add(NotificationType.SUCCESS, messageKey, title, sticky);
	}

	public warning(messageKey: string, title = '', sticky = false): number {
		return this.add(NotificationType.WARNING, messageKey, title, sticky);
	}

	public error(messageKey: string, title = '', sticky = true): number {
		return this.add(NotificationType.ERROR, messageKey, title, sticky);
	}

	public remove(id: number) {
		this.notifications.forEach((notification: Notification, index: number) => {
			if (id === notification.id) {
				this.notifications.splice(index, 1);
			}
		});
	}

	public clear() {
		// Clear the array without changing its reference:
		this.notifications.length = 0;
	}

}
