import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {filter} from 'rxjs/operators';

import {ObENotificationPlacement, ObENotificationType, ObINotification} from './notification.model';
import {ObNotificationConfig} from './notification.config';

/**
 * Service for the `NotificationComponent`. Can be configured using `NotificationConfig`.
 *
 * @see NotificationComponent
 * @see NotificationConfig
 */
@Injectable({providedIn: 'root'})
export class ObNotificationService {
	clearAllOnNavigate = this.config.clearAllOnNavigate;
	placement: ObENotificationPlacement = this.config.placement;
	private readonly eventSubject: Subject<ObINotification> = new Subject<ObINotification>();
	private readonly events$ = this.eventSubject.asObservable();

	constructor(public config: ObNotificationConfig, router: Router) {
		router.events.pipe(filter(evt => evt instanceof NavigationEnd && this.clearAllOnNavigate)).subscribe(() => this.clearAll());
	}

	public get events(): Observable<ObINotification> {
		return this.events$;
	}

	/**
	 * Sends an _info_ notification.
	 */
	public info(config: ObINotification | string): ObINotification {
		return this.broadcast(config, ObENotificationType.INFO);
	}

	/**
	 * Sends a _success_ notification.
	 */
	public success(config: ObINotification | string): ObINotification {
		return this.broadcast(config, ObENotificationType.SUCCESS);
	}

	/**
	 * Sends a _warning_ notification.
	 */
	public warning(config: ObINotification | string): ObINotification {
		return this.broadcast(config, ObENotificationType.WARNING);
	}

	/**
	 * Sends an _error_ notification.
	 */
	public error(config: ObINotification | string): ObINotification {
		return this.broadcast(config, ObENotificationType.ERROR);
	}

	public send(config: ObINotification | string, type?: ObENotificationType): ObINotification {
		return this.broadcast(config, type || (config as ObINotification).type || ObENotificationType.INFO);
	}

	/**
	 * Broadcasts an event to clear all notifications from specified `channel`.
	 */
	public clear(channel = this.config.channel): void {
		this.eventSubject.next({channel});
	}

	/**
	 * Broadcasts an event to clear all notifications from any available.
	 */
	public clearAll(): void {
		this.eventSubject.next(null);
	}

	private broadcast(config: ObINotification | string, type: ObENotificationType): ObINotification {
		if (typeof config === 'string') {
			config = {
				message: config
			};
		}
		const notification = {
			idPrefix: config.idPrefix || `notification-${type}-${this.formatMessage(config.message, config.messageParams)}-`,
			type,
			message: config.message,
			messageParams: config.messageParams,
			title: config.title || this.config[type].title,
			titleParams: config.titleParams,
			channel: config.channel || this.config[type].channel || this.config.channel,
			sticky: config.sticky != null ? config.sticky : this.config[type].sticky != null ? this.config[type].sticky : this.config.sticky,
			timeout: config.timeout || this.config[type].timeout || this.config.timeout,
			groupSimilar: config.groupSimilar || this.config[type].groupSimilar || this.config.groupSimilar
		};
		this.eventSubject.next(notification);

		return notification;
	}

	// Do not make it static as it breaks the build
	private formatMessage(message: string, messageParams: Record<string, any>): string {
		return Object.keys(messageParams || {})
			.reduce((msg, key) => `${msg}-${messageParams[key].toString() as string}`, message.substr(0, 50))
			.replace(/[^\w]/gi, '_')
			.toLowerCase();
	}
}
