import {Injectable, EventEmitter} from '@angular/core';
import {Notification, NotificationEvent, NotificationType} from './notification';
import {NotificationConfig} from './notification-config';

/**
 * Service for the `NotificationComponent`. Can be configured using `NotificationConfig`.
 *
 * @see NotificationComponent
 * @see NotificationConfig
 */
@Injectable()
export class NotificationService {

	public events: EventEmitter<NotificationEvent> = new EventEmitter<NotificationEvent>();

	private currentId = 0;

	constructor(public config: NotificationConfig) {
	}

	public broadcast(channel = this.config.channel, notification: Notification): Notification {
		if (!notification.id) {
			notification.id = this.currentId++;
		}

		this.events.emit({
			channel: channel,
			notification: notification
		});

		return notification;
	}

	public send(messageKey: string, title: string = '', type = NotificationType.DEFAULT, config = this.config): Notification {
		return this.broadcast(config.channel, {
			messageKey: messageKey,
			sticky: config.sticky,
			timeout: config.timeout,
			title: title,
			type: type
		});
	}

	public default(messageKey: string, title = '', config = this.config): Notification {
		return this.send(messageKey, title, NotificationType.DEFAULT, config);
	}

	public info(messageKey: string, title = '', config = this.config): Notification {
		return this.send(messageKey, title, NotificationType.INFO, config);
	}

	public success(messageKey: string, title = '', config = this.config): Notification {
		return this.send(messageKey, title, NotificationType.SUCCESS, config);
	}

	public warning(messageKey: string, title = '', config = this.config): Notification {
		return this.send(messageKey, title, NotificationType.WARNING, config);
	}

	public error(messageKey: string, title = '', config = this.config): Notification {
		return this.send(messageKey, title, NotificationType.ERROR, config);
	}

	public clear(channel = this.config.channel) {
		this.events.emit({
			channel: channel
		});
	}

	public clearAll() {
		this.events.emit(null);
	}
}
