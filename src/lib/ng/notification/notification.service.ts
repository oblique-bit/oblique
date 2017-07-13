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

	/**
	 * Broadcasts a notification to the specified `channel`.
	 *
	 * @param {string} channel
	 * @param {Notification} notification
	 * @returns {Notification}
	 */
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

	/**
	 * Sends a notification of the specified `type` and with provided `title` and `messageKey`.
	 * An additional `NotificationConfig` can also be provided.
	 *
	 * @see broadcast
	 * @param {string} messageKey
	 * @param {string} title
	 * @param {NotificationType} type
	 * @param {NotificationConfig} config
	 * @returns {Notification}
	 */
	public send(messageKey: string, title: string = '', type = NotificationType.DEFAULT, config = this.config): Notification {
		return this.broadcast(config.channel, {
			messageKey: messageKey,
			sticky: config.sticky,
			timeout: config.timeout,
			title: title,
			type: type
		} as Notification);
	}

	/**
	 * Sends a _default_ notification.
	 *
	 * @see send
	 * @param {string} messageKey
	 * @param {string} title
	 * @param {NotificationConfig} config
	 * @returns {Notification}
	 */
	public default(messageKey: string, title = '', config = this.config): Notification {
		return this.send(messageKey, title, NotificationType.DEFAULT, config);
	}

	/**
	 * Sends an _info_ notification.
	 *
	 * @see send
	 * @param {string} messageKey
	 * @param {string} title
	 * @param {NotificationConfig} config
	 * @returns {Notification}
	 */
	public info(messageKey: string, title = '', config = this.config): Notification {
		return this.send(messageKey, title, NotificationType.INFO, config);
	}

	/**
	 * Sends a _success_ notification.
	 *
	 * @see send
	 * @param {string} messageKey
	 * @param {string} title
	 * @param {NotificationConfig} config
	 * @returns {Notification}
	 */
	public success(messageKey: string, title = '', config = this.config): Notification {
		return this.send(messageKey, title, NotificationType.SUCCESS, config);
	}

	/**
	 * Sends a _warning_ notification.
	 *
	 * @see send
	 * @param {string} messageKey
	 * @param {string} title
	 * @param {NotificationConfig} config
	 * @returns {Notification}
	 */
	public warning(messageKey: string, title = '', config = this.config): Notification {
		return this.send(messageKey, title, NotificationType.WARNING, config);
	}

	/**
	 * Sends an _error_ notification.
	 *
	 * @see send
	 * @param {string} messageKey
	 * @param {string} title
	 * @param {NotificationConfig} config
	 * @returns {Notification}
	 */
	public error(messageKey: string, title = '', config = this.config): Notification {
		return this.send(messageKey, title, NotificationType.ERROR, config);
	}

	/**
	 * Broadcasts an event to clear all notifications from specified `channel`.
	 *
	 * @param {string} channel
	 */
	public clear(channel = this.config.channel) {
		this.events.emit({
			channel: channel
		});
	}

	/**
	 * Broadcasts an event to clear all notifications from any available.
	 *
	 * @see send
	 * @param {string} messageKey
	 * @param {string} title
	 * @param {NotificationConfig} config
	 * @returns {Notification}
	 */
	public clearAll() {
		this.events.emit(null);
	}
}
