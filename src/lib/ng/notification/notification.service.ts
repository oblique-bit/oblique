import {Injectable, Inject, Optional} from '@angular/core';
import {Notification, NotificationEvent, NotificationType} from './notification';
import {Subject} from 'rxjs/Subject';

/**
 * NotificationService
 *
 * providers:
 *    notificationTimeout: after this timeout (in ms) non sticky notifications get removed
 */
@Injectable()
export class NotificationService {
	public static DEFAULT_CHANNEL = 'default';
	public static DEFAULT_TIMEOUT = 3500;

	private emitter: Subject<NotificationEvent> = new Subject<NotificationEvent>();
	private currentId = 0;

	constructor(
		@Optional() @Inject('notificationChannel') public channel = NotificationService.DEFAULT_CHANNEL,
		@Optional() @Inject('notificationTimeout') public timeout = NotificationService.DEFAULT_TIMEOUT
	) {
		this.channel = this.channel || NotificationService.DEFAULT_CHANNEL;
		this.timeout = this.timeout || NotificationService.DEFAULT_TIMEOUT;
	}

	public subscribe(next: (value: NotificationEvent) => void, error?: (error: any) => void, complete?: () => void) {
		return this.emitter.subscribe(next, error, complete);
	}

	public broadcast(channel = NotificationService.DEFAULT_CHANNEL, notification: Notification): Notification {
		if (!notification.id) {
			notification.id = this.currentId++;
		}

		this.emitter.next({
			channel: channel,
			notification: notification
		});

		return notification;
	}

	public send(messageKey: string, title: string, sticky: boolean,
	            type: NotificationType = NotificationType.DEFAULT,
	            channel = this.channel): Notification {
		return this.broadcast(channel, {
			messageKey: messageKey,
			title: title,
			sticky: sticky,
			type: type
		});
	}

	public default(messageKey: string, title = '', sticky = false, channel = this.channel): Notification {
		return this.send(messageKey, title, sticky, NotificationType.DEFAULT, channel);
	}

	public info(messageKey: string, title = '', sticky = false, channel = this.channel): Notification {
		return this.send(messageKey, title, sticky, NotificationType.INFO, channel);
	}

	public success(messageKey: string, title = '', sticky = false, channel = this.channel): Notification {
		return this.send(messageKey, title, sticky, NotificationType.SUCCESS, channel);
	}

	public warning(messageKey: string, title = '', sticky = false, channel = this.channel): Notification {
		return this.send(messageKey, title, sticky, NotificationType.WARNING, channel);
	}

	public error(messageKey: string, title = '', sticky = true, channel = this.channel): Notification {
		return this.send(messageKey, title, sticky, NotificationType.ERROR, channel);
	}

	public clear(channel = this.channel) {
		this.emitter.next({
			channel: channel
		});
	}

	public clearAll() {
		this.emitter.next(null);
	}
}
